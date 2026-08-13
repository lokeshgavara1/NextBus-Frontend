// Mock data for development/testing without backend

export const MOCK_ROUTES = [
  {
    id: 1,
    route_number: '1',
    route_name: 'RTC Complex to Kailasagiri',
    start_stop: 'RTC Complex',
    end_stop: 'Kailasagiri',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    route_number: '2K',
    route_name: 'RK Beach to Jagadamba',
    start_stop: 'RK Beach',
    end_stop: 'Jagadamba',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    route_number: '3',
    route_name: 'Bheemili to RTC Complex',
    start_stop: 'Bheemili',
    end_stop: 'RTC Complex',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    route_number: '4',
    route_name: 'Gajuwaka to RK Beach',
    start_stop: 'Gajuwaka',
    end_stop: 'RK Beach',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    route_number: '5',
    route_name: 'MVP Colony to Kailasagiri',
    start_stop: 'MVP Colony',
    end_stop: 'Kailasagiri',
    created_at: new Date().toISOString(),
  },
]

export const MOCK_STOPS = [
  {
    stop_id: 1,
    stop_name: 'RTC Complex',
    latitude: 17.732,
    longitude: 83.3031,
    stop_order: 1,
  },
  {
    stop_id: 2,
    stop_name: 'Maddilapalem',
    latitude: 17.7281,
    longitude: 83.3044,
    stop_order: 2,
  },
  {
    stop_id: 3,
    stop_name: 'Kailasagiri',
    latitude: 17.6915,
    longitude: 83.2176,
    stop_order: 3,
  },
  {
    stop_id: 4,
    stop_name: 'RK Beach',
    latitude: 17.7211,
    longitude: 83.3287,
    stop_order: 4,
  },
  {
    stop_id: 5,
    stop_name: 'Jagadamba',
    latitude: 17.7428,
    longitude: 83.3223,
    stop_order: 5,
  },
  {
    stop_id: 6,
    stop_name: 'Bheemili',
    latitude: 17.7899,
    longitude: 83.4031,
    stop_order: 6,
  },
  {
    stop_id: 7,
    stop_name: 'MVP Colony',
    latitude: 17.7813,
    longitude: 83.2544,
    stop_order: 7,
  },
  {
    stop_id: 8,
    stop_name: 'Gajuwaka',
    latitude: 17.8145,
    longitude: 83.2987,
    stop_order: 8,
  },
]

export const MOCK_ROUTE_STOPS: Record<number, any[]> = {
  1: [
    { stop_id: 1, stop_name: 'RTC Complex', latitude: 17.732, longitude: 83.3031, stop_order: 1 },
    { stop_id: 2, stop_name: 'Maddilapalem', latitude: 17.7281, longitude: 83.3044, stop_order: 2 },
    { stop_id: 3, stop_name: 'Kailasagiri', latitude: 17.6915, longitude: 83.2176, stop_order: 3 },
  ],
  2: [
    { stop_id: 4, stop_name: 'RK Beach', latitude: 17.7211, longitude: 83.3287, stop_order: 1 },
    { stop_id: 5, stop_name: 'Jagadamba', latitude: 17.7428, longitude: 83.3223, stop_order: 2 },
  ],
  3: [
    { stop_id: 6, stop_name: 'Bheemili', latitude: 17.7899, longitude: 83.4031, stop_order: 1 },
    { stop_id: 1, stop_name: 'RTC Complex', latitude: 17.732, longitude: 83.3031, stop_order: 2 },
  ],
  4: [
    { stop_id: 8, stop_name: 'Gajuwaka', latitude: 17.8145, longitude: 83.2987, stop_order: 1 },
    { stop_id: 4, stop_name: 'RK Beach', latitude: 17.7211, longitude: 83.3287, stop_order: 2 },
  ],
  5: [
    { stop_id: 7, stop_name: 'MVP Colony', latitude: 17.7813, longitude: 83.2544, stop_order: 1 },
    { stop_id: 3, stop_name: 'Kailasagiri', latitude: 17.6915, longitude: 83.2176, stop_order: 2 },
  ],
}

