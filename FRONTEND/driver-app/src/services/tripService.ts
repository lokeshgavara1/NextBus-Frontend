import axios from 'axios';
import { mockDriver, mockRoute, mockStops, mockBus } from '../data/mockData';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';

/** Enriched trip returned by the backend (see BACKEND/src/types) */
export interface BackendTrip {
  id: number;
  trip_id?: number;
  route_id: number;
  bus_id: number;
  driver_id: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  started_at: string | null;
  ended_at: string | null;
  route_number: string;
  route_name: string;
  license_plate: string;
  bus_number: string | null;
  driver_name: string;
}

export interface BackendRouteStop {
  stop_id: number;
  stop_name: string;
  latitude: number;
  longitude: number;
  stop_order: number;
}

class TripService {
  /**
   * Start a trip the way the backend expects:
   * POST /api/trips/start  { route_number, driver_phone }
   * The server resolves route/driver/bus IDs internally.
   */
  async startTrip(route_number: string, driver_phone: string): Promise<BackendTrip> {
    try {
      if (USE_MOCK_DATA) {
        return this.getMockTrip(route_number, driver_phone);
      }
      const response = await axios.post(`${API_URL}/api/trips/start`, {
        route_number,
        driver_phone,
      });
      return response.data;
    } catch (err) {
      console.warn('startTrip failed, using mock data:', err);
      return this.getMockTrip(route_number, driver_phone);
    }
  }

  private getMockTrip(routeNumber: string, driverPhone: string): BackendTrip {
    return {
      id: Math.floor(Math.random() * 100000),
      route_id: 1,
      bus_id: 1,
      driver_id: 1,
      status: 'active',
      started_at: new Date().toISOString(),
      ended_at: null,
      route_number: routeNumber || mockRoute.number,
      route_name: mockRoute.name,
      license_plate: mockBus.regNo,
      bus_number: null,
      driver_name: mockDriver.name,
    };
  }

  /** PATCH /api/trips/:id/end — marks the trip completed. */
  async endTrip(tripId: number) {
    try {
      if (USE_MOCK_DATA) {
        return { id: tripId, status: 'completed' };
      }
      const response = await axios.patch(`${API_URL}/api/trips/${tripId}/end`);
      return response.data;
    } catch (err) {
      console.warn('endTrip failed, using mock response:', err);
      return { id: tripId, status: 'completed' };
    }
  }

  /** GET /api/trips — all trips (newest first). Used by the Trip Log tab. */
  async getTrips(): Promise<BackendTrip[]> {
    try {
      if (USE_MOCK_DATA) {
        return this.getMockTrips();
      }
      const response = await axios.get(`${API_URL}/api/trips`);
      return response.data;
    } catch (err) {
      console.warn('getTrips failed, using mock data:', err);
      return this.getMockTrips();
    }
  }

  private getMockTrips(): BackendTrip[] {
    return [
      {
        id: 1,
        route_id: 1,
        bus_id: 1,
        driver_id: 1,
        status: 'completed',
        started_at: new Date(Date.now() - 3600000).toISOString(),
        ended_at: new Date(Date.now() - 1800000).toISOString(),
        route_number: mockRoute.number,
        route_name: mockRoute.name,
        license_plate: mockBus.regNo,
        bus_number: null,
        driver_name: mockDriver.name,
      },
    ];
  }

  /** GET /api/trips/:id — single enriched trip. */
  async getTripDetails(tripId: number): Promise<BackendTrip | null> {
    try {
      if (USE_MOCK_DATA) {
        return this.getMockTrip(mockRoute.number, mockDriver.phone);
      }
      const response = await axios.get(`${API_URL}/api/trips/${tripId}`);
      return response.data;
    } catch (err) {
      console.warn('getTripDetails failed, using mock data:', err);
      return this.getMockTrip(mockRoute.number, mockDriver.phone);
    }
  }

  /** GET /api/routes/:id/stops — ordered stops for the trip's route. */
  async getRouteStops(routeId: number): Promise<BackendRouteStop[]> {
    try {
      if (USE_MOCK_DATA) {
        return this.getMockRouteStops();
      }
      const response = await axios.get(`${API_URL}/api/routes/${routeId}/stops`);
      return response.data;
    } catch (err) {
      console.warn('getRouteStops failed, using mock data:', err);
      return this.getMockRouteStops();
    }
  }

  private getMockRouteStops(): BackendRouteStop[] {
    return mockStops.map((stop) => ({
      stop_id: typeof stop.id === 'string' ? parseInt(stop.id.replace(/\D/g, '')) : stop.id,
      stop_name: stop.name,
      latitude: stop.lat,
      longitude: stop.lng,
      stop_order: stop.order,
    }));
  }

  /** POST /api/alerts — breakdown report (goes straight to the depot dashboard). */
  async reportBreakdown(data: {
    trip_id?: number;
    license_plate?: string;
    route_number?: string;
    driver_phone?: string;
    description: string;
    latitude: number;
    longitude: number;
  }) {
    try {
      if (USE_MOCK_DATA) {
        return { id: `breakdown-${Date.now()}`, status: 'reported' };
      }
      const response = await axios.post(`${API_URL}/api/alerts`, {
        type: 'breakdown',
        ...data,
      });
      return response.data;
    } catch (err) {
      console.warn('reportBreakdown failed, using mock response:', err);
      return { id: `breakdown-${Date.now()}`, status: 'reported' };
    }
  }

  /** POST /api/alerts — driver SOS (human safety emergency). */
  async sendSOS(data: {
    trip_id?: number;
    license_plate?: string;
    route_number?: string;
    driver_phone?: string;
    description?: string;
    latitude: number;
    longitude: number;
  }) {
    try {
      if (USE_MOCK_DATA) {
        return { id: `sos-${Date.now()}`, status: 'alert_sent' };
      }
      const response = await axios.post(`${API_URL}/api/alerts`, {
        type: 'sos',
        ...data,
      });
      return response.data;
    } catch (err) {
      console.warn('sendSOS failed, using mock response:', err);
      return { id: `sos-${Date.now()}`, status: 'alert_sent' };
    }
  }
}

export default new TripService();
