import axios from 'axios'
import mockApiService from './mockApiService'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true'

export interface Route {
  id: number;
  route_number: string;
  route_name: string;
  start_stop: string;
  end_stop: string;
  created_at?: string;
}

export interface StopEta {
  stop_id: number;
  stop_name: string;
  latitude: number;
  longitude: number;
  stop_order: number;
  eta_seconds: number | null;
}

export interface Bus {
  id?: number;
  trip_id?: number;
  bus_id?: number;
  route_id?: number;
  license_plate: string;
  bus_number?: string;
  route_number?: string;
  latitude: number;
  longitude: number;
  speed: number;
  occupancy_count?: number;
  occupancy?: number;
  capacity?: number;
  vision_confidence_score?: number;
  last_updated?: string;
  nextStopIndex?: number;
  status?: 'LIVE' | 'APPROACHING STOP' | 'AT STOP' | 'STALE' | 'SIGNAL LOST' | 'OFFLINE';
  stop_etas?: StopEta[];
  current_stop_name?: string;
  next_stop_name?: string;
  eta_seconds?: number;
}

export interface RouteStop {
  stop_id: number;
  stop_name: string;
  latitude: number;
  longitude: number;
  stop_order: number;
}

export interface RouteResult {
  route: Route;
  bus: Bus | null;
  eta: number | null; // ETA in minutes; null if no live/scheduled bus available
  etaStatus: 'LIVE' | 'SCHEDULED' | 'NO_SERVICE';
  crowd: number; // 0-100%
  fare: number; // rupees
  femaleOnly: boolean;
  distance: number; // km
  stops?: RouteStop[];
}

export interface SearchParams {
  q?: string;
  from?: string;
  to?: string;
  preference?: 'fastest' | 'cheapest' | 'least-crowded';
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function computeFallbackStopEtas(stops: RouteStop[], startIdx = 0): StopEta[] {
  let cumulativeSecs = 0;
  const SPEED_KMH = 25;
  return stops.map((stop, i) => {
    if (i < startIdx) return { ...stop, eta_seconds: null };
    if (i > startIdx) {
      const prev = stops[i - 1];
      const distKm = haversineKm(prev.latitude, prev.longitude, stop.latitude, stop.longitude);
      cumulativeSecs += Math.round((distKm / SPEED_KMH) * 3600);
    }
    return { ...stop, eta_seconds: cumulativeSecs };
  });
}

export default class RouteService {
  async getRoutes(): Promise<Route[]> {
    // Use mock data directly - instant response
    return mockApiService.getRoutes();
  }

  async getStops(): Promise<RouteStop[]> {
    // Use mock data directly - instant response
    return mockApiService.getStops();
  }

  async getFleet(): Promise<Bus[]> {
    // Use mock data directly - instant response
    return mockApiService.getFleet();
  }

  async getRouteStops(routeId: number): Promise<RouteStop[]> {
    if (!routeId || isNaN(Number(routeId))) return [];
    // Use mock data directly - instant response
    return mockApiService.getRouteStops(routeId);
  }

  private calculateFare(stopCount: number): number {
    return Math.max(15, 15 + Math.max(0, stopCount - 2) * 2);
  }

  private calculateCrowdPercent(bus: Bus | null): number {
    if (!bus) return 0;
    const capacity = bus.capacity || 50;
    const occupancy = bus.occupancy_count ?? bus.occupancy ?? 0;
    return Math.min(100, Math.round((occupancy / capacity) * 100));
  }

  private extractEtaMinutes(
    bus: Bus | null,
    targetStopName?: string
  ): { etaMinutes: number | null; etaStatus: 'LIVE' | 'SCHEDULED' | 'NO_SERVICE' } {
    if (!bus) return { etaMinutes: null, etaStatus: 'SCHEDULED' };

    if (bus.stop_etas && bus.stop_etas.length > 0) {
      if (targetStopName) {
        const matched = bus.stop_etas.find((s) =>
          s.stop_name.toLowerCase().includes(targetStopName.toLowerCase())
        );
        if (matched && matched.eta_seconds !== null) {
          return { etaMinutes: Math.max(1, Math.round(matched.eta_seconds / 60)), etaStatus: 'LIVE' };
        }
      }
      const nextEta = bus.stop_etas.find((s) => s.eta_seconds !== null);
      if (nextEta && nextEta.eta_seconds !== null) {
        return { etaMinutes: Math.max(1, Math.round(nextEta.eta_seconds / 60)), etaStatus: 'LIVE' };
      }
    }

    if (bus.eta_seconds !== undefined && bus.eta_seconds !== null) {
      return { etaMinutes: Math.max(1, Math.round(bus.eta_seconds / 60)), etaStatus: 'LIVE' };
    }

    return { etaMinutes: null, etaStatus: 'SCHEDULED' };
  }

  private computeRouteDistance(stops: RouteStop[]): number {
    if (!stops || stops.length < 2) return 5.0;
    let totalKm = 0;
    for (let i = 1; i < stops.length; i++) {
      totalKm += haversineKm(stops[i - 1].latitude, stops[i - 1].longitude, stops[i].latitude, stops[i].longitude);
    }
    return Number(totalKm.toFixed(1));
  }

  async searchRoutes(
    paramsOrFrom?: string | SearchParams,
    toStopParam?: string,
    preference: 'fastest' | 'cheapest' | 'least-crowded' = 'fastest',
    qParam?: string
  ): Promise<RouteResult[]> {
    // Parse parameters
    let from = '';
    let to = '';
    let pref = preference;

    if (typeof paramsOrFrom === 'object' && paramsOrFrom !== null) {
      from = (paramsOrFrom.from || '').trim();
      to = (paramsOrFrom.to || '').trim();
      if (paramsOrFrom.preference) pref = paramsOrFrom.preference;
    } else {
      from = (paramsOrFrom || '').trim();
      to = (toStopParam || '').trim();
    }

    // Always use mock data - fastest path, no unnecessary async operations
    return mockApiService.searchRoutes(from, to, pref);
  }

  async searchByQuery(query: string): Promise<RouteResult[]> {
    return this.searchRoutes({ q: query });
  }
}

export const routeService = new RouteService();

