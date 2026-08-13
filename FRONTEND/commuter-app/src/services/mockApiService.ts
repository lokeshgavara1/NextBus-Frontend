import { MOCK_ROUTES, MOCK_STOPS, MOCK_ROUTE_STOPS, MOCK_BUSES } from './mockData'

/**
 * Mock API Service — returns mock data instead of real API calls
 * Use this when backend is unavailable or for development/testing
 */

export const mockApiService = {
  async getRoutes() {
    // Instant load - no delay
    return [...MOCK_ROUTES]
  },

  async getStops() {
    // Instant load - no delay
    return [...MOCK_STOPS]
  },

  async getBuses() {
    // Instant load - no delay
    return [...MOCK_BUSES]
  },

  async getFleet() {
    // Instant load - no delay
    return [...MOCK_BUSES]
  },

  async getRouteStops(routeId: number) {
    // Instant load - no delay
    const stops = MOCK_ROUTE_STOPS[routeId] || []
    return [...stops]
  },

  async searchRoutes(
    from?: string,
    to?: string,
    preference: 'fastest' | 'cheapest' | 'least-crowded' = 'fastest'
  ) {
    // Ultra-fast search - minimal delay for UI feedback only
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Fast optimized search with caching
    try {
      let filteredRoutes = MOCK_ROUTES

      // Quick filter if from/to provided
      if (from && to) {
        const fromKeyword = from.toLowerCase().split(' ')[0]
        const toKeyword = to.toLowerCase().split(' ')[0]

        filteredRoutes = MOCK_ROUTES.filter((route) => {
          const routeLower = (route.route_name + route.start_stop + route.end_stop).toLowerCase()
          return routeLower.includes(fromKeyword) || routeLower.includes(toKeyword)
        })

        // Fallback: return all routes if no exact match
        if (filteredRoutes.length === 0) {
          filteredRoutes = MOCK_ROUTES
        }
      }

      // Build results instantly without loops
      const results = filteredRoutes.map((route) => {
        const liveBus = MOCK_BUSES[route.id - 1] // Direct index access instead of find()
        const stops = MOCK_ROUTE_STOPS[route.id] || []

        return {
          route,
          bus: liveBus || null,
          eta: liveBus ? 8 : 20,
          etaStatus: liveBus ? 'LIVE' : 'SCHEDULED',
          crowd: Math.floor(Math.random() * 100),
          fare: 150 + Math.random() * 200,
          femaleOnly: false,
          distance: 200,
          stops,
        }
      })

      // Sort by preference (optimized)
      if (preference === 'fastest') {
        return results.sort((a, b) => (a.eta || 999) - (b.eta || 999))
      } else if (preference === 'cheapest') {
        return results.sort((a, b) => a.fare - b.fare)
      } else {
        return results.sort((a, b) => a.crowd - b.crowd)
      }
    } catch (error) {
      console.error('Mock searchRoutes error:', error)
      return MOCK_ROUTES.map((route) => ({
        route,
        bus: MOCK_BUSES[route.id - 1] || null,
        eta: 15,
        etaStatus: 'SCHEDULED',
        crowd: 50,
        fare: 150,
        femaleOnly: false,
        distance: 200,
        stops: MOCK_ROUTE_STOPS[route.id] || [],
      }))
    }
  },

  async triggerSOS(lat: number, lng: number) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      id: `sos-${Date.now()}`,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
    }
  },

  async setAlert(busId: string, stopId: string, thresholdMinutes: number) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      id: `alert-${Date.now()}`,
      busId,
      stopId,
      thresholdMinutes,
    }
  },

  async cancelAlert(alertId: string) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { id: alertId, cancelled: true }
  },
}

export default mockApiService
