import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import useCommuterStore from '../store/useCommuterStore'
import { routeService } from '../services/routeService'
import { BRAND } from '../styles/brand'

export default function SearchRoutesScreen({ navigation }: any) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stops, setStops] = useState<any[]>([])
  const [showFromModal, setShowFromModal] = useState(false)
  const [showToModal, setShowToModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [stopsLoading, setStopsLoading] = useState(true)
  const { selectedCity, setSelectedRoute, setSelectedBus, addSavedRoute } = useCommuterStore()

  // Check if city is selected, if not show city selection
  useEffect(() => {
    if (!selectedCity) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'CitySelection' }],
      })
    }
  }, [selectedCity, navigation])

  // Load all stops on component mount
  useEffect(() => {
    loadStops()
  }, [])

  const loadStops = async () => {
    try {
      setStopsLoading(true)
      const allStops = await routeService.getStops()

      // Filter stops by city
      if (selectedCity === 'karnataka') {
        // Karnataka stops (IDs 1-20)
        const karnatakaCityNames = [
          'Bangalore', 'Mysore', 'Channapatna', 'Belgaum', 'Pune',
          'Hyderabad', 'Mangalore', 'Tumkur', 'Chikmagalur', 'Hospet',
          'Chitradurga', 'Davangere', 'Kolar', 'Tandur', 'Electronic City'
        ]
        const filtered = allStops.filter((stop) =>
          karnatakaCityNames.some((city) =>
            stop.stop_name.toLowerCase().includes(city.toLowerCase())
          )
        )
        setStops(filtered)
      } else if (selectedCity === 'visakhapatnam') {
        // Visakhapatnam stops (city names)
        const vizagCityNames = [
          'Visakhapatnam', 'Vizag', 'Hyderabad', 'Bangalore', 'Chennai',
          'Pune', 'Ongole', 'Nellore', 'Goa', 'Panaji', 'Belgaum', 'Kailasagiri'
        ]
        const filtered = allStops.filter((stop) =>
          vizagCityNames.some((city) =>
            stop.stop_name.toLowerCase().includes(city.toLowerCase())
          )
        )
        setStops(filtered)
      } else {
        setStops(allStops || [])
      }
    } catch (err) {
      console.error('Failed to load stops:', err)
      setStops([])
    } finally {
      setStopsLoading(false)
    }
  }

  const getFilteredStops = () => {
    if (!searchQuery.trim()) return stops
    return stops.filter((stop) =>
      stop.stop_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleSelectOrigin = (stop: any) => {
    setFrom(stop.stop_name)
    setShowFromModal(false)
    setSearchQuery('')
  }

  const handleSelectDestination = (stop: any) => {
    setTo(stop.stop_name)
    setShowToModal(false)
    setSearchQuery('')
  }

  const findRoutes = async () => {
    if (!from.trim() || !to.trim()) {
      setError('Please select both origin and destination')
      setResults([])
      return
    }

    if (from === to) {
      setError('Origin and destination cannot be the same')
      setResults([])
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await routeService.searchRoutes(from, to, 'fastest')
      setLoading(false)

      if (!res || !Array.isArray(res)) {
        setError('Invalid response from server')
        setResults([])
        return
      }

      // Filter results by selected city
      let filteredResults = res
      if (selectedCity === 'karnataka') {
        filteredResults = res.filter((r) => r.route?.route_number?.includes('K'))
      } else if (selectedCity === 'visakhapatnam') {
        filteredResults = res.filter((r) => r.route?.route_number?.includes('V'))
      }

      if (filteredResults.length === 0) {
        setResults([])
        setError(null)
      } else {
        setResults(filteredResults)
        setError(null)
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search routes. Please try again.')
      setResults([])
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setResults(null)
    setError(null)
    setFrom('')
    setTo('')
    setSearchQuery('')
  }

  const swapOriginDestination = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSelectRoute = (res: any) => {
    const routeObj = {
      id: res.route.id,
      route_number: res.route.route_number,
      route_name: res.route.route_name,
      start_stop: res.route.start_stop,
      end_stop: res.route.end_stop,
    }
    setSelectedRoute(routeObj)

    // If there's a live bus for this route, select it
    if (res.bus) {
      setSelectedBus({
        busId: String(res.bus.trip_id || res.bus.id),
        trip_id: res.bus.trip_id,
        route_id: res.bus.route_id,
        lat: res.bus.latitude,
        lng: res.bus.longitude,
        routeNo: res.route.route_number,
        crowdLevel: res.bus.occupancy_count ? Math.min(10, Math.round(res.bus.occupancy_count / 5)) : 0,
        speed: res.bus.speed,
        eta: res.eta,
        status: res.bus.status || 'LIVE',
        last_updated: res.bus.last_updated,
        licensePlate: res.bus.license_plate,
        stop_etas: res.bus.stop_etas,
      })
    } else {
      // No live bus, clear selection but keep route selected
      setSelectedBus(null)
    }

    addSavedRoute(routeObj)
    navigation.navigate('Map')
  }

  const crowdLabel = (count: number) => {
    if (count <= 35) return { text: 'Low Crowd', color: BRAND.success }
    if (count <= 70) return { text: 'Medium Crowd', color: BRAND.warning }
    return { text: 'High Crowd', color: BRAND.danger }
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>🚌 Next Bus</Text>
        </View>

        {/* Plan your trip card */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>Plan your trip</Text>
              <Text style={styles.planSub}>
                {selectedCity === 'karnataka'
                  ? 'Find the quickest route across Karnataka.'
                  : 'Find the quickest route across Visakhapatnam.'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changeCityButton}
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'CitySelection' }],
              })}
            >
              <Text style={styles.changeCityText}>
                {selectedCity === 'karnataka' ? '🏛️' : '🌊'}
              </Text>
              <Text style={styles.changeCityLabel}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Stop Selection Container */}
          <View style={styles.stopSelectionContainer}>
            {/* Origin Selection */}
            <TouchableOpacity
              style={styles.stopSelector}
              onPress={() => {
                setShowFromModal(true)
                setSearchQuery('')
              }}
            >
              <Text style={styles.stopIcon}>🟢</Text>
              <View style={styles.stopSelectorContent}>
                <Text style={styles.stopLabel}>From</Text>
                <Text style={[styles.stopValue, !from && styles.placeholder]}>
                  {from || 'Select origin'}
                </Text>
              </View>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Swap Button - Centered Between */}
            <TouchableOpacity style={styles.swapButton} onPress={swapOriginDestination}>
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>

            {/* Destination Selection */}
            <TouchableOpacity
              style={styles.stopSelector}
              onPress={() => {
                setShowToModal(true)
                setSearchQuery('')
              }}
            >
              <Text style={styles.stopIcon}>🔴</Text>
              <View style={styles.stopSelectorContent}>
                <Text style={styles.stopLabel}>To</Text>
                <Text style={[styles.stopValue, !to && styles.placeholder]}>
                  {to || 'Select destination'}
                </Text>
              </View>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

        <TouchableOpacity onPress={findRoutes} activeOpacity={0.85} disabled={loading}>
          <LinearGradient
            colors={BRAND.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.ctaText}>🧭  Find Routes</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Search Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={findRoutes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND.primary} />
          <Text style={styles.loadingText}>Searching routes...</Text>
        </View>
      )}

      {/* Results */}
      {results !== null && !loading && (
        <>
          {results.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>AVAILABLE ROUTES</Text>
              {results.map((r: any, idx: number) => {
                const crowd = crowdLabel(r.crowd || 30)
                return (
                  <TouchableOpacity
                    key={r.route.id || idx}
                    style={styles.resultCard}
                    activeOpacity={0.85}
                    onPress={() => handleSelectRoute(r)}
                  >
                    <View style={styles.resultHeader}>
                      <View style={styles.routeBadge}>
                        <Text style={styles.routeBadgeText}>Route {r.route.route_number}</Text>
                      </View>
                      <Text style={styles.resultEta}>
                        ⏱ {r.eta} min
                      </Text>
                    </View>
                    <Text style={styles.resultName}>{r.route.route_name}</Text>
                    <Text style={styles.resultStops}>
                      🟢 {r.route.start_stop} → 🔴 {r.route.end_stop}
                    </Text>
                    <View style={styles.resultFooter}>
                      <Text style={[styles.crowdText, { color: crowd.color }]}>
                        👥 {crowd.text} ({r.crowd}%)
                      </Text>
                      <Text style={styles.fareTag}>₹{r.fare}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🚌</Text>
              <Text style={styles.emptyTitle}>No Routes Found</Text>
              <Text style={styles.emptyMessage}>
                Try searching with different stops or check back later
              </Text>
              <TouchableOpacity style={styles.tryAgainButton} onPress={clearSearch}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Map preview */}
      <TouchableOpacity
        style={styles.mapPreview}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.mapPreviewEmoji}>🗺️</Text>
        <Text style={styles.mapPreviewText}>Explore Full City Map</Text>
      </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Origin Selection Modal */}
      <Modal
        visible={showFromModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFromModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowFromModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Origin</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search stops..."
                placeholderTextColor={BRAND.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <FlatList
              data={getFilteredStops()}
              keyExtractor={(item) => String(item.stop_id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stopOption}
                  onPress={() => handleSelectOrigin(item)}
                >
                  <Text style={styles.stopOptionIcon}>📍</Text>
                  <View style={styles.stopOptionContent}>
                    <Text style={styles.stopOptionName}>{item.stop_name}</Text>
                  </View>
                  {from === item.stop_name && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No stops found</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Destination Selection Modal */}
      <Modal
        visible={showToModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowToModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowToModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Destination</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search stops..."
                placeholderTextColor={BRAND.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <FlatList
              data={getFilteredStops()}
              keyExtractor={(item) => String(item.stop_id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stopOption}
                  onPress={() => handleSelectDestination(item)}
                >
                  <Text style={styles.stopOptionIcon}>📍</Text>
                  <View style={styles.stopOptionContent}>
                    <Text style={styles.stopOptionName}>{item.stop_name}</Text>
                  </View>
                  {to === item.stop_name && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No stops found</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: BRAND.surface,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND.text,
  },
  planCard: {
    margin: 16,
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.xl,
    padding: 20,
    paddingTop: 24,
    ...BRAND.shadow,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.text,
    letterSpacing: -0.3,
  },
  planSub: {
    fontSize: 13,
    color: BRAND.textSecondary,
    marginTop: 4,
    marginBottom: 0,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  changeCityButton: {
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  changeCityText: {
    fontSize: 18,
  },
  changeCityLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: BRAND.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 13,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
    color: BRAND.text,
  },
  cta: {
    height: 50,
    borderRadius: BRAND.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: BRAND.textTertiary,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    padding: 16,
    ...BRAND.shadow,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeBadge: {
    backgroundColor: BRAND.primary,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  routeBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resultEta: {
    fontSize: 14,
    fontWeight: '800',
    color: BRAND.success,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.text,
  },
  resultStops: {
    fontSize: 12,
    color: BRAND.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crowdText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fareTag: {
    fontSize: 13,
    fontWeight: '800',
    color: BRAND.primary,
  },
  mapPreview: {
    marginHorizontal: 16,
    marginTop: 20,
    height: 120,
    borderRadius: BRAND.radius.xl,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPreviewEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  mapPreviewText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.textSecondary,
  },
  loadingContainer: {
    marginHorizontal: 16,
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND.textSecondary,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 40,
    backgroundColor: BRAND.dangerSoft,
    borderRadius: BRAND.radius.lg,
    padding: 24,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND.danger,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: BRAND.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: BRAND.danger,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 40,
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.lg,
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND.text,
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 13,
    color: BRAND.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  tryAgainButton: {
    backgroundColor: BRAND.primary,
    borderRadius: BRAND.radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  tryAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Stop Selection Styles
  stopSelectionContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  stopSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    ...BRAND.shadow,
  },
  stopIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  stopSelectorContent: {
    flex: 1,
  },
  stopLabel: {
    fontSize: 10,
    color: BRAND.textSecondary,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  stopValue: {
    fontSize: 15,
    color: BRAND.text,
    fontWeight: '800',
  },
  placeholder: {
    color: BRAND.textTertiary,
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: 14,
    color: BRAND.primary,
    marginLeft: 10,
    fontWeight: '700',
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8DEFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -22,
    zIndex: 10,
  },
  swapIcon: {
    fontSize: 22,
    color: BRAND.primary,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: BRAND.bg,
    borderTopLeftRadius: BRAND.radius.xl,
    borderTopRightRadius: BRAND.radius.xl,
    marginTop: 100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  modalClose: {
    fontSize: 24,
    color: BRAND.text,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND.text,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.pill,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: BRAND.text,
  },
  stopOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  stopOptionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  stopOptionContent: {
    flex: 1,
  },
  stopOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND.text,
  },
  checkmark: {
    fontSize: 18,
    color: BRAND.success,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: BRAND.textSecondary,
    marginTop: 20,
  },
})
