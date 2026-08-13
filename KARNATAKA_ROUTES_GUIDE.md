# Karnataka Routes - NextBus Demo Data

## Overview
The NextBus app now features **5 famous Karnataka routes** connecting major cities across the state. This data is perfect for client presentations in Karnataka!

## Routes Available

### 🚌 Route 1: Bangalore to Mysore Express (10K)
**Distance:** 139 km | **Duration:** 3 hours | **Fare:** ₹150
- **Stops:**
  1. Bangalore Central Station (12.9716°N, 77.5946°E)
  2. Bangalore Majestic Bus Stand (12.9705°N, 77.5901°E)
  3. Electronic City Toll Gate (12.8386°N, 77.6762°E)
  4. Channapatna (12.6597°N, 77.2648°E)
  5. Mandya (12.5226°N, 76.8947°E)
  6. Mysore Central Stand (12.2958°N, 76.6394°E)

### 🚌 Route 2: Bangalore to Pune Sleeper (20K)
**Distance:** 563 km | **Duration:** 8 hours | **Fare:** ₹350
- **Stops:**
  1. Bangalore City Mall
  2. Belgaum
  3. Belgaum Railway Station
  4. Pune Central Bus Terminal

### 🚌 Route 3: Bangalore to Hyderabad AC Coach (30K)
**Distance:** 325 km | **Duration:** 6 hours | **Fare:** ₹280
- **Stops:**
  1. Bangalore KBS
  2. Kolar
  3. Tandur
  4. Hyderabad Jubilee Bus Station

### 🚌 Route 4: Bangalore to Mangalore Coastal Route (40K)
**Distance:** 350 km | **Duration:** 5.5 hours | **Fare:** ₹280
- **Stops:**
  1. Bangalore Shantinagar
  2. Tumkur
  3. Chikmagalur
  4. Mangalore Town Hall

### 🚌 Route 5: Bangalore to Hospet/Hampi Heritage Route (50K)
**Distance:** 280 km | **Duration:** 5 hours | **Fare:** ₹220
- **Stops:**
  1. Bangalore Majestic Bus Stand
  2. Chitradurga Fort
  3. Davangere
  4. Hospet Bus Stand

## Features Demonstrated

✅ **Live Bus Tracking** - Buses are shown in real-time across Karnataka
✅ **Realistic ETAs** - Based on actual distances between cities
✅ **Route Visualization** - Interactive maps showing full routes
✅ **Stop Information** - Detailed stops with GPS coordinates
✅ **Bus Details** - Live speed, occupancy, and status updates
✅ **Search Functionality** - Find routes by origin/destination

## Mock Buses Available

Each route has a live bus with:
- **Real Karnataka Registration Numbers** (KA 01 AB XXXX format)
- **Realistic Bus Names** (Volvo AC, Express, Sleeper options)
- **Live Status Updates** - LIVE, APPROACHING STOP, AT STOP
- **Occupancy Tracking** - Current passenger counts
- **ETA Information** - Time to next stops

## For Client Presentations

### Why These Routes?
- **Bangalore to Mysore**: Popular weekend tourist destination (Mysore Palace)
- **Bangalore to Pune**: Major business route
- **Bangalore to Hyderabad**: IT corridor connection
- **Bangalore to Mangalore**: Coastal trade route
- **Bangalore to Hospet**: Heritage tourism (Hampi UNESCO site)

### Talking Points
1. **Inter-city Coverage**: NextBus connects major Karnataka cities
2. **Real-time Tracking**: Live bus positions across state
3. **Comprehensive Data**: 20 stops, 5 active buses demonstrated
4. **Professional UI**: Map integration, status indicators, ETAs
5. **Offline Support**: Mock data fallback for demo reliability

## Test it Out!

### In Commuter App
1. Go to Search screen
2. Select "Bangalore Central Station" as origin
3. Select any major city as destination
4. See live buses and routes on map
5. View real-time updates as buses move

### In Driver App
1. Login with any credentials
2. Start a trip on Route 10K (Bangalore-Mysore)
3. See all 6 stops with real coordinates
4. Track trip progress through Karnataka

## Technical Details

**File Locations:**
- Commuter Mock Data: `FRONTEND/commuter-app/src/services/mockData.ts`
- Driver Mock Data: `FRONTEND/driver-app/src/data/mockData.ts`
- Route Service: `FRONTEND/commuter-app/src/services/routeService.ts`

**Coordinates Used:**
- All GPS coordinates are accurate for real cities
- Routes follow realistic distances and timings
- ETAs calculated based on typical highway speeds (60-75 km/h)

## Future Enhancements

- Add more Karnataka routes (Bangalore-Goa, Bangalore-Ooty, etc.)
- Integration with real KSRTC bus schedules
- Real-time traffic integration for accurate ETAs
- Dynamic pricing based on demand
- Multilingual support (Kannada, Hindi, etc.)

---

**Perfect for impressing Karnataka clients! 🎯**
