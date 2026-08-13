import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import useCommuterStore from '../store/useCommuterStore'
import useRealTimeBus from '../hooks/useRealTimeBus'
import { routeService } from '../services/routeService'
import { BRAND } from '../styles/brand'
import { BusMarker, StopMarker, UserLocationMarker } from '../components/MapMarkers'
import { getLocationUpdateStatus } from '../utils/busStateUtils'

export default function HomeMapScreen({ navigation }: any) {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [routeStops, setRouteStops] = useState<any[]>([])
  const [locationPermission, setLocationPermission] = useState<string | null>(null)
  const [wsConnectionTime, setWsConnectionTime] = useState(0)
  const mapRef = useRef<MapView>(null)
  const userTrackingRef = useRef(true)

  const {
    userLocation: storeUserLoc,
    setUserLocation: storeUserLocation,
    selectedRoute,
    selectedBus,
    setSelectedBus,
    setSelectedRoute,
  } = useCommuterStore()
  const { busPositions, isConnected, error } = useRealTimeBus()

  useEffect(() => {
    if (isConnected) {
      setWsConnectionTime(Date.now())
    }
  }, [isConnected])

  const liveBuses = useMemo(() => Object.values(busPositions), [busPositions])

  useEffect(() => {
    initializeLocation()
  }, [])

  useEffect(() => {
    if (selectedRoute?.id) {
      loadStopsForRoute(selectedRoute.id)
    } else {
      setRouteStops([])
    }
  }, [selectedRoute])

  useEffect(() => {
    if (routeStops.length > 0 && mapRef.current && userTrackingRef.current) {
      const coords = routeStops.map((s) => ({
        latitude: parseFloat(s.latitude),
        longitude: parseFloat(s.longitude),
      }))

      if (selectedBus?.lat && selectedBus?.lng) {
        coords.push({
          latitude: selectedBus.lat,
          longitude: selectedBus.lng,
        })
      }

      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 120, right: 60, bottom: 200, left: 60 },
          animated: true,
        })
      }, 300)
    }
  }, [routeStops, selectedBus])

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(status)
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({})
        const coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }
        setUserLocation(coords)
        storeUserLocation(coords.lat, coords.lng)
      }
    } catch {
      setLocationPermission('denied')
    } finally {
      setLoading(false)
    }
  }

  const loadStopsForRoute = async (routeId: number) => {
    try {
      const stops = await routeService.getRouteStops(routeId)
      setRouteStops(stops)
    } catch {
      setRouteStops([])
    }
  }

  const recenter = () => {
    userTrackingRef.current = true
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation?.lat || storeUserLoc?.lat || 17.7231,
        longitude: userLocation?.lng || storeUserLoc?.lng || 83.3013,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      600
    )
  }

  const handleBusPress = (bus: any) => {
    setSelectedBus(bus)
    navigation.navigate('BusDetails', { bus })
  }

  const clearSelectedJourney = () => {
    setSelectedRoute(null)
    setSelectedBus(null)
    setRouteStops([])
  }

  const handleMapPan = () => {
    userTrackingRef.current = false
  }

  const polylineCoords = routeStops.map((s) => ({
    latitude: parseFloat(s.latitude),
    longitude: parseFloat(s.longitude),
  }))

  const defaultUserLat = userLocation?.lat || storeUserLoc?.lat || 17.7231
  const defaultUserLng = userLocation?.lng || storeUserLoc?.lng || 83.3013

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={BRAND.primary} />
        <Text style={styles.loadingText}>Loading map…</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: defaultUserLat,
          longitude: defaultUserLng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPanDrag={handleMapPan}
        showsUserLocation={locationPermission === 'granted'}
      >
        {/* Route Geometry Polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor={BRAND.primary}
            strokeWidth={4}
            lineDashPhase={0}
          />
        )}

        {/* Route Stop Markers */}
        {routeStops.map((s: any, idx: number) => {
          const isOrigin = idx === 0
          const isDestination = idx === routeStops.length - 1
          return (
            <Marker
              key={`stop_${s.stop_id || idx}`}
              coordinate={{
                latitude: parseFloat(s.latitude),
                longitude: parseFloat(s.longitude),
              }}
              title={s.stop_name || `Stop ${idx + 1}`}
            >
              <StopMarker
                name={s.stop_name}
                index={idx}
                isOrigin={isOrigin}
                isDestination={isDestination}
              />
            </Marker>
          )
        })}

        {/* Live Bus Markers */}
        {liveBuses.map((bus: any) => {
          if (!bus.lat || !bus.lng) return null

          // Check if this bus is the selected bus
          const isSelected = selectedBus?.busId === bus.busId || selectedBus?.trip_id === bus.trip_id

          // Check if this bus is on the selected route
          const isOnSelectedRoute = selectedRoute && (
            selectedRoute.route_number === bus.routeNo ||
            selectedRoute.id === bus.route_id
          )

          // Highlight if on selected route but not the primary selected bus
          const isHighlighted = isOnSelectedRoute && !isSelected

          return (
            <Marker
              key={bus.busId}
              coordinate={{ latitude: bus.lat, longitude: bus.lng }}
              onPress={() => handleBusPress(bus)}
              zIndex={isSelected ? 10 : isHighlighted ? 5 : 1}
            >
              <BusMarker bus={bus} isSelected={isSelected} isHighlighted={isHighlighted} />
            </Marker>
          )
        })}
      </MapView>

      {/* Top Status Bar */}
      <View style={styles.topOverlay}>
        <View style={[styles.statusPill, { backgroundColor: isConnected ? BRAND.success : BRAND.warning }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {isConnected ? 'Live Tracking' : error ? 'Connection Error' : 'Connecting…'}
          </Text>
          {isConnected && wsConnectionTime > 0 && (
            <Text style={styles.statusSubtext}>
              Connected {Math.round((Date.now() - wsConnectionTime) / 1000)}s ago
            </Text>
          )}
        </View>

        {selectedRoute && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearSelectedJourney}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Journey Context Banner */}
      {selectedRoute && (
        <View style={styles.journeyBanner}>
          <View style={styles.bannerHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Route {selectedRoute.route_number || selectedRoute.number}
              </Text>
            </View>
            <Text style={styles.bannerTitle}>
              {selectedRoute.route_name || 'Active Journey'}
            </Text>
          </View>
          <Text style={styles.bannerStops}>
            🟢 {selectedRoute.start_stop || 'Origin'} → 🔴{' '}
            {selectedRoute.end_stop || 'Destination'}
          </Text>

          {/* Show available buses on this route */}
          <View style={styles.busesList}>
            <Text style={styles.busesLabel}>🚌 Available buses:</Text>
            {liveBuses
              .filter(
                (bus: any) =>
                  bus.routeNo === selectedRoute.route_number ||
                  bus.route_id === selectedRoute.id
              )
              .map((bus: any) => (
                <View key={bus.busId} style={styles.busListItem}>
                  <Text style={styles.busListText}>
                    Bus {bus.routeNo} • ETA: {bus.eta || '—'} min • Speed: {bus.speed || '—'} km/h
                  </Text>
                </View>
              ))}
          </View>

          {selectedBus && (
            <View style={styles.bannerStats}>
              <Text style={styles.bannerStat}>
                ⏱️ {selectedBus.eta || '—'} min
              </Text>
              <Text style={styles.bannerStat}>
                ⚡ {selectedBus.speed || '—'} km/h
              </Text>
              {selectedBus.last_updated && (
                <Text style={styles.bannerStat}>
                  🔄 {getLocationUpdateStatus(selectedBus).label}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Recenter Button */}
      <TouchableOpacity style={styles.locateBtn} onPress={recenter} activeOpacity={0.7}>
        <Text style={styles.locateIcon}>📍</Text>
      </TouchableOpacity>

      {/* SOS Button */}
      <TouchableOpacity
        style={styles.sosBtn}
        onPress={() => navigation.navigate('SOS')}
        activeOpacity={0.8}
      >
        <Text style={styles.sosBtnText}>SOS</Text>
      </TouchableOpacity>

      {/* Bottom Search Bar */}
      <TouchableOpacity
        style={styles.bottomSearch}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.bottomSearchIcon}>🔍</Text>
        <Text style={styles.bottomSearchText}>Where are you going?</Text>
        <View style={styles.goBtn}>
          <Text style={styles.goBtnText}>›</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.bg,
  },
  loadingText: {
    marginTop: 12,
    color: BRAND.textSecondary,
    fontWeight: '600',
  },
  topOverlay: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...BRAND.shadow,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.text,
  },
  statusSubtext: {
    fontSize: 10,
    color: BRAND.textSecondary,
    marginLeft: 6,
  },
  clearBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BRAND.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...BRAND.shadow,
  },
  clearBtnText: {
    fontSize: 20,
    color: BRAND.danger,
  },
  journeyBanner: {
    position: 'absolute',
    top: 116,
    left: 16,
    right: 16,
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    padding: 14,
    ...BRAND.shadow,
    borderLeftWidth: 4,
    borderLeftColor: BRAND.primary,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: BRAND.primary,
    borderRadius: BRAND.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: BRAND.text,
  },
  bannerStops: {
    fontSize: 12,
    color: BRAND.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  busesList: {
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.md,
    padding: 8,
    marginVertical: 8,
    gap: 4,
  },
  busesLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: BRAND.text,
    marginBottom: 2,
  },
  busListItem: {
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.primary,
  },
  busListText: {
    fontSize: 11,
    fontWeight: '600',
    color: BRAND.textSecondary,
  },
  bannerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  bannerStat: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND.primary,
  },
  locateBtn: {
    position: 'absolute',
    right: 16,
    bottom: 110,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...BRAND.shadow,
  },
  locateIcon: {
    fontSize: 20,
  },
  sosBtn: {
    position: 'absolute',
    right: 16,
    bottom: 170,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sosBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bottomSearch: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...BRAND.shadow,
  },
  bottomSearchIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  bottomSearchText: {
    flex: 1,
    color: BRAND.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  goBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BRAND.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
})
