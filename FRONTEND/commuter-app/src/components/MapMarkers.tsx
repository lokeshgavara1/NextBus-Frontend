import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BusPosition } from '../store/useCommuterStore'
import { deriveVehicleStatus, isValidCoordinate } from '../utils/busStateUtils'
import { BRAND } from '../styles/brand'

interface BusMarkerProps {
  bus: BusPosition
  isSelected?: boolean
  isHighlighted?: boolean
}

export function BusMarker({ bus, isSelected = false, isHighlighted = false }: BusMarkerProps) {
  if (!isValidCoordinate(bus.lat, bus.lng)) {
    return null
  }

  const statusInfo = deriveVehicleStatus(bus)

  // Scale based on state
  const scale = isSelected ? 1.4 : isHighlighted ? 1.25 : 1

  // Background color based on state
  const bgColor = isSelected
    ? statusInfo.color
    : isHighlighted
      ? BRAND.primary
      : BRAND.surface

  const textColor = isSelected || isHighlighted ? '#FFFFFF' : statusInfo.color

  return (
    <View
      style={[
        styles.busMarkerContainer,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <View
        style={[
          styles.busMarker,
          {
            backgroundColor: bgColor,
            borderColor: statusInfo.color,
            borderWidth: isSelected ? 0 : isHighlighted ? 3 : 2,
            shadowOpacity: isSelected ? 0.4 : isHighlighted ? 0.3 : 0.15,
            elevation: isSelected ? 8 : isHighlighted ? 6 : 3,
          },
        ]}
      >
        <Text style={styles.busIcon}>🚌</Text>
        <Text
          style={[
            styles.busNumber,
            {
              color: textColor,
              fontWeight: isSelected ? '900' : isHighlighted ? '800' : '700',
            },
          ]}
        >
          {bus.routeNo}
        </Text>
      </View>

      {/* Status indicator */}
      <View
        style={[
          styles.statusIndicator,
          {
            backgroundColor: statusInfo.color,
            borderWidth: isSelected ? 3 : 2,
            borderColor: '#FFFFFF',
            width: isSelected ? 28 : 24,
            height: isSelected ? 28 : 24,
          },
        ]}
      >
        <Text style={[styles.statusIcon, { fontSize: isSelected ? 14 : 12 }]}>
          {statusInfo.icon}
        </Text>
      </View>

      {/* Selection ring for highlighted buses */}
      {isHighlighted && (
        <View
          style={[
            styles.highlightRing,
            {
              borderColor: BRAND.primary,
            },
          ]}
        />
      )}
    </View>
  )
}

interface StopMarkerProps {
  name: string
  index: number
  isOrigin?: boolean
  isDestination?: boolean
  isCurrent?: boolean
}

export function StopMarker({ name, index, isOrigin = false, isDestination = false, isCurrent = false }: StopMarkerProps) {
  const bgColor = isDestination ? BRAND.danger : isOrigin ? BRAND.success : isCurrent ? BRAND.primary : BRAND.primary
  const size = isDestination || isOrigin ? 32 : 26

  return (
    <View style={[styles.stopMarkerContainer, { width: size, height: size }]}>
      {isOrigin && <Text style={styles.stopMarkerIcon}>🟢</Text>}
      {isDestination && <Text style={styles.stopMarkerIcon}>🔴</Text>}
      {!isOrigin && !isDestination && (
        <View style={[styles.stopMarker, { backgroundColor: bgColor, width: size, height: size }]}>
          <Text style={[styles.stopNumber, { fontSize: size === 32 ? 12 : 10 }]}>{index + 1}</Text>
        </View>
      )}

      {isCurrent && (
        <View style={[styles.currentStopRing, { width: size + 8, height: size + 8 }]} />
      )}
    </View>
  )
}

interface UserLocationMarkerProps {
  accuracy?: number
}

export function UserLocationMarker({ accuracy }: UserLocationMarkerProps) {
  return (
    <View style={styles.userLocationContainer}>
      <View style={styles.userLocationAccuracyRing} />
      <View style={styles.userLocationDot} />
      <View style={styles.userLocationInner} />
    </View>
  )
}

const styles = StyleSheet.create({
  busMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  busMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: BRAND.surface,
    borderWidth: 2,
    minWidth: 50,
  },
  busIcon: {
    fontSize: 14,
    marginRight: 3,
  },
  busNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND.primary,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusIcon: {
    fontSize: 12,
  },
  highlightRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: BRAND.primary,
    opacity: 0.6,
  },

  stopMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BRAND.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stopNumber: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  stopMarkerIcon: {
    fontSize: 20,
  },
  currentStopRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BRAND.primary,
  },

  userLocationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  userLocationAccuracyRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND.primary,
    opacity: 0.1,
  },
  userLocationDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND.primary,
    opacity: 0.2,
  },
  userLocationInner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BRAND.primary,
  },
})