export const MOCK_BUSES = [
  {
    trip_id: 101,
    id: 'BUS_101',
    route_id: 1,
    route_number: '1',
    bus_number: 'BUS-001',
    license_plate: 'AP 31 TV 1001',
    latitude: 17.7281,
    longitude: 83.3044,
    speed: 25,
    occupancy_count: 35,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.95,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 2, stop_name: 'Maddilapalem', latitude: 17.7281, longitude: 83.3044, eta_seconds: 120 },
      { stop_id: 3, stop_name: 'Kailasagiri', latitude: 17.6915, longitude: 83.2176, eta_seconds: 480 },
    ],
  },
  {
    trip_id: 102,
    id: 'BUS_102',
    route_id: 2,
    route_number: '2K',
    bus_number: 'BUS-002',
    license_plate: 'AP 31 TV 1002',
    latitude: 17.7300,
    longitude: 83.3200,
    speed: 30,
    occupancy_count: 42,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.92,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 4, stop_name: 'RK Beach', latitude: 17.7211, longitude: 83.3287, eta_seconds: 300 },
      { stop_id: 5, stop_name: 'Jagadamba', latitude: 17.7428, longitude: 83.3223, eta_seconds: 600 },
    ],
  },
  {
    trip_id: 103,
    id: 'BUS_103',
    route_id: 3,
    route_number: '3',
    bus_number: 'BUS-003',
    license_plate: 'AP 31 TV 1003',
    latitude: 17.7600,
    longitude: 83.3500,
    speed: 28,
    occupancy_count: 38,
    capacity: 50,
    status: 'APPROACHING STOP',
    vision_confidence_score: 0.88,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 6, stop_name: 'Bheemili', latitude: 17.7899, longitude: 83.4031, eta_seconds: 180 },
      { stop_id: 1, stop_name: 'RTC Complex', latitude: 17.732, longitude: 83.3031, eta_seconds: 720 },
    ],
  },
  {
    trip_id: 104,
    id: 'BUS_104',
    route_id: 4,
    route_number: '4',
    bus_number: 'BUS-004',
    license_plate: 'AP 31 TV 1004',
    latitude: 17.8000,
    longitude: 83.2800,
    speed: 32,
    occupancy_count: 45,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.91,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 8, stop_name: 'Gajuwaka', latitude: 17.8145, longitude: 83.2987, eta_seconds: 240 },
      { stop_id: 4, stop_name: 'RK Beach', latitude: 17.7211, longitude: 83.3287, eta_seconds: 840 },
    ],
  },
  {
    trip_id: 105,
    id: 'BUS_105',
    route_id: 5,
    route_number: '5',
    bus_number: 'BUS-005',
    license_plate: 'AP 31 TV 1005',
    latitude: 17.7500,
    longitude: 83.2600,
    speed: 26,
    occupancy_count: 30,
    capacity: 50,
    status: 'AT STOP',
    vision_confidence_score: 0.93,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 7, stop_name: 'MVP Colony', latitude: 17.7813, longitude: 83.2544, eta_seconds: 60 },
      { stop_id: 3, stop_name: 'Kailasagiri', latitude: 17.6915, longitude: 83.2176, eta_seconds: 540 },
    ],
  },
]

// Function to generate moving bus for animation
export function generateLiveBusUpdate(busId: number) {
  const bus = MOCK_BUSES.find((b) => b.trip_id === busId)
  if (!bus) return null

  // Simulate bus movement
  const offset = Math.random() * 0.01
  return {
    ...bus,
    latitude: bus.latitude + offset,
    longitude: bus.longitude + offset,
    speed: Math.floor(Math.random() * 40) + 15,
    occupancy_count: Math.floor(Math.random() * 50),
    last_updated: new Date().toISOString(),
    status: ['LIVE', 'APPROACHING STOP', 'AT STOP'][Math.floor(Math.random() * 3)] as any,
  }
}

// Function to simulate WebSocket snapshot
export function getMockSnapshot() {
  return {
    type: 'SNAPSHOT',
    data: MOCK_BUSES.map((bus) => ({
      ...bus,
      last_updated: new Date().toISOString(),
    })),
  }
}
