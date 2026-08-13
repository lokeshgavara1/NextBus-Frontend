import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BRAND } from '../styles/brand'

export interface StatusIndicatorProps {
  status: 'live' | 'stale' | 'offline' | 'error' | 'connecting'
  message: string
  timestamp?: string
}

export function StatusIndicator({ status, message, timestamp }: StatusIndicatorProps) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    live: { bg: BRAND.successSoft, text: BRAND.success, dot: '#16A34A' },
    stale: { bg: BRAND.warningSoft, text: BRAND.warning, dot: '#F59E0B' },
    offline: { bg: BRAND.dangerSoft, text: BRAND.danger, dot: '#DC2626' },
    error: { bg: BRAND.dangerSoft, text: BRAND.danger, dot: '#DC2626' },
    connecting: { bg: '#E0E7FF', text: BRAND.primary, dot: BRAND.primary },
  }

  const config = colors[status] || colors.connecting

  return (
    <View style={[styles.indicator, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: config.text }]}>{message}</Text>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>
    </View>
  )
}

export function ConnectionStatusBar({ isConnected, isConnecting = false }: { isConnected: boolean; isConnecting?: boolean }) {
  if (isConnected) {
    return (
      <View style={[styles.bar, styles.barConnected]}>
        <View style={styles.pulse} />
        <Text style={styles.barText}>🟢 Live Tracking Connected</Text>
      </View>
    )
  }

  if (isConnecting) {
    return (
      <View style={[styles.bar, styles.barConnecting]}>
        <View style={styles.pulse} />
        <Text style={styles.barText}>⟳ Reconnecting...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.bar, styles.barDisconnected]}>
      <Text style={styles.barText}>❌ Live Tracking Unavailable</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BRAND.radius.md,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    color: BRAND.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  barConnected: {
    backgroundColor: BRAND.successSoft,
  },
  barConnecting: {
    backgroundColor: '#E0E7FF',
  },
  barDisconnected: {
    backgroundColor: BRAND.dangerSoft,
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND.success,
  },
  barText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND.textSecondary,
  },
})
