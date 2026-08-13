import { BusPosition } from '../store/useCommuterStore'

export function validateBusPosition(data: any): BusPosition | null {
  if (!data || typeof data !== 'object') return null

  const busId = data.busId || data.trip_id || data.id
  if (!busId) return null

  const lat = parseFloat(data.latitude || data.lat)
  const lng = parseFloat(data.longitude || data.lng)

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null
  }

  return {
    busId: String(busId),
    lat,
    lng,
    routeNo: String(data.routeNo || data.route_number || data.route_id || 'N/A'),
    crowdLevel: Math.min(10, Math.max(0, parseInt(data.crowdLevel) || 0)),
    speed: Math.max(0, parseInt(data.speed) || 0),
    eta: data.eta ? Math.max(1, parseInt(data.eta)) : undefined,
    licensePlate: data.licensePlate || data.license_plate || data.plate,
    status: isValidStatus(data.status) ? data.status : 'LIVE',
    last_updated: data.last_updated || new Date().toISOString(),
    trip_id: data.trip_id,
    route_id: data.route_id,
    stop_etas: data.stop_etas,
  }
}

export function isValidStatus(status: any): boolean {
  const validStatuses = ['LIVE', 'APPROACHING STOP', 'AT STOP', 'STALE', 'SIGNAL LOST', 'OFFLINE']
  return validStatuses.includes(status)
}

export function isValidCoordinate(lat: any, lng: any): boolean {
  const latNum = parseFloat(lat)
  const lngNum = parseFloat(lng)
  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lngNum >= -180 &&
    lngNum <= 180
  )
}

export function sanitizeString(str: any, maxLength = 100): string {
  if (!str) return 'N/A'
  const sanitized = String(str).trim().substring(0, maxLength)
  return sanitized || 'N/A'
}

export function validateNumber(value: any, min = -Infinity, max = Infinity): number | null {
  const num = parseFloat(value)
  if (isNaN(num) || num < min || num > max) return null
  return num
}

export function validateArray<T>(
  data: any,
  validator: (item: any) => T | null
): T[] {
  if (!Array.isArray(data)) return []
  return data.map(item => validator(item)).filter((item): item is T => item !== null)
}

export function deduplicateBuses(buses: BusPosition[]): BusPosition[] {
  const seen = new Set<string>()
  return buses.filter(bus => {
    if (seen.has(bus.busId)) return false
    seen.add(bus.busId)
    return true
  })
}

export function removeStaleData(buses: BusPosition[], maxAgeSeconds = 300): BusPosition[] {
  const now = Date.now()
  return buses.filter(bus => {
    if (!bus.last_updated) return true
    const age = (now - new Date(bus.last_updated).getTime()) / 1000
    return age <= maxAgeSeconds
  })
}
