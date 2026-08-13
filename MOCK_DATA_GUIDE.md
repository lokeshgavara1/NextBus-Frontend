# Mock Data System - Quick Start Guide

## Overview

The NextBus app now includes a complete mock data system that allows you to test and develop without running the backend server. The app automatically falls back to mock data if the backend is unavailable.

---

## 🚀 Quick Start

### Option 1: Automatic Fallback (Recommended)

The app automatically uses mock data when the backend is unavailable:

1. **Just run the app** without the backend:
```bash
cd FRONTEND/commuter-app
npm start
```

2. **The app will:**
   - Try to connect to the backend API
   - Fail gracefully
   - Automatically use mock data
   - Show a warning in console: `"getRoutes failed, using mock data"`

### Option 2: Force Mock Data

To always use mock data (even if backend is running), set environment variable:

**Create `.env` file:**
```
EXPO_PUBLIC_USE_MOCK_DATA=true
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Then restart the app:
```bash
npm start
```

---

## 📊 What's Included in Mock Data

### Routes (5 routes)
- Route 1: RTC Complex → Kailasagiri
- Route 2K: RK Beach → Jagadamba
- Route 3: Bheemili → RTC Complex
- Route 4: Gajuwaka → RK Beach
- Route 5: MVP Colony → Kailasagiri

### Buses (5 live buses)
- Bus 101: Route 1, Status: LIVE
- Bus 102: Route 2K, Status: LIVE
- Bus 103: Route 3, Status: APPROACHING STOP
- Bus 104: Route 4, Status: LIVE
- Bus 105: Route 5, Status: AT STOP

### Stops (8 stops)
- RTC Complex
- Maddilapalem
- Kailasagiri
- RK Beach
- Jagadamba
- Bheemili
- MVP Colony
- Gajuwaka

### Features
- ✅ Live GPS updates (buses move every 2-3 seconds)
- ✅ Status changes (LIVE → APPROACHING → AT STOP)
- ✅ ETA calculations
- ✅ Crowd level simulation
- ✅ Speed variations
- ✅ Complete route stops

---

## 🔄 How Mock Data Works

### 1. API Fallback
```typescript
try {
  // Try real API
  const res = await axios.get(`${API_URL}/api/routes`)
  return res.data
} catch (err) {
  // Fall back to mock
  console.warn('Using mock data:', err)
  return mockApiService.getRoutes()
}
```

### 2. WebSocket Simulation
- Sends initial `SNAPSHOT` with all buses
- Updates each bus every 2-3 seconds with `BUS_UPDATE` messages
- Simulates realistic bus movement with small coordinate changes
- Randomly changes status (LIVE → APPROACHING → AT STOP)

### 3. Search Results
Mock search returns all routes sorted by your preference:
- **Fastest:** By ETA (random 5-20 minutes)
- **Cheapest:** All ₹15 (same fare)
- **Least-crowded:** By occupancy (0-100%)

---

## 🧪 Testing Scenarios

### Scenario 1: Browse Live Map
1. Start app
2. Go to Map tab
3. See 5 buses moving on map
4. Watch buses update every 2-3 seconds
5. Check status changes (LIVE → APPROACHING)

### Scenario 2: Search Routes
1. Go to Search tab
2. Enter any "from" and "to"
3. See 5 routes with live ETAs
4. Tap result → Map shows route

### Scenario 3: View Bus Details
1. Tap any bus on map
2. See full bus info
3. Check route stops
4. Watch ETA update in real-time

### Scenario 4: Live Tracking
1. Select a route
2. Journey banner shows route
3. Watch bus move on route
4. See ETA countdown
5. Watch status change

### Scenario 5: Error Handling
1. All error states work with mock data
2. Loading states show 500-1000ms delay
3. Empty results handled correctly
4. Search sorting works

---

## 📁 Files Involved

### Mock Data Sources
- `src/services/mockData.ts` — Mock routes, buses, stops data
- `src/services/mockApiService.ts` — Mock API endpoints
- `src/services/mockWebSocket.ts` — Mock WebSocket simulation

### Integration Points
- `src/services/routeService.ts` — Uses mock as fallback
- `src/hooks/useRealTimeBus.ts` — Uses mock WebSocket
- `src/screens/SearchRoutesScreen.tsx` — Works with mock data
- `src/screens/HomeMapScreen.tsx` — Maps mock buses

---

## 🔧 Customizing Mock Data

### Add More Buses

Edit `src/services/mockData.ts`:
```typescript
export const MOCK_BUSES = [
  {
    trip_id: 106,
    id: 'BUS_106',
    route_id: 1,
    route_number: '1',
    license_plate: 'AP 31 TV 1006',
    latitude: 17.73,
    longitude: 83.30,
    speed: 25,
    occupancy_count: 40,
    // ... other fields
  },
  // Add more buses...
]
```

### Change Route Stops

Edit `src/services/mockData.ts` `MOCK_ROUTE_STOPS`:
```typescript
export const MOCK_ROUTE_STOPS: Record<number, any[]> = {
  1: [
    { stop_id: 1, stop_name: 'RTC Complex', ... },
    { stop_id: 2, stop_name: 'My Stop', ... },
    // Add more stops for route 1
  ],
}
```

### Adjust Bus Movement Speed

Edit `src/services/mockData.ts` in `generateLiveBusUpdate()`:
```typescript
// Slower movement (smaller offset)
const offset = Math.random() * 0.001  // was 0.01

