// Mock data for development/testing without backend
// Karnataka routes connecting major cities

export const MOCK_ROUTES = [
  // KARNATAKA ROUTES
  {
    id: 1,
    route_number: '10K',
    route_name: 'Bangalore to Mysore - Express',
    start_stop: 'Bangalore Central Station',
    end_stop: 'Mysore Central Stand',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    route_number: '20K',
    route_name: 'Bangalore to Pune - Sleeper',
    start_stop: 'Bangalore City Mall',
    end_stop: 'Pune Central Bus Terminal',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    route_number: '30K',
    route_name: 'Bangalore to Hyderabad - AC Coach',
    start_stop: 'Bangalore KBS',
    end_stop: 'Hyderabad Jubilee Bus Station',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    route_number: '40K',
    route_name: 'Bangalore to Mangalore - Coastal Route',
    start_stop: 'Bangalore Shantinagar',
    end_stop: 'Mangalore Town Hall',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    route_number: '50K',
    route_name: 'Bangalore to Hospet (Hampi) - Heritage Route',
    start_stop: 'Bangalore Majestic Bus Stand',
    end_stop: 'Hospet Bus Stand',
    created_at: new Date().toISOString(),
  },

  // VISAKHAPATNAM ROUTES
  {
    id: 6,
    route_number: '1V',
    route_name: 'Visakhapatnam to Hyderabad - Express',
    start_stop: 'Visakhapatnam RTC Complex',
    end_stop: 'Hyderabad Jubilee Bus Station',
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    route_number: '2V',
    route_name: 'Visakhapatnam to Bangalore - Sleeper',
    start_stop: 'Visakhapatnam Central Bus Stand',
    end_stop: 'Bangalore Majestic',
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    route_number: '3V',
    route_name: 'Visakhapatnam to Chennai - AC Coach',
    start_stop: 'Visakhapatnam Beach Station',
    end_stop: 'Chennai Central Bus Terminal',
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    route_number: '4V',
    route_name: 'Visakhapatnam to Pune - Premium Sleeper',
    start_stop: 'Visakhapatnam Port Town',
    end_stop: 'Pune Central Bus Terminal',
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    route_number: '5V',
    route_name: 'Visakhapatnam to Goa - Coastal Route',
    start_stop: 'Visakhapatnam RTC Complex',
    end_stop: 'Panaji Bus Stand',
    created_at: new Date().toISOString(),
  },
]

