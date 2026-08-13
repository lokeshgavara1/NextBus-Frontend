# NextBus Commuter App - Developer Guide

## Architecture Overview

### Real-Time Data Flow

```
Backend WebSocket
    ↓
SNAPSHOT (initial state) / BUS_UPDATE (incremental) / BUS_OFFLINE (removal)
    ↓
useRealTimeBus Hook (ws://<server>/ws/subscribe)
    ↓
Data Validation (validateBusPosition, isValidCoordinate)
    ↓
Zustand Store (useCommuterStore)
    ↓
React Components (HomeMapScreen, BusCard, MapMarkers)
    ↓
User Interface (Map, Cards, Status Indicators)
```

### Component Structure

```
src/
├── components/
│   ├── MapMarkers.tsx          # Bus, Stop, User location markers
│   ├── BusCard.tsx             # Bus information card
│   ├── StopCard.tsx            # Stop information card
│   ├── StatusIndicators.tsx    # Connection status display
│   └── [existing components]
├── hooks/
│   ├── useRealTimeBus.ts       # WebSocket + state management
│   └── [existing hooks]
├── screens/
│   ├── HomeMapScreen.tsx       # Main map view
│   ├── BusDetailsScreen.tsx    # Bus details
│   ├── SearchRoutesScreen.tsx  # Search UI
│   └── [existing screens]
├── store/
│   └── useCommuterStore.ts     # Zustand state
├── services/
│   └── routeService.ts         # API calls
├── utils/
│   ├── busStateUtils.ts        # Status helpers
│   ├── locationUtils.ts        # GPS helpers
│   ├── dataValidation.ts       # Input validation
│   └── [existing utilities]
└── styles/
    └── brand.ts                # Design tokens
```

---

## Key Concepts

### 1. Bus Position State

Every bus tracked has this structure:

```typescript
interface BusPosition {
  busId: string                  // Unique ID (trip_id)
  lat: number                    // Latitude (-90 to 90)
  lng: number                    // Longitude (-180 to 180)
  routeNo: string               // Route number display
  crowdLevel: number            // 0-10 (occupancy)
  speed?: number                // km/h
  eta?: number                  // Minutes to next stop
  licensePlate?: string         // Vehicle ID plate
  status?: VehicleStatus        // LIVE | APPROACHING | AT STOP | OFFLINE | STALE
  last_updated?: string         // ISO timestamp
  stop_etas?: StopEta[]        // Upcoming stops
}
```

### 2. Vehicle Status States

```typescript
type VehicleStatus = 'LIVE' | 'APPROACHING STOP' | 'AT STOP' | 'STALE' | 'SIGNAL LOST' | 'OFFLINE'

// UI Mapping:
- LIVE (< 5s)       → 🟢 Green  "Live"
- APPROACHING STOP  → 🔵 Blue   "Approaching Stop"
- AT STOP           → 🟣 Purple "At Stop"
- STALE (> 60s)     → 🟡 Yellow "Updated X ago"
- SIGNAL LOST       → 🔴 Red    "Signal Lost"
- OFFLINE           → ❌ Gray   "Offline"
```

### 3. WebSocket Message Protocol

```typescript
// Connection snapshot
{
  type: 'SNAPSHOT',
  data: LiveBusState[]  // Array of all current bus positions
}

// Per-bus update
{
  type: 'BUS_UPDATE',
  data: {
    trip_id: number,
    latitude: number,
    longitude: number,
    speed: number,
    occupancy_count: number,
    status: VehicleStatus,
    last_updated: string,
    stop_etas: StopEta[]
  }
}

// Bus offline
{
  type: 'BUS_OFFLINE',
  trip_id: number
}
```

### 4. Data Validation Pipeline

Every backend message goes through validation:

```
Raw Message
  ↓
validateBusPosition()
  ↓ (check coordinates, status enum, bus ID)
↓
isValidCoordinate() — GPS bounds check
  ↓
Sanitize strings (stop names, etc)
  ↓
Type coercion (speed to number, etc)
  ↓
Zustand State Update
  ↓
React Re-render
```

---

## Common Tasks

### Adding a New Bus Marker State

If you need a new bus status:

1. **Update the enum** in `store/useCommuterStore.ts`:
```typescript
export type VehicleStatus = 'LIVE' | 'APPROACHING STOP' | 'AT STOP' | 'DELAYED' | ...
```

2. **Update status mapping** in `utils/busStateUtils.ts`:
```typescript
case 'DELAYED':
  return {
    status: 'DELAYED',
    label: 'Delayed',
    color: '#F59E0B',
    icon: '⏱️',
    isLive: true,
  }
```

3. **Update validation** in `utils/dataValidation.ts`:
```typescript
const validStatuses = ['LIVE', 'APPROACHING STOP', 'AT STOP', 'DELAYED', ...]
```

### Customizing Map Markers

Edit `components/MapMarkers.tsx`:

```typescript
export function BusMarker({ bus, isSelected, isHighlighted }) {
  // Modify styles in StyleSheet at bottom of file
  // Change colors, sizes, shapes, etc.
}
```

### Changing Search Result Sorting

Edit `screens/SearchRoutesScreen.tsx`:

```typescript
const findRoutes = async () => {
  // Change 'fastest' to 'cheapest' or 'least-crowded'
  const res = await routeService.searchRoutes(from, to, 'fastest')
}
```

### Adding New Error Message

In any screen:

```typescript
const [error, setError] = useState<string | null>(null)

try {
  // API call
} catch (err) {
  setError('User-friendly message here')
}

{error && (
  <View style={styles.errorContainer}>
    <Text>{error}</Text>
    <TouchableOpacity onPress={retryFunc}>
      <Text>Retry</Text>
    </TouchableOpacity>
  </View>
)}
```

### Enabling Dark Theme

The app uses BRAND tokens that support light/dark:

```typescript
// styles/brand.ts already has light colors
// Add dark variant:
export const BRAND_DARK = {
  bg: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  // ... dark colors
}
```

---

## Debugging Tips

### WebSocket Connection Issues

1. **Check connection state:**
```typescript
const { isConnected, error } = useRealTimeBus()
console.log(`WS Connected: ${isConnected}, Error: ${error}`)
```

2. **Monitor incoming messages:**
Edit `hooks/useRealTimeBus.ts`, add to `onmessage`:
```typescript
console.log('WS Message:', msg.type, msg.data)
```

3. **Check browser DevTools:**
- Network tab → WS
- Console for errors
- Check CORS if cross-origin

### Bus Not Appearing on Map

1. Check if bus coordinates are valid:
```typescript
import { isValidCoordinate } from 'utils/busStateUtils'
console.log(isValidCoordinate(bus.lat, bus.lng))
```

2. Check if bus is in state:
```typescript
const { busPositions } = useCommuterStore()
console.log(busPositions) // Should show bus in this object
```

3. Check marker rendering:
```typescript
// Add to HomeMapScreen render:
{liveBuses.map(bus => {
  console.log('Rendering bus:', bus.busId, bus.lat, bus.lng)
  // ...
})}
```

### Stale Data Showing

Check `dataValidation.ts`:
```typescript
const age = (now - new Date(bus.last_updated).getTime()) / 1000
if (age > 300) removeStaleData()  // 5 min threshold
```

### High Memory Usage

1. Check for duplicate bus entries:
```typescript
const uniqueCount = new Set(Object.keys(busPositions)).size
console.log(`Buses in state: ${Object.keys(busPositions).length}, Unique: ${uniqueCount}`)
```

2. Check if listeners are cleaned up:
```typescript
// In useRealTimeBus cleanup:
return () => {
  wsRef.current?.close()  // Must close WebSocket
  // Other cleanup
}
```

---

## Performance Optimization

### Memoization

Bus markers are memoized to prevent re-renders:

```typescript
{liveBuses.map((bus) => (
  <Marker key={bus.busId}>  // Stable key is important!
    <BusMarker bus={bus} />
  </Marker>
))}
```

**Key rules:**
- Use `useMemo()` for expensive calculations
- Use `key={bus.busId}` (stable, unique)
- Don't create new objects in render

### Map Updates

Instead of re-rendering entire map:

