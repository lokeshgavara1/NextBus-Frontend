import { MOCK_ROUTES, MOCK_STOPS, MOCK_ROUTE_STOPS, MOCK_BUSES } from './mockData'

/**
 * Mock API Service — returns mock data instead of real API calls
 * Use this when backend is unavailable or for development/testing
 */

export const mockApiService = {
  async getRoutes() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...MOCK_ROUTES]
  },

  async getStops() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return [...MOCK_STOPS]
  },

  async getBuses() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...MOCK_BUSES]
  },

  async getFleet() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...MOCK_BUSES]
  },

  async getRouteStops(routeId: number) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const stops = MOCK_ROUTE_STOPS[routeId] || []
    return [...stops]
  },

  async searchRoutes(
    from?: string,
    to?: string,
    preference: 'fastest' | 'cheapest' | 'least-crowded' = 'fastest'
  ) {
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const results = MOCK_ROUTES.map((route) => {
        const liveBus = MOCK_BUSES.find((b) => b.route_id === route.id)
        const stops = MOCK_ROUTE_STOPS[route.id] || []
        const eta = liveBus ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 20) + 10

        return {
          route,
          bus: liveBus || null,
          eta,
          etaStatus: liveBus ? 'LIVE' : 'SCHEDULED',
          crowd: Math.floor(Math.random() * 100),
          fare: 15,
          femaleOnly: false,
          distance: Math.floor((Math.random() * 15) * 10) / 10,
          stops,
        }
      })

      // Sort by preference
      if (preference === 'fastest') {
        return results.sort((a, b) => a.eta - b.eta)
      } else if (preference === 'cheapest') {
        return results.sort((a, b) => a.fare - b.fare)
      } else if (preference === 'least-crowded') {
        return results.sort((a, b) => a.crowd - b.crowd)
      }

      return results
    } catch (error) {
      console.error('Mock searchRoutes error:', error)
      return []
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