export const MOCK_STOPS = [
  // Bangalore stops
  {
    stop_id: 1,
    stop_name: 'Bangalore Central Station',
    latitude: 12.9716,
    longitude: 77.5946,
    stop_order: 1,
  },
  {
    stop_id: 2,
    stop_name: 'Bangalore Majestic Bus Stand',
    latitude: 12.9705,
    longitude: 77.5901,
    stop_order: 1,
  },
  {
    stop_id: 3,
    stop_name: 'Bangalore City Mall',
    latitude: 13.0019,
    longitude: 77.6030,
    stop_order: 1,
  },
  {
    stop_id: 4,
    stop_name: 'Bangalore KBS',
    latitude: 13.0085,
    longitude: 77.5570,
    stop_order: 1,
  },
  {
    stop_id: 5,
    stop_name: 'Bangalore Shantinagar',
    latitude: 12.9956,
    longitude: 77.5809,
    stop_order: 1,
  },
  // Mysore stops
  {
    stop_id: 6,
    stop_name: 'Channapatna',
    latitude: 12.6597,
    longitude: 77.2648,
    stop_order: 2,
  },
  {
    stop_id: 7,
    stop_name: 'Mysore Central Stand',
    latitude: 12.2958,
    longitude: 76.6394,
    stop_order: 3,
  },
  {
    stop_id: 8,
    stop_name: 'Mysore Palace Junction',
    latitude: 12.2942,
    longitude: 76.6418,
    stop_order: 3,
  },
  // Pune stops
  {
    stop_id: 9,
    stop_name: 'Belgaum',
    latitude: 15.8527,
    longitude: 74.4976,
    stop_order: 2,
  },
  {
    stop_id: 10,
    stop_name: 'Belgaum Railway Station',
    latitude: 15.8617,
    longitude: 74.4970,
    stop_order: 2,
  },
  {
    stop_id: 11,
    stop_name: 'Pune Central Bus Terminal',
    latitude: 18.5204,
    longitude: 73.8567,
    stop_order: 4,
  },
  // Hyderabad stops
  {
    stop_id: 12,
    stop_name: 'Kolar',
    latitude: 13.1448,
    longitude: 78.1270,
    stop_order: 2,
  },
  {
    stop_id: 13,
    stop_name: 'Tandur',
    latitude: 13.2317,
    longitude: 78.3211,
    stop_order: 3,
  },
  {
    stop_id: 14,
    stop_name: 'Hyderabad Jubilee Bus Station',
    latitude: 17.3850,
    longitude: 78.4867,
    stop_order: 4,
  },
  // Mangalore stops
  {
    stop_id: 15,
    stop_name: 'Tumkur',
    latitude: 13.2157,
    longitude: 77.1143,
    stop_order: 2,
  },
  {
    stop_id: 16,
    stop_name: 'Chikmagalur',
    latitude: 13.3173,
    longitude: 75.7764,
    stop_order: 3,
  },
  {
    stop_id: 17,
    stop_name: 'Mangalore Town Hall',
    latitude: 12.8628,
    longitude: 74.8537,
    stop_order: 4,
  },
  // Hospet/Hampi stops
  {
    stop_id: 18,
    stop_name: 'Chitradurga Fort',
    latitude: 14.2250,
    longitude: 75.7431,
    stop_order: 2,
  },
  {
    stop_id: 19,
    stop_name: 'Davangere',
    latitude: 14.4644,
    longitude: 75.9218,
    stop_order: 3,
  },
  {
    stop_id: 20,
    stop_name: 'Hospet Bus Stand',
    latitude: 15.2671,
    longitude: 76.3904,
    stop_order: 4,
  },

  // VISAKHAPATNAM STOPS
  {
    stop_id: 21,
    stop_name: 'Visakhapatnam RTC Complex',
    latitude: 17.6869,
    longitude: 83.2185,
    stop_order: 1,
  },
  {
    stop_id: 22,
    stop_name: 'Visakhapatnam Central Bus Stand',
    latitude: 17.7258,
    longitude: 83.3185,
    stop_order: 1,
  },
  {
    stop_id: 23,
    stop_name: 'Visakhapatnam Beach Station',
    latitude: 17.6959,
    longitude: 83.2240,
    stop_order: 1,
  },
  {
    stop_id: 24,
    stop_name: 'Visakhapatnam Port Town',
    latitude: 17.6869,
    longitude: 83.2185,
    stop_order: 1,
  },
  {
    stop_id: 25,
    stop_name: 'Visakhapatnam Kailasagiri',
    latitude: 17.6915,
    longitude: 83.2176,
    stop_order: 2,
  },
  {
    stop_id: 26,
    stop_name: 'Ongole',
    latitude: 14.6349,
    longitude: 79.6533,
    stop_order: 2,
  },
  {
    stop_id: 27,
    stop_name: 'Nellore',
    latitude: 14.4426,
    longitude: 79.9864,
    stop_order: 2,
  },
  {
    stop_id: 28,
    stop_name: 'Chennai Central Bus Terminal',
    latitude: 13.1939,
    longitude: 80.1829,
    stop_order: 3,
  },
  {
    stop_id: 29,
    stop_name: 'Panaji Bus Stand',
    latitude: 15.4909,
    longitude: 73.8278,
    stop_order: 3,
  },
]

