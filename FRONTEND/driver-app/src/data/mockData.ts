export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  yearsExperience: number;
  rating: number;
  totalTrips: number;
  profileImage: string | null;
}

export interface Bus {
  id: string;
  regNo: string;
  capacity: number;
  makeModel: string;
  status: string;
  lat: number;
  lng: number;
}

export interface DriverRoute {
  id: string | number;
  number: string;
  name: string;
  distance: number;
  estimatedTime: number;
  totalStops: number;
  fare: number;
}

export interface Stop {
  id: string | number;
  name: string;
  order: number;
  lat: number;
  lng: number;
  isServed?: boolean;
}

export interface Conductor {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface EarningPeriod {
  trips: number;
  revenue: number;
  bonus: number;
  total: number;
}

export interface Earnings {
  today: EarningPeriod;
  week: EarningPeriod;
  month: EarningPeriod;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  startStop: string;
  endStop: string;
  passengers: number;
  revenue: number;
  distance: number;
  duration: number;
}

export interface Incident {
  id: string;
  date: string;
  description: string;
  status: string;
  type: string;
}

export interface SOSEvent {
  id: string;
  date: string;
  type: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
}

export const mockDriver: Driver = {
  id: 'DRV001',
  name: 'Rajesh Kumar',
  phone: '9876543210',
  licenseNo: 'KA19AB1234567',
  yearsExperience: 8,
  rating: 4.9,
  totalTrips: 2150,
  profileImage: null,
};

export const mockBus: Bus = {
  id: 'BUS001',
  regNo: 'KA01AB0001',
  capacity: 50,
  makeModel: 'Volvo AC Sleeper',
  status: 'ACTIVE',
  lat: 12.9716,
  lng: 77.5946,
};

export const mockRoute: DriverRoute = {
  id: '10K',
  number: '10K',
  name: 'Bangalore to Mysore Express',
  distance: 139.0,
  estimatedTime: 180,
  totalStops: 6,
  fare: 150,
};

export const mockStops: Stop[] = [
  {
    id: 'STOP001',
    name: 'Bangalore Central Station',
    order: 1,
    lat: 12.9716,
    lng: 77.5946,
    isServed: false,
  },
  {
    id: 'STOP002',
    name: 'Bangalore Majestic Bus Stand',
    order: 2,
    lat: 12.9705,
    lng: 77.5901,
    isServed: false,
  },
  {
    id: 'STOP003',
    name: 'Electronic City Toll Gate',
    order: 3,
    lat: 12.8386,
    lng: 77.6762,
    isServed: false,
  },
  {
    id: 'STOP004',
    name: 'Channapatna',
    order: 4,
    lat: 12.6597,
    lng: 77.2648,
    isServed: false,
  },
  {
    id: 'STOP005',
    name: 'Mandya',
    order: 5,
    lat: 12.5226,
    lng: 76.8947,
    isServed: false,
  },
  {
    id: 'STOP006',
    name: 'Mysore Central Stand',
    order: 6,
    lat: 12.2958,
    lng: 76.6394,
    isServed: false,
  },
];

export const mockConductor: Conductor = {
  id: 'CON001',
  name: 'Suresh Reddy',
  phone: '+919876543211',
  email: 'suresh@nextbus.com',
};

export const mockEarnings: Earnings = {
  today: {
    trips: 2,
    revenue: 1500,
    bonus: 225,
    total: 1725,
  },
  week: {
    trips: 12,
    revenue: 8950,
    bonus: 1200,
    total: 10150,
  },
  month: {
    trips: 48,
    revenue: 35900,
    bonus: 4000,
    total: 39900,
  },
};

export const mockTrips: TripHistoryItem[] = [
  {
    id: 'TRIP001',
    date: new Date(Date.now() - 3600000).toISOString(),
    startStop: 'Bangalore Central Station',
    endStop: 'Mysore Central Stand',
    passengers: 48,
    revenue: 7200,
    distance: 139.0,
    duration: 180,
  },
  {
    id: 'TRIP002',
    date: new Date(Date.now() - 7200000).toISOString(),
    startStop: 'Bangalore Central Station',
    endStop: 'Mysore Central Stand',
    passengers: 45,
    revenue: 6750,
    distance: 139.0,
    duration: 175,
  },
  {
    id: 'TRIP003',
    date: new Date(Date.now() - 86400000).toISOString(),
    startStop: 'Bangalore Central Station',
    endStop: 'Mysore Central Stand',
    passengers: 50,
    revenue: 7500,
    distance: 139.0,
    duration: 185,
  },
];

export const mockBreakdownIncidents: Incident[] = [
  {
    id: 'INC001',
    date: new Date(Date.now() - 604800000).toISOString(),
    description: 'Engine overheating - resolved at depot',
    status: 'RESOLVED',
    type: 'ENGINE',
  },
  {
    id: 'INC002',
    date: new Date(Date.now() - 1209600000).toISOString(),
    description: 'Tire puncture on highway',
    status: 'RESOLVED',
    type: 'TIRE',
  },
];

export const mockSOSEvents: SOSEvent[] = [
  {
    id: 'SOS001',
    date: new Date(Date.now() - 432000000).toISOString(),
    type: 'Medical',
    description: 'Passenger medical emergency - passenger transported to hospital',
    status: 'RESOLVED',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    id: 'SOS002',
    date: new Date(Date.now() - 864000000).toISOString(),
    type: 'Safety',
    description: 'Suspicious behavior - Police informed, situation resolved',
    status: 'RESOLVED',
    lat: 17.3744,
    lng: 78.4530,
  },
];