```typescript
// ❌ BAD: Updates all buses
setBusPositions({ ...busPositions, [id]: newData })

// ✅ GOOD: Updates only one bus
updateBusPosition(id, newData)
```

### List Performance

For long bus/stop lists:

```typescript
// Use FlatList instead of ScrollView + map:
<FlatList
  data={buses}
  keyExtractor={item => item.busId}
  renderItem={({ item }) => <BusCard bus={item} />}
  removeClippedSubviews={true}  // Unmount off-screen items
/>
```

---

## Testing Checklist

### Before Pushing

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint warnings: `npx eslint src/`
- [ ] Test on physical device (iOS & Android)
- [ ] Test with slow network (DevTools)
- [ ] Test with location permission denied
- [ ] Test WebSocket disconnect/reconnect
- [ ] Test search with empty results
- [ ] Test invalid coordinates
- [ ] Test with 100+ buses on map
- [ ] Test back button on all screens

### Manual Test Cases

**Map Screen**
1. Load app → map shows live buses ✓
2. Tap bus → shows details ✓
3. Pan map → stops auto-following ✓
4. Tap recenter → returns to user location ✓
5. WebSocket disconnects → shows error ✓
6. WebSocket reconnects → refreshes buses ✓

**Search Screen**
1. Enter from/to → shows results ✓
2. Empty search → shows error message ✓
3. Tap result → navigates to map ✓
4. Tap clear → resets to default ✓

**Bus Details**
1. Tap bus → shows details ✓
2. Shows last updated timestamp ✓
3. Tap "Track on Map" → selects on map ✓
4. Tap "Set Alert" → navigates correctly ✓

---

## Deployment Checklist

### Before Release

- [ ] All error states tested
- [ ] All loading states timed (should be < 3s)
- [ ] WebSocket endpoint configured
- [ ] API endpoint configured
- [ ] Images/icons optimized
- [ ] No console.logs in production code
- [ ] TypeScript strict mode enabled
- [ ] Code reviewed by team
- [ ] Accessibility audit passed
- [ ] Performance budget met

### Environment Variables

Required in `.env` or `app.json`:

```
EXPO_PUBLIC_API_URL=https://api.nextbus.com
// WebSocket automatically uses wss:// if https
```

### Analytics to Track

```typescript
// Consider adding:
- WebSocket connection success rate
- Average message latency
- Bus update frequency
- Search result count
- User location permissions
- Error rate by type
```

---

## Code Style Guide

### Naming Conventions

- Components: PascalCase (`BusCard.tsx`)
- Hooks: camelCase with `use` prefix (`useRealTimeBus.ts`)
- Utils: camelCase (`busStateUtils.ts`)
- Enums/Types: PascalCase (`VehicleStatus`)
- Constants: UPPER_SNAKE_CASE (`MAX_RECONNECT_DELAY`)
- CSS classes: kebab-case (N/A for React Native)

### Component Template

```typescript
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BRAND } from '../styles/brand'

interface Props {
  data: any
  onPress?: (data: any) => void
}

export function MyComponent({ data, onPress }: Props) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  const handlePress = () => {
    if (onPress) onPress(data)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{data.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND.text,
  },
})
```

### Error Handling Template

```typescript
try {
  const result = await apiCall()
  setData(result)
} catch (error) {
  const message = error instanceof Error
    ? error.message
    : 'An error occurred'
  setError(message)
  console.error('API Error:', error)
}
```

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Maps](https://react-native-maps.github.io/react-native-maps/)
- [Zustand](https://github.com/pmndrs/zustand)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support & Maintenance

### Troubleshooting

**Q: WebSocket keeps disconnecting**
A: Check backend logs, increase timeout, verify CORS headers

**Q: Map shows old bus positions**
A: Check `removeStaleData()` threshold, verify `last_updated` field

**Q: App crashes on large datasets**
A: Reduce number of buses shown, use pagination

**Q: Search returns no results**
A: Verify backend `/api/routes/search` endpoint exists

### Getting Help

1. Check the IMPLEMENTATION_SUMMARY.md
2. Search code for similar patterns
3. Check backend logs for errors
4. Verify data structure matches interface
5. Test with sample data offline first

---

Happy coding! 🚀