export const MOCK_ROUTE_STOPS: Record<number, any[]> = {
  // Route 1: Bangalore to Mysore
  1: [
    { stop_id: 1, stop_name: 'Bangalore Central Station', latitude: 12.9716, longitude: 77.5946, stop_order: 1 },
    { stop_id: 6, stop_name: 'Channapatna', latitude: 12.6597, longitude: 77.2648, stop_order: 2 },
    { stop_id: 7, stop_name: 'Mysore Central Stand', latitude: 12.2958, longitude: 76.6394, stop_order: 3 },
  ],
  // Route 2: Bangalore to Pune
  2: [
    { stop_id: 3, stop_name: 'Bangalore City Mall', latitude: 13.0019, longitude: 77.6030, stop_order: 1 },
    { stop_id: 9, stop_name: 'Belgaum', latitude: 15.8527, longitude: 74.4976, stop_order: 2 },
    { stop_id: 10, stop_name: 'Belgaum Railway Station', latitude: 15.8617, longitude: 74.4970, stop_order: 3 },
    { stop_id: 11, stop_name: 'Pune Central Bus Terminal', latitude: 18.5204, longitude: 73.8567, stop_order: 4 },
  ],
  // Route 3: Bangalore to Hyderabad
  3: [
    { stop_id: 4, stop_name: 'Bangalore KBS', latitude: 13.0085, longitude: 77.5570, stop_order: 1 },
    { stop_id: 12, stop_name: 'Kolar', latitude: 13.1448, longitude: 78.1270, stop_order: 2 },
    { stop_id: 13, stop_name: 'Tandur', latitude: 13.2317, longitude: 78.3211, stop_order: 3 },
    { stop_id: 14, stop_name: 'Hyderabad Jubilee Bus Station', latitude: 17.3850, longitude: 78.4867, stop_order: 4 },
  ],
  // Route 4: Bangalore to Mangalore
  4: [
    { stop_id: 5, stop_name: 'Bangalore Shantinagar', latitude: 12.9956, longitude: 77.5809, stop_order: 1 },
    { stop_id: 15, stop_name: 'Tumkur', latitude: 13.2157, longitude: 77.1143, stop_order: 2 },
    { stop_id: 16, stop_name: 'Chikmagalur', latitude: 13.3173, longitude: 75.7764, stop_order: 3 },
    { stop_id: 17, stop_name: 'Mangalore Town Hall', latitude: 12.8628, longitude: 74.8537, stop_order: 4 },
  ],
  // Route 5: Bangalore to Hospet (Hampi)
  5: [
    { stop_id: 2, stop_name: 'Bangalore Majestic Bus Stand', latitude: 12.9705, longitude: 77.5901, stop_order: 1 },
    { stop_id: 18, stop_name: 'Chitradurga Fort', latitude: 14.2250, longitude: 75.7431, stop_order: 2 },
    { stop_id: 19, stop_name: 'Davangere', latitude: 14.4644, longitude: 75.9218, stop_order: 3 },
    { stop_id: 20, stop_name: 'Hospet Bus Stand', latitude: 15.2671, longitude: 76.3904, stop_order: 4 },
  ],

  // Route 6: Visakhapatnam to Hyderabad
  6: [
    { stop_id: 21, stop_name: 'Visakhapatnam RTC Complex', latitude: 17.6869, longitude: 83.2185, stop_order: 1 },
    { stop_id: 26, stop_name: 'Ongole', latitude: 14.6349, longitude: 79.6533, stop_order: 2 },
    { stop_id: 14, stop_name: 'Hyderabad Jubilee Bus Station', latitude: 17.3850, longitude: 78.4867, stop_order: 3 },
  ],

  // Route 7: Visakhapatnam to Bangalore
  7: [
    { stop_id: 22, stop_name: 'Visakhapatnam Central Bus Stand', latitude: 17.7258, longitude: 83.3185, stop_order: 1 },
    { stop_id: 26, stop_name: 'Ongole', latitude: 14.6349, longitude: 79.6533, stop_order: 2 },
    { stop_id: 2, stop_name: 'Bangalore Majestic', latitude: 12.9705, longitude: 77.5901, stop_order: 3 },
  ],

  // Route 8: Visakhapatnam to Chennai
  8: [
    { stop_id: 23, stop_name: 'Visakhapatnam Beach Station', latitude: 17.6959, longitude: 83.2240, stop_order: 1 },
    { stop_id: 27, stop_name: 'Nellore', latitude: 14.4426, longitude: 79.9864, stop_order: 2 },
    { stop_id: 28, stop_name: 'Chennai Central Bus Terminal', latitude: 13.1939, longitude: 80.1829, stop_order: 3 },
  ],

  // Route 9: Visakhapatnam to Pune
  9: [
    { stop_id: 24, stop_name: 'Visakhapatnam Port Town', latitude: 17.6869, longitude: 83.2185, stop_order: 1 },
    { stop_id: 9, stop_name: 'Belgaum', latitude: 15.8527, longitude: 74.4976, stop_order: 2 },
    { stop_id: 11, stop_name: 'Pune Central Bus Terminal', latitude: 18.5204, longitude: 73.8567, stop_order: 3 },
  ],

  // Route 10: Visakhapatnam to Goa
  10: [
    { stop_id: 21, stop_name: 'Visakhapatnam RTC Complex', latitude: 17.6869, longitude: 83.2185, stop_order: 1 },
    { stop_id: 25, stop_name: 'Visakhapatnam Kailasagiri', latitude: 17.6915, longitude: 83.2176, stop_order: 2 },
    { stop_id: 29, stop_name: 'Panaji Bus Stand', latitude: 15.4909, longitude: 73.8278, stop_order: 3 },
  ],
}

