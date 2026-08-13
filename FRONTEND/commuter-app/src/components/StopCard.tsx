import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BRAND } from '../styles/brand'

export interface Stop {
  stop_id: number
  stop_name: string
  latitude: number
  longitude: number
  stop_order?: number
  eta_seconds?: number | null
}

interface StopCardProps {
  stop: Stop
  onPress?: (stop: Stop) => void
  isSelected?: boolean
  isOrigin?: boolean
  isDestination?: boolean
  upcoming?: boolean
}

export function StopCard({
  stop,
  onPress,
  isSelected = false,
  isOrigin = false,
  isDestination = false,
  upcoming = false,
}: StopCardProps) {
  const handlePress = () => {
    if (onPress) onPress(stop)
  }

  const etaMinutes = stop.eta_seconds ? Math.ceil(stop.eta_seconds / 60) : null

  let icon = '📍'
  if (isOrigin) icon = '🟢'
  if (isDestination) icon = '🔴'
  if (upcoming) icon = '🎯'

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.content}>
        <View style={styles.stopIconContainer}>
          <Text style={styles.stopIcon}>{icon}</Text>
        </View>

        <View style={styles.stopInfo}>
          <Text style={styles.stopName}>{stop.stop_name}</Text>
          <View style={styles.badges}>
            {isOrigin && <Text style={[styles.badge, styles.badgeOrigin]}>Origin</Text>}
            {isDestination && (
              <Text style={[styles.badge, styles.badgeDestination]}>Destination</Text>
            )}
            {upcoming && <Text style={[styles.badge, styles.badgeUpcoming]}>Next Stop</Text>}
            {stop.stop_order && (
              <Text style={[styles.badge, styles.badgeOrder]}>Stop #{stop.stop_order}</Text>
            )}
          </View>
        </View>

        {etaMinutes && (
          <View style={styles.etaContainer}>
            <Text style={styles.etaValue}>{etaMinutes}</Text>
            <Text style={styles.etaLabel}>min</Text>
          </View>
        )}
      </View>

      {isSelected && <View style={styles.selectedIndicator} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: BRAND.border,
    overflow: 'hidden',
    ...BRAND.shadow,
  },
  cardSelected: {
    borderColor: BRAND.primary,
    backgroundColor: '#F8F4FF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  stopIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: {
    fontSize: 24,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND.text,
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BRAND.radius.sm,
  },
  badgeOrigin: {
    backgroundColor: BRAND.successSoft,
    color: BRAND.success,
  },
  badgeDestination: {
    backgroundColor: BRAND.dangerSoft,
    color: BRAND.danger,
  },
  badgeUpcoming: {
    backgroundColor: BRAND.warningSoft,
    color: BRAND.warning,
  },
  badgeOrder: {
    backgroundColor: BRAND.surfaceMuted,
    color: BRAND.textSecondary,
  },
  etaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.primary,
    borderRadius: BRAND.radius.md,
    minWidth: 44,
    paddingVertical: 6,
  },
  etaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  etaLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: BRAND.primary,
  },
})
