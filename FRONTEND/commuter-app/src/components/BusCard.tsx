import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BusPosition } from '../store/useCommuterStore'
import { deriveVehicleStatus, getLocationUpdateStatus } from '../utils/busStateUtils'
import { BRAND } from '../styles/brand'

interface BusCardProps {
  bus: BusPosition
  onPress?: (bus: BusPosition) => void
  isSelected?: boolean
}

export function BusCard({ bus, onPress, isSelected = false }: BusCardProps) {
  const statusInfo = deriveVehicleStatus(bus)
  const updateStatus = getLocationUpdateStatus(bus)

  const handlePress = () => {
    if (onPress) onPress(bus)
  }

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Header with route number and status */}
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeNumber}>🚌 {bus.routeNo}</Text>
          <View style={[styles.statusIndicator, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          </View>
        </View>
        <View style={styles.etaContainer}>
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={styles.etaValue}>{bus.eta || '—'} min</Text>
        </View>
      </View>

      {/* Main info */}
      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[styles.infoValue, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Speed:</Text>
          <Text style={styles.infoValue}>{bus.speed || '—'} km/h</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Occupancy:</Text>
          <Text style={styles.infoValue}>{Math.round((bus.crowdLevel || 0) * 10)}%</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={[styles.infoValue, { color: updateStatus.color }]}>
            {updateStatus.label}
          </Text>
        </View>

        {bus.licensePlate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plate:</Text>
            <Text style={[styles.infoValue, styles.licensePlate]}>{bus.licensePlate}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap to view details on map</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    ...BRAND.shadow,
  },
  cardSelected: {
    borderColor: BRAND.primary,
    backgroundColor: '#F8F4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: BRAND.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND.primary,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 12,
  },
  etaContainer: {
    alignItems: 'flex-end',
  },
  etaLabel: {
    fontSize: 10,
    color: BRAND.textSecondary,
    fontWeight: '600',
  },
  etaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: BRAND.success,
  },
  body: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND.textSecondary,
    flex: 0.35,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND.text,
    flex: 0.65,
    textAlign: 'right',
  },
  licensePlate: {
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: BRAND.surfaceMuted,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
  },
  footerText: {
    fontSize: 11,
    color: BRAND.textSecondary,
    fontStyle: 'italic',
  },
})