export const MOCK_BUSES = [
  // Bangalore to Mysore Express
  {
    trip_id: 101,
    id: 'BUS_101',
    busId: '101',
    route_id: 1,
    route_number: '10K',
    routeNo: '10K',
    bus_number: 'KA-BNG-1001',
    license_plate: 'KA 01 AB 1001',
    latitude: 12.6597,
    longitude: 77.2648,
    lat: 12.6597,
    lng: 77.2648,
    speed: 65,
    occupancy_count: 38,
    crowdLevel: 8,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.95,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 6, stop_name: 'Channapatna', latitude: 12.6597, longitude: 77.2648, eta_seconds: 180 },
      { stop_id: 7, stop_name: 'Mysore Central Stand', latitude: 12.2958, longitude: 76.6394, eta_seconds: 1800 },
    ],
  },
  // Bangalore to Pune Sleeper
  {
    trip_id: 102,
    id: 'BUS_102',
    busId: '102',
    route_id: 2,
    route_number: '20K',
    routeNo: '20K',
    bus_number: 'KA-BNG-1002',
    license_plate: 'KA 01 AC 1002',
    latitude: 15.8527,
    longitude: 74.4976,
    lat: 15.8527,
    lng: 74.4976,
    speed: 70,
    occupancy_count: 42,
    crowdLevel: 8,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.92,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 9, stop_name: 'Belgaum', latitude: 15.8527, longitude: 74.4976, eta_seconds: 300 },
      { stop_id: 11, stop_name: 'Pune Central Bus Terminal', latitude: 18.5204, longitude: 73.8567, eta_seconds: 7200 },
    ],
  },
  // Bangalore to Hyderabad AC Coach
  {
    trip_id: 103,
    id: 'BUS_103',
    busId: '103',
    route_id: 3,
    route_number: '30K',
    routeNo: '30K',
    bus_number: 'KA-BNG-1003',
    license_plate: 'KA 01 AD 1003',
    latitude: 13.2317,
    longitude: 78.3211,
    lat: 13.2317,
    lng: 78.3211,
    speed: 75,
    occupancy_count: 45,
    crowdLevel: 9,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.93,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 13, stop_name: 'Tandur', latitude: 13.2317, longitude: 78.3211, eta_seconds: 240 },
      { stop_id: 14, stop_name: 'Hyderabad Jubilee Bus Station', latitude: 17.3850, longitude: 78.4867, eta_seconds: 3600 },
    ],
  },
  // Bangalore to Mangalore Coastal Route
  {
    trip_id: 104,
    id: 'BUS_104',
    busId: '104',
    route_id: 4,
    route_number: '40K',
    routeNo: '40K',
    bus_number: 'KA-BNG-1004',
    license_plate: 'KA 01 AE 1004',
    latitude: 13.2157,
    longitude: 77.1143,
    lat: 13.2157,
    lng: 77.1143,
    speed: 68,
    occupancy_count: 35,
    crowdLevel: 7,
    capacity: 50,
    status: 'APPROACHING STOP',
    vision_confidence_score: 0.94,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 15, stop_name: 'Tumkur', latitude: 13.2157, longitude: 77.1143, eta_seconds: 120 },
      { stop_id: 17, stop_name: 'Mangalore Town Hall', latitude: 12.8628, longitude: 74.8537, eta_seconds: 5400 },
    ],
  },
  // Bangalore to Hospet Heritage Route
  {
    trip_id: 105,
    id: 'BUS_105',
    busId: '105',
    route_id: 5,
    route_number: '50K',
    routeNo: '50K',
    bus_number: 'KA-BNG-1005',
    license_plate: 'KA 01 AF 1005',
    latitude: 14.4644,
    longitude: 75.9218,
    lat: 14.4644,
    lng: 75.9218,
    speed: 62,
    occupancy_count: 40,
    crowdLevel: 8,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.96,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 19, stop_name: 'Davangere', latitude: 14.4644, longitude: 75.9218, eta_seconds: 360 },
      { stop_id: 20, stop_name: 'Hospet Bus Stand', latitude: 15.2671, longitude: 76.3904, eta_seconds: 2400 },
    ],
  },

  // VISAKHAPATNAM BUSES
  // Visakhapatnam to Hyderabad Express
  {
    trip_id: 201,
    id: 'BUS_201',
    busId: '201',
    route_id: 6,
    route_number: '1V',
    routeNo: '1V',
    bus_number: 'AP-VZG-2001',
    license_plate: 'AP 31 AZ 2001',
    latitude: 14.6349,
    longitude: 79.6533,
    lat: 14.6349,
    lng: 79.6533,
    speed: 72,
    occupancy_count: 44,
    crowdLevel: 9,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.94,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 26, stop_name: 'Ongole', latitude: 14.6349, longitude: 79.6533, eta_seconds: 120 },
      { stop_id: 14, stop_name: 'Hyderabad Jubilee Bus Station', latitude: 17.3850, longitude: 78.4867, eta_seconds: 3600 },
    ],
  },

  // Visakhapatnam to Bangalore Sleeper
  {
    trip_id: 202,
    id: 'BUS_202',
    busId: '202',
    route_id: 7,
    route_number: '2V',
    routeNo: '2V',
    bus_number: 'AP-VZG-2002',
    license_plate: 'AP 31 BA 2002',
    latitude: 14.6349,
    longitude: 79.6533,
    lat: 14.6349,
    lng: 79.6533,
    speed: 68,
    occupancy_count: 46,
    crowdLevel: 9,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.92,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 26, stop_name: 'Ongole', latitude: 14.6349, longitude: 79.6533, eta_seconds: 240 },
      { stop_id: 2, stop_name: 'Bangalore Majestic', latitude: 12.9705, longitude: 77.5901, eta_seconds: 14400 },
    ],
  },

  // Visakhapatnam to Chennai AC Coach
  {
    trip_id: 203,
    id: 'BUS_203',
    busId: '203',
    route_id: 8,
    route_number: '3V',
    routeNo: '3V',
    bus_number: 'AP-VZG-2003',
    license_plate: 'AP 31 BB 2003',
    latitude: 14.4426,
    longitude: 79.9864,
    lat: 14.4426,
    lng: 79.9864,
    speed: 70,
    occupancy_count: 40,
    crowdLevel: 8,
    capacity: 50,
    status: 'APPROACHING STOP',
    vision_confidence_score: 0.95,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 27, stop_name: 'Nellore', latitude: 14.4426, longitude: 79.9864, eta_seconds: 300 },
      { stop_id: 28, stop_name: 'Chennai Central Bus Terminal', latitude: 13.1939, longitude: 80.1829, eta_seconds: 5400 },
    ],
  },

  // Visakhapatnam to Pune Premium Sleeper
  {
    trip_id: 204,
    id: 'BUS_204',
    busId: '204',
    route_id: 9,
    route_number: '4V',
    routeNo: '4V',
    bus_number: 'AP-VZG-2004',
    license_plate: 'AP 31 BC 2004',
    latitude: 15.8527,
    longitude: 74.4976,
    lat: 15.8527,
    lng: 74.4976,
    speed: 75,
    occupancy_count: 48,
    crowdLevel: 10,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.93,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 9, stop_name: 'Belgaum', latitude: 15.8527, longitude: 74.4976, eta_seconds: 180 },
      { stop_id: 11, stop_name: 'Pune Central Bus Terminal', latitude: 18.5204, longitude: 73.8567, eta_seconds: 7200 },
    ],
  },

  // Visakhapatnam to Goa Coastal Route
  {
    trip_id: 205,
    id: 'BUS_205',
    busId: '205',
    route_id: 10,
    route_number: '5V',
    routeNo: '5V',
    bus_number: 'AP-VZG-2005',
    license_plate: 'AP 31 BD 2005',
    latitude: 17.6915,
    longitude: 83.2176,
    lat: 17.6915,
    lng: 83.2176,
    speed: 65,
    occupancy_count: 35,
    crowdLevel: 7,
    capacity: 50,
    status: 'LIVE',
    vision_confidence_score: 0.97,
    last_updated: new Date().toISOString(),
    stop_etas: [
      { stop_id: 25, stop_name: 'Visakhapatnam Kailasagiri', latitude: 17.6915, longitude: 83.2176, eta_seconds: 200 },
      { stop_id: 29, stop_name: 'Panaji Bus Stand', latitude: 15.4909, longitude: 73.8278, eta_seconds: 6000 },
    ],
  },
]

// Function to generate moving bus for animation
export function generateLiveBusUpdate(busId: number) {
  const bus = MOCK_BUSES.find((b) => b.trip_id === busId)
  if (!bus) return null

  // Simulate bus movement
  const offset = Math.random() * 0.01
  const newLat = bus.latitude + offset
  const newLng = bus.longitude + offset
  const newOccupancy = Math.floor(Math.random() * 50)
  const newCrowdLevel = Math.min(10, Math.round(newOccupancy / 5))

  return {
    ...bus,
    latitude: newLat,
    longitude: newLng,
    lat: newLat,
    lng: newLng,
    speed: Math.floor(Math.random() * 40) + 15,
    occupancy_count: newOccupancy,
    crowdLevel: newCrowdLevel,
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