// Faster movement (larger offset)
const offset = Math.random() * 0.05
```

### Adjust Update Frequency

Edit `src/services/mockWebSocket.ts` in `startBusUpdates()`:
```typescript
// Update every 1-2 seconds (faster)
const updateInterval = Math.random() * 1000 + 1000

// Update every 5-6 seconds (slower)
const updateInterval = Math.random() * 1000 + 5000
```

---

## 📱 Environment Variables

### `.env` File Options

```bash
# Force mock data
EXPO_PUBLIC_USE_MOCK_DATA=true

# Set API URL for when backend is available
EXPO_PUBLIC_API_URL=http://localhost:3000

# For mobile device testing (use your IP)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000

# Enable debug logging
EXPO_PUBLIC_DEBUG=true
```

---

## ✅ Verification

### Check Mock Data is Working

1. **Console warnings:**
   ```
   ⚠️  getRoutes failed, using mock data: [AxiosError: Network Error]
   ⚠️  getFleet failed, using mock data: [AxiosError: Network Error]
   ```

2. **App shows:**
   - ✅ 5 buses on map
   - ✅ Buses moving every 2-3 seconds
   - ✅ 5 routes in search results
   - ✅ 8 stops showing in route details
   - ✅ Status changes (LIVE → APPROACHING → AT STOP)

3. **Search results show:**
   - ✅ All 5 routes
   - ✅ Live ETAs (5-20 minutes)
   - ✅ Crowd levels (0-100%)
   - ✅ Fare ₹15

---

## 🔙 Switching Back to Real Backend

### When Backend Comes Online

1. **Start the backend:**
```bash
cd backend
npm run dev
```

2. **Restart the app:**
```bash
cd FRONTEND/commuter-app
npm start
```

3. **Remove mock data flag (if set):**
```bash
# .env
EXPO_PUBLIC_USE_MOCK_DATA=false
```

The app will:
- ✅ Connect to real backend
- ✅ Fetch real routes/buses/stops
- ✅ Show real GPS positions
- ✅ Get real live updates via WebSocket

---

## 📝 Notes

### Mock Data Features
- ✅ Fully functional map display
- ✅ Realistic bus movement animation
- ✅ Status state changes
- ✅ Complete route/stop data
- ✅ Search and filtering
- ✅ Loading state simulation
- ✅ All UI components work

### Limitations
- ❌ Data doesn't persist (restarts on app reload)
- ❌ No database interactions
- ❌ No user accounts
- ❌ No alerts/notifications stored
- ❌ No trip history

### Performance
- ✅ Very fast (instant loading)
- ✅ No network latency
- ✅ Smooth animations
- ✅ Low memory usage
- ✅ Great for testing UI/UX

---

## 🚨 Troubleshooting

### Issue: "No buses showing"
**Solution:** Check console for errors, restart app

### Issue: "Routes not loading"
**Solution:** Verify `.env` settings, check `USE_MOCK_DATA` flag

### Issue: "WebSocket errors"
**Solution:** Normal with mock data, app uses simulated WebSocket

### Issue: "Search results blank"
**Solution:** Make sure mock data is imported, check mockApiService

### Issue: "Want real backend"
**Solution:** Start backend server, restart app, mock data automatically disables

---

## 🎯 Next Steps

1. ✅ **Test current features** with mock data
2. ✅ **Verify UI/UX** works as expected
3. ✅ **Check app behavior** in different states
4. ✅ **When ready:** Start backend and switch to real data

Happy testing! 🚀
