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
      // Filter routes based on origin and destination
      let filteredRoutes = MOCK_ROUTES

      // If from and to are provided, filter routes that can make this journey
      if (from && to) {
        filteredRoutes = MOCK_ROUTES.filter((route) => {
          const stops = MOCK_ROUTE_STOPS[route.id] || []
          const stopNames = stops.map((s) => s.stop_name.toLowerCase())
          const fromLower = from.toLowerCase()
          const toLower = to.toLowerCase()

          // Check if route contains both stops or is connecting city
          const hasFrom = stopNames.some((s) => s.includes(fromLower.split(' ')[0]))
          const hasTo = stopNames.some((s) => s.includes(toLower.split(' ')[0]))

          return hasFrom || hasTo || stops.length > 0
        })
      }

      // If no routes found based on stops, return the most relevant routes
      if (filteredRoutes.length === 0) {
        filteredRoutes = MOCK_ROUTES.slice(0, 5)
      }

      const results = filteredRoutes.map((route) => {
        const liveBus = MOCK_BUSES.find((b) => b.route_id === route.id)
        const stops = MOCK_ROUTE_STOPS[route.id] || []
        const distance = Math.floor((Math.random() * 200) + 100)
        const eta = liveBus ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 30) + 15
        const fare = Math.floor(Math.random() * 300) + 100

        return {
          route,
          bus: liveBus || null,
          eta,
          etaStatus: liveBus ? 'LIVE' : 'SCHEDULED',
          crowd: Math.floor(Math.random() * 100),
          fare,
          femaleOnly: false,
          distance: distance / 10,
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
