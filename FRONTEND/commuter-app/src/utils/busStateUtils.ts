import { BusPosition, VehicleStatus } from '../store/useCommuterStore'

export interface BusStatusInfo {
  status: VehicleStatus
  label: string
  color: string
  icon: string
  isLive: boolean
}

export interface LocationUpdateStatus {
  label: string
  color: string
  age: number // seconds since last update
}

export const deriveVehicleStatus = (
  bus: BusPosition,
  currentTime: number = Date.now()
): BusStatusInfo => {
  const lastUpdate = bus.last_updated ? new Date(bus.last_updated).getTime() : currentTime
  const ageSeconds = Math.round((currentTime - lastUpdate) / 1000)

  const status = bus.status || 'LIVE'

  switch (status) {
    case 'LIVE':
      if (ageSeconds > 60) {
        return {
          status: 'STALE',
          label: `Last seen ${formatTimeAgo(ageSeconds)} ago`,
          color: '#F59E0B',
          icon: '⚠️',
          isLive: false,
        }
      }
      return {
        status: 'LIVE',
        label: 'Live',
        color: '#16A34A',
        icon: '🟢',
        isLive: true,
      }

    case 'APPROACHING STOP':
      return {
        status: 'APPROACHING STOP',
        label: 'Approaching Stop',
        color: '#4F46E5',
        icon: '📍',
        isLive: true,
      }

    case 'AT STOP':
      return {
        status: 'AT STOP',
        label: 'At Stop',
        color: '#7C3AED',
        icon: '⏸️',
        isLive: true,
      }

    case 'SIGNAL LOST':
    case 'OFFLINE':
      return {
        status: status,
        label: status === 'OFFLINE' ? 'Offline' : 'Signal Lost',
        color: '#64748B',
        icon: '❌',
        isLive: false,
      }

    case 'STALE':
    default:
      return {
        status: 'STALE',
        label: `Last seen ${formatTimeAgo(ageSeconds)} ago`,
        color: '#F59E0B',
        icon: '⚠️',
        isLive: false,
      }
  }
}

export const formatTimeAgo = (seconds: number): string => {
  if (seconds < 10) return 'now'
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h`
}

export const getLocationUpdateStatus = (bus: BusPosition, currentTime = Date.now()): LocationUpdateStatus => {
  if (!bus.last_updated) {
    return { label: 'Location unavailable', color: '#64748B', age: Infinity }
  }

  const lastUpdate = new Date(bus.last_updated).getTime()
  const ageSeconds = Math.round((currentTime - lastUpdate) / 1000)

  if (ageSeconds < 5) {
    return { label: 'Live', color: '#16A34A', age: ageSeconds }
  } else if (ageSeconds < 30) {
    return { label: `Updated ${ageSeconds}s ago`, color: '#16A34A', age: ageSeconds }
  } else if (ageSeconds < 120) {
    return { label: `Updated ${Math.round(ageSeconds / 60)}m ago`, color: '#F59E0B', age: ageSeconds }
  } else {
    return { label: 'Location stale', color: '#DC2626', age: ageSeconds }
  }
}

export const isValidCoordinate = (lat: number | undefined, lng: number | undefined): boolean => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371 // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
