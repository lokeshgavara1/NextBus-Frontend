import { useEffect, useRef, useState } from 'react'
import useCommuterStore from '../store/useCommuterStore'
import { validateBusPosition, deduplicateBuses } from '../utils/dataValidation'
import { createMockWebSocket } from '../services/mockWebSocket'

/**
 * useRealTimeBus — live bus tracking for the Commuter App.
 *
 * Subscribes to the backend's raw WebSocket at ws://<server>/ws/subscribe.
 * Falls back to mock WebSocket if backend unavailable.
 * Protocol (see BACKEND/src/tracking/tracking.ws.ts):
 *   on connect  → { type: 'SNAPSHOT',   data: LiveBusState[] }
 *   per update  → { type: 'BUS_UPDATE', data: LiveBusState & { stop_etas } }
 *   bus offline → { type: 'BUS_OFFLINE', trip_id }
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true'
const MAX_RECONNECT_DELAY = 30000
const INITIAL_RECONNECT_DELAY = 3000

/** Map a backend LiveBusState into the store's BusPosition shape */
function toBusPosition(bus: any, routeNumbers: Record<number, string>) {
  // First upcoming stop with a numeric ETA
  const nextEta = (bus.stop_etas || []).find(
    (s: any) => s.eta_seconds !== null && s.eta_seconds !== undefined
  )

  const timestamp = new Date().toISOString()

  return {
    busId: String(bus.trip_id),
    lat: bus.latitude,
    lng: bus.longitude,
    routeNo: routeNumbers[bus.route_id] || String(bus.route_id),
    crowdLevel: Math.min(10, Math.round((bus.occupancy_count || 0) / 5)),
    speed: Math.round(bus.speed || 0),
    eta: nextEta ? Math.max(1, Math.round(nextEta.eta_seconds / 60)) : undefined,
    licensePlate: bus.license_plate,
    status: bus.status || 'LIVE',
    last_updated: bus.last_updated || timestamp,
    trip_id: bus.trip_id,
    route_id: bus.route_id,
    stop_etas: bus.stop_etas,
  }
}

export default function useRealTimeBus(routeId?: number) {
  const wsRef = useRef<WebSocket | null>(null)
  const routeNumbersRef = useRef<Record<number, string>>({})
  const reconnectAttemptsRef = useRef(0)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { busPositions, updateBusPosition, removeBusPosition, setBusPositions } = useCommuterStore()

  useEffect(() => {
    let cancelled = false
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    // Load route_id → route_number mapping once for friendly labels
    fetch(`${API_URL}/api/routes`)
      .then((r) => r.json())
      .then((routes: any[]) => {
        const map: Record<number, string> = {}
        for (const r of routes) map[r.id] = r.route_number
        routeNumbersRef.current = map
      })
      .catch(() => { /* labels fall back to route_id */ })

    const wsUrl =
      API_URL.replace(/^http/, 'ws') +
      '/ws/subscribe' +
      (routeId ? `?route_id=${routeId}` : '')

    const connect = () => {
      if (cancelled) return

      let ws: WebSocket | any
      try {
        ws = new WebSocket(wsUrl)
      } catch (err) {
        // WebSocket not available, use mock
        console.warn('WebSocket error, using mock WebSocket:', err)
        ws = createMockWebSocket(wsUrl)
      }

      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data as string)
          if (msg.type === 'SNAPSHOT') {
            const positions: Record<string, any> = {}
            for (const bus of msg.data) {
              const validBus = validateBusPosition(bus)
              if (validBus) {
                positions[validBus.busId] = {
                  ...toBusPosition(bus, routeNumbersRef.current),
                  ...validBus,
                }
              }
            }
            setBusPositions(deduplicateBuses(Object.values(positions)))
          } else if (msg.type === 'BUS_UPDATE') {
            const validBus = validateBusPosition(msg.data)
            if (validBus) {
              const pos = { ...toBusPosition(msg.data, routeNumbersRef.current), ...validBus }
              updateBusPosition(pos.busId, pos)
            }
          } else if (msg.type === 'BUS_OFFLINE') {
            removeBusPosition(String(msg.trip_id))
          }
        } catch {
          /* ignore malformed frames */
        }
      }

      ws.onerror = () => {
        setError('Live tracking connection error')
        setIsConnected(false)
      }

      ws.onclose = () => {
        setIsConnected(false)
        if (!cancelled) {
          reconnectAttemptsRef.current += 1
          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(1.5, reconnectAttemptsRef.current),
            MAX_RECONNECT_DELAY
          )
          reconnectTimer = setTimeout(connect, delay)
        }
      }
    }

    connect()

    return () => {
      cancelled = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [routeId])

  return { busPositions, isConnected, error }
}
