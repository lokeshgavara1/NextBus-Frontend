# NextBus Commuter App - Verification Checklist

## Pre-Deployment Verification

Use this checklist to verify all audit requirements have been met before deploying.

---

## 1. MAP & LIVE BUS VISUALIZATION ✓

### Bus Stop Markers
- [ ] Stop markers are circles with numbers (1, 2, 3...)
- [ ] Stops are visually distinct from bus markers
- [ ] Consistent iconography (all same color/style)
- [ ] No marker overlap (zoom/pan reveals all stops)
- [ ] Test: Add 20+ stops, verify all visible and distinct

### Bus Markers
- [ ] Bus markers look like buses (emoji + route number)
- [ ] Markers maintain consistent styling
- [ ] Moving state: normal bus marker
- [ ] Stopped state: bus marker with pause icon or different color
- [ ] Delayed state: yellow/orange bus marker
- [ ] Offline state: gray/crossed-out bus marker
- [ ] Selected bus: larger, different color, accent border
- [ ] Test: Select different buses, verify clear visual difference

### Live Bus Movement
- [ ] New GPS coordinates update marker position
- [ ] No ghost/stale positions remain on map
- [ ] Each coordinate pair mapped to correct bus
- [ ] Test: Watch bus move for 30 seconds, verify no old positions

### User Location
- [ ] Blue marker shows current location
- [ ] Updates when user moves
- [ ] Doesn't force map back after manual pan
- [ ] "Recenter" button works
- [ ] Test: Pan map, move device, tap recenter

---

## 2. ROUTE VISUALIZATION ✓

### Route Path Display
- [ ] Polyline connects all stops in order
- [ ] Line color is primary brand color
- [ ] Line thickness appropriate (not too thin/thick)
- [ ] Test: View route with 10+ stops

### Bus Position on Route
- [ ] Bus marker shown on map
- [ ] Bus positioned between route stops
- [ ] Bus marker overlaid on top (higher z-index)
- [ ] Test: Bus should appear above route line

### User Position on Route
- [ ] User location marker visible
- [ ] Can see both user and bus on route
- [ ] Doesn't obscure other markers
- [ ] Test: Start outside route, watch user move into route

### Route States
- [ ] Completed portion vs remaining distinguishable
- [ ] First/last stops clearly marked
- [ ] Test: View route with bus at different points

### Origin & Destination
- [ ] Origin clearly marked (green 🟢 or special marker)
- [ ] Destination clearly marked (red 🔴 or special marker)
- [ ] Different from regular stops
- [ ] Test: Verify origin/destination on multiple routes

### Route Auto-Fit
- [ ] When route selected, map auto-zooms
- [ ] All stops and bus visible
- [ ] Proper padding around edges
- [ ] Animation smooth (not jarring)
- [ ] Test: Select route, verify framing

---

## 3. LIVE TRIP/BUS LOCATION ✓

### Backend → Frontend Flow
- [ ] Backend sends WebSocket messages
- [ ] Frontend receives messages
- [ ] Store updates with new positions
- [ ] UI re-renders immediately
- [ ] Test: Monitor WebSocket in DevTools

### Bus State Updates
- [ ] Correct bus identified by trip_id
- [ ] Only that bus's position updates
- [ ] Other buses unaffected
- [ ] Map re-render efficient (not full redraw)
- [ ] Test: With 50+ buses, update one, watch performance

### Marker Animation
- [ ] Buses move smoothly between positions
- [ ] No instant teleporting (visual glitch)
- [ ] Animation completes before next update
- [ ] Test: Ready for Animated API implementation

### ETA Updates
- [ ] ETA value changes with new data
- [ ] ETA color changes based on freshness
- [ ] Not stuck on old value
- [ ] Test: Watch ETA count down over time

### Status Updates
- [ ] Status field updates (LIVE → AT STOP → etc)
- [ ] Color coding reflects status
- [ ] Status label in UI updates
- [ ] Test: Verify status changes on map

### Location Age Display
- [ ] Shows "Live" for fresh data (< 5s)
- [ ] Shows "Updated 30s ago" format
- [ ] Shows "⚠️ Updated 2m ago" when stale
- [ ] Color changes: green → yellow → red
- [ ] Test: Watch timestamps update in real-time

### WebSocket Lifecycle
- [ ] Subscribe once on connect
- [ ] No duplicate listeners
- [ ] Listeners cleaned up on unmount
- [ ] Reconnect doesn't create new subscriptions
- [ ] Test: Toggle route selection multiple times

### Reconnection
- [ ] Disconnection detected
- [ ] Auto-reconnect initiates
- [ ] Exponential backoff (3s, 4.5s, 6.7s... up to 30s)
- [ ] Reconnection status shown to user
- [ ] Test: Kill server, watch app attempt reconnect

---

## 4. LOCATION / GPS ✓

### Permission Handling
- [ ] Permission dialog shows on first launch
- [ ] "Allow" permission grants location access
- [ ] "Deny" permission gracefully handled
- [ ] App works without location (limited features)
- [ ] Test: Toggle permissions in Settings

### GPS Status
- [ ] User location marker appears when enabled
- [ ] Marker updates as user moves
- [ ] Test: Move device 10+ meters, verify update

### Recenter Functionality
- [ ] Recenter button (📍) visible
- [ ] Tap recenter → map moves to user location
- [ ] Animation smooth
- [ ] Works multiple times
- [ ] Test: Pan map, tap recenter, repeat

### Auto-Follow Behavior
- [ ] Map auto-follows when app opens
- [ ] Map stops following when user pans
- [ ] Doesn't jump back to location during use
- [ ] Test: Pan map, move device, verify map stays panned

### Location Permissions
- [ ] Permissions dialog uses device UI
- [ ] Respects previous choices
- [ ] Can re-request from settings
- [ ] Test: Deny → Open Settings → Grant → App works

---

## 5. SEARCH & ROUTE SELECTION ✓

### Search States
- [ ] Initial state: form + popular destinations
- [ ] Focused state: keyboard visible, input active
- [ ] Loading state: spinner + "Searching routes..."
- [ ] Results state: list of routes with details
- [ ] Empty state: "No routes found" + Try Again button
- [ ] Error state: Error message + Retry button
- [ ] Cleared state: Back to initial form
- [ ] Test: Go through each state sequence

### Loading State Details
- [ ] Spinner visible
- [ ] "Searching routes..." text shown
- [ ] Interface not frozen (user can cancel)
- [ ] Typical load time: 2-3 seconds
- [ ] Test: Search for routes, watch loading state

### Results Display
- [ ] Route number shown prominently
- [ ] Route name shown
- [ ] From → To stops shown clearly (🟢 → 🔴)
- [ ] ETA shown with time (⏱ Xs)
- [ ] Crowd level shown (👥 X%)
- [ ] Fare shown (₹X)
- [ ] Test: Verify all info visible, readable

### Result Distinction
- [ ] Can differentiate between similar routes
- [ ] Stop names show area/locality
- [ ] Route numbers clear
- [ ] ETAs different per route
- [ ] Test: Search from RTC to Beach, verify routes different

### Route Selection
- [ ] Tap result → visual feedback (highlight)
- [ ] Navigates to map
- [ ] Route highlighted on map
- [ ] Bus associated with route
- [ ] Test: Tap multiple routes, verify selection

### Selection Feedback
- [ ] Button tap has haptic/visual feedback
- [ ] Route loads on map quickly
- [ ] Journey banner shows route details
- [ ] Test: Tap result, watch map update

### Clear/Reset Search
- [ ] Clear button visible
- [ ] Tap clear → input fields empty
- [ ] Results hidden
- [ ] Default locations restored
- [ ] UI back to initial state
- [ ] Test: Search, tap clear, verify all reset

---

## 6. BUS CARDS ✓

### Information Priority
- [ ] 1. Bus number/route: Largest, boldest text
- [ ] 2. Route info: Secondary text
- [ ] 3. Current/next stop: Visible
- [ ] 4. ETA: Color-coded (green = soon)
- [ ] 5. Status: Live/Updated X ago/Offline
- [ ] Test: Verify hierarchy at glance

### Card States
- [ ] Default state: white, bordered
- [ ] Selected state: primary color background
- [ ] Pressed state: scale down slightly
- [ ] Disabled state: grayed out
- [ ] Loading state: spinner visible
- [ ] Offline state: striped/dimmed appearance
- [ ] Test: Interact with different card states

### Card Content
- [ ] Bus number prominent (🚌 102)
- [ ] Route badges showing
- [ ] ETA in corners (large, color-coded)
- [ ] Status indicator with icon
- [ ] License plate shown
- [ ] Last updated timestamp
- [ ] Test: View multiple buses, verify all info there

### Clickability
- [ ] Cards respond to tap
- [ ] Only truly clickable cards look clickable
- [ ] No fake interactive elements
- [ ] Tap takes to details screen
- [ ] Test: Tap card, verify navigation

---

## 7. STOP CARDS ✓

### Core Information
- [ ] Stop name: Clear, prominent
- [ ] Location/area: Secondary info
- [ ] Upcoming buses: Listed
- [ ] ETA: Time to arrival
- [ ] Badges: Origin/Destination/Next Stop
- [ ] Test: View stop details

### Visual Hierarchy
- [ ] Stop name larger than other text
- [ ] Secondary info smaller, lighter color
- [ ] ETA prominent and color-coded
- [ ] Test: Scan card in 2 seconds, get key info

### Selected State
- [ ] Clear visual indication
- [ ] Border or accent color
- [ ] Different from unselected
- [ ] Test: Select/deselect stop cards

### Stop Sequence
- [ ] Stop number displayed (Stop #3)
- [ ] Matches route sequence
- [ ] Test: View route, verify stops numbered correctly

---

## 8. NAVIGATION AUDIT ✓

### All Screens Navigate Correctly
- [ ] Home/Dashboard → ✓
- [ ] Search → ✓
- [ ] Routes → ✓
- [ ] Stops → ✓
- [ ] Bus Details → ✓
- [ ] Trip Details → ✓
- [ ] Live Tracking → ✓
- [ ] Profile → ✓
- [ ] Settings → ✓
- [ ] SOS → ✓

### Navigation Destinations
- [ ] Each button/link goes to correct screen
- [ ] No dead buttons
- [ ] No broken links
- [ ] Correct data passed between screens
- [ ] Test: Click every interactive element

### Back Navigation
- [ ] Android back button works
- [ ] iOS swipe-back works
- [ ] Back goes to previous screen (not home)
- [ ] Back doesn't lose state
- [ ] Test: Multiple navigations backward

### Tab Navigation
- [ ] Bottom tabs work
- [ ] Current tab highlighted
- [ ] Tab state preserved when switching
- [ ] Test: Navigate between tabs multiple times

### Floating Action Buttons
- [ ] All FABs visible
- [ ] SOS button → SOS screen
- [ ] Recenter button → centers map
- [ ] Test: All FABs functional

---

## 9. LOADING / ERROR / EMPTY STATES ✓

### Every API-driven Screen
- [ ] Has loading state (spinner + message)
- [ ] Has error state (message + Retry button)
- [ ] Has empty state (message + Try Again)
- [ ] Has success state (data displayed)
- [ ] Test: Go through all states on each screen

### Loading Messages
- [ ] "Loading routes..."
- [ ] "Finding nearby buses..."
- [ ] "Loading stops..."
- [ ] Spinner visible
- [ ] Not frozen (can cancel)
- [ ] Test: Watch loading for 1-2 seconds

### Error Messages
- [ ] User-friendly (not technical)
- [ ] Describes what went wrong
- [ ] Suggests next action
- [ ] Retry button functional
- [ ] Retry actually re-executes operation
- [ ] Test: Trigger error, tap retry, verify operation repeats

### Empty State Messages
- [ ] "No routes found"
- [ ] "No buses available"
- [ ] "No stops nearby"
- [ ] Suggests what to do
- [ ] Try Again button works
- [ ] Test: Search with parameters that return nothing

### Loading Time
- [ ] < 1s for local data
- [ ] < 3s for API calls
- [ ] < 5s for WebSocket connection
- [ ] Show loading if > 1s
- [ ] Test: Monitor network timing

---

## 10. UI CONSISTENCY ✓

### Iconography
- [ ] All icons from same system
- [ ] 🚌 Bus (consistent)
- [ ] 📍 Stop (consistent)
- [ ] 🟢 Origin (consistent)
- [ ] 🔴 Destination (consistent)
- [ ] 🎯 Current location (consistent)
- [ ] No mixed styles
- [ ] Test: Scan app, verify icon consistency

### Typography
- [ ] Screen titles: Large, bold (24px+)
- [ ] Section titles: Medium (16px+)
- [ ] Body text: Regular (14px)
- [ ] Small text: 12px
- [ ] Labels: 11px
- [ ] All readable
- [ ] Test: Check text sizes on device

### Spacing
- [ ] 16px horizontal margins (consistent)
- [ ] 12px gaps between cards
- [ ] 8px padding within components
- [ ] 4px micro-spacing for details
- [ ] Consistent throughout
- [ ] Test: Measure spacing, verify consistent

### Colors
- [ ] Primary color: #4F46E5 (blue-indigo)
- [ ] Success: #16A34A (green)
- [ ] Warning: #F59E0B (yellow)
- [ ] Danger: #DC2626 (red)
- [ ] Text: Dark gray
- [ ] Background: Light gray
- [ ] Test: Check all colors match brand.ts

### Components
- [ ] Buttons: All same radius, padding
- [ ] Cards: All same radius, shadow
- [ ] Inputs: All same height, padding
- [ ] Status dots: All same size
- [ ] Badges: All same radius
- [ ] Test: Verify consistency across screens

### Shadows/Elevation
- [ ] Cards have consistent shadow
- [ ] Buttons have press feedback
- [ ] No inconsistent shadows
- [ ] Test: Compare shadows on similar elements

---

## 11. ACCESSIBILITY ✓

### Color Contrast
- [ ] Text on background: WCAG AAA (> 7:1)
- [ ] Buttons on background: WCAG AA (> 4.5:1)
- [ ] Test: Use contrast checker tool

### Touch Targets
- [ ] All buttons: 48x48px minimum
- [ ] All tappable areas: 44x44px minimum
- [ ] Adequate spacing between targets
- [ ] Test: Tap buttons with finger, not stylus

### Text Readability
- [ ] Minimum 14px for body text
- [ ] Font weight 600+ for headers
- [ ] Sufficient line spacing
- [ ] Test: Read text from arm's length

### Labels
- [ ] All icons have text labels
- [ ] No information by color alone
- [ ] Status indicators have text
- [ ] Test: Disable colors, still understandable

### Screen Reader (if applicable)
- [ ] Images have alt text
- [ ] Buttons have labels
- [ ] Form inputs labeled
- [ ] Test: Enable screen reader, navigate

---

## 12. MAP PERFORMANCE ✓

### Rendering Efficiency
- [ ] Map doesn't re-render for every bus update
- [ ] Only updated bus marker refreshes
- [ ] Other markers unchanged
- [ ] Camera position doesn't reset unnecessarily
- [ ] Test: Watch performance with 50+ buses

### Marker Management
- [ ] Markers not recreated on every render
- [ ] Marker keys are stable (busId)
- [ ] Marker count doesn't grow infinitely
- [ ] Old markers removed
- [ ] Test: Monitor marker count, should stay stable

### Route Calculations
- [ ] Route polyline calculated once
- [ ] Not recalculated on every bus update
- [ ] Unrelated routes ignored
- [ ] Test: Watch a different route while tracking another

### Map Initialization
- [ ] Map initializes once
- [ ] Camera position doesn't reset to default
- [ ] Region changes don't re-init
- [ ] Test: Zoom, pan, verify map stays initialized

### Performance Metrics
- [ ] Frame rate stays 60fps
- [ ] CPU usage < 50%
- [ ] Memory usage < 200MB
- [ ] Test: Use DevTools/Profiler

---

## 13. DATA VALIDATION ✓

### Coordinate Validation
- [ ] Latitude: -90 to 90
- [ ] Longitude: -180 to 180
- [ ] Missing coordinates rejected
- [ ] NaN values handled
- [ ] Test: Inject bad coords, verify error handling

### Bus ID Validation
- [ ] Non-empty trip_id required
- [ ] Duplicates removed
- [ ] Valid type (string/number)
- [ ] Test: Verify no buses with missing IDs

### ETA Validation
- [ ] ETA is number or null
- [ ] Negative ETAs rejected
- [ ] Extremely large ETAs clamped
- [ ] Test: Inject bad ETA values

### Status Validation
- [ ] Status from enum only
- [ ] Unknown statuses → LIVE
- [ ] Case-sensitive matching
- [ ] Test: Inject invalid status values

### Timestamp Validation
- [ ] ISO format verified
- [ ] Parseable as Date
- [ ] Not in future
- [ ] Test: Inject malformed timestamps

### Array Validation
- [ ] stop_etas is array or null
- [ ] Each ETA has required fields
- [ ] Invalid items filtered out
- [ ] Test: Inject bad array data

---

## 14. OFFLINE HANDLING ✓

### WebSocket Offline
- [ ] Detects disconnection
- [ ] Shows "Connection Lost" message
- [ ] Auto-reconnects
- [ ] Shows reconnection progress
- [ ] Preserves last known data
- [ ] Test: Toggle airplane mode

### API Offline
- [ ] HTTP requests timeout
- [ ] Shows "Network Error" message
- [ ] Provides "Retry" button
- [ ] Retry actually retries
- [ ] Test: Block network, try search

### Offline Data Display
- [ ] Shows last known bus positions
- [ ] Clearly marks as stale/offline
- [ ] Doesn't suggest live updates
- [ ] Test: Observe stale data UI

---

## 15. ANDROID BACK BUTTON ✓

### Screen Navigation
- [ ] Home → (back does nothing)
- [ ] Search → Home (back exits search)
- [ ] Bus Details → Previous screen
- [ ] Map → Home (if from tab)
- [ ] SOS → Home
- [ ] Test: Press back on each screen

### Modal Handling
- [ ] Alert dialogs → Back dismisses
- [ ] Bottom sheets → Back dismisses
- [ ] Modals close on back
- [ ] Test: Open modals, press back

### Consistency
- [ ] Back always goes previous
- [ ] Never loses data
- [ ] Back button icon visible
- [ ] Test: Multiple back presses

---

## 16. CODE QUALITY ✓

### TypeScript
- [ ] No TypeScript errors
- [ ] All functions typed
- [ ] All props interfaces defined
- [ ] Union types for states
- [ ] Test: `npx tsc --noEmit`

### Unused Code
- [ ] No unused imports
- [ ] No dead code
- [ ] No commented-out code
- [ ] No unused variables
- [ ] Test: Review each file

### Console Output
- [ ] No console.logs in production
- [ ] No console.warnings
- [ ] Only console.errors for true errors
- [ ] Debug logs conditional (@dev only)
- [ ] Test: Check DevTools console while using app

### Memory Leaks
- [ ] useEffect cleanup functions present
- [ ] WebSocket closed on unmount
- [ ] Timers cleared
- [ ] Event listeners removed
- [ ] Test: Navigate between screens repeatedly

### Dependencies
- [ ] useEffect dependencies correct
- [ ] useCallback dependencies correct
- [ ] useMemo dependencies correct
- [ ] No stale closures
- [ ] Test: ESLint exhaustive-deps rule

---

## 17. FINAL INTEGRATION TEST ✓

### End-to-End User Journeys

**Journey 1: Discover Bus**
1. [ ] App opens → Map loads
2. [ ] Buses visible on map
3. [ ] Tap bus → Details screen
4. [ ] Verify bus info displays
5. [ ] Tap "Track on Map" → Route shows
6. [ ] Verify route polyline correct
7. [ ] Verify bus position on route

**Journey 2: Search Route**
1. [ ] Tap search → Search screen loads
2. [ ] Enter from/to → Results show
3. [ ] Tap result → Map loads route
4. [ ] Verify route highlighted
5. [ ] Verify bus appears on route
6. [ ] Verify journey banner shows
7. [ ] Tap "Clear" → Reset to search

**Journey 3: Live Tracking**
1. [ ] Route selected on map
2. [ ] Wait 30 seconds
3. [ ] Verify bus moves smoothly
4. [ ] Verify ETA updates
5. [ ] Verify status stays current
6. [ ] Verify "Updated X ago" updates
7. [ ] Disconnect WebSocket
8. [ ] Verify "Connection Lost" shown
9. [ ] Verify auto-reconnect starts
10. [ ] Verify data refreshes on reconnect

**Journey 4: Location**
1. [ ] App starts → Location permission
2. [ ] Grant permission → Blue dot appears
3. [ ] Move device → Dot moves
4. [ ] Pan map → Dot stays put
5. [ ] Tap recenter → Map moves to dot
6. [ ] Verify smooth animation

**Journey 5: Error Recovery**
1. [ ] Turn off WiFi
2. [ ] Try to search → Error message
3. [ ] Tap "Retry" → Search retries
4. [ ] Turn WiFi back on
5. [ ] Verify search succeeds
6. [ ] No orphaned loading states
7. [ ] No memory leaks

---

## Device Testing

### iOS
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 (regular)
- [ ] iPhone 14 Pro Max (large, notch)
- [ ] Landscape orientation
- [ ] With notch/Dynamic Island
- [ ] Keyboard visibility

### Android
- [ ] Pixel 4a (small)
- [ ] Pixel 6 (regular)
- [ ] Galaxy Tab (large)
- [ ] Landscape orientation
- [ ] With notch
- [ ] Navigation buttons visible

### Orientation Changes
- [ ] Portrait → Landscape → Portrait
- [ ] Map preserves zoom/pan
- [ ] Cards reflow correctly
- [ ] No layout issues
- [ ] Test: Toggle orientation multiple times

### Screen Sizes
- [ ] 5" screens render correctly
- [ ] 6.7" screens render correctly
- [ ] No text overflow
- [ ] Touch targets still accessible
- [ ] Test: On real devices, not just emulator

---

## Network Conditions

### WiFi (Fast: 50Mbps)
- [ ] Loading states quick (< 1s)
- [ ] Data displays immediately
- [ ] No lag in scrolling
- [ ] Test: On WiFi network

### 4G LTE (Medium: 10Mbps)
- [ ] Loading states show (1-2s)
- [ ] Data loads progressively
- [ ] UI still responsive
- [ ] WebSocket works
- [ ] Test: On cellular

### 3G (Slow: 1Mbps)
- [ ] Loading states persist (2-5s)
- [ ] Data loads completely
- [ ] No premature timeouts
- [ ] User can cancel
- [ ] Test: Throttle in DevTools

### Offline (No Connection)
- [ ] Graceful error shown
- [ ] Retry button provided
- [ ] No stuck spinners
- [ ] Test: Airplane mode

---

## Performance Metrics

### Load Time
- [ ] App startup: < 3 seconds
- [ ] Map screen: < 2 seconds
- [ ] Search results: < 3 seconds
- [ ] Bus details: < 1 second
- [ ] Test: Measure actual load times

### Frame Rate
- [ ] Scrolling: 60fps
- [ ] Animations: 60fps
- [ ] Map panning: 60fps
- [ ] Bus movement: 30+fps acceptable
- [ ] Test: Use Profiler or fps meter

### Memory Usage
- [ ] Initial: < 100MB
- [ ] After 1 hour: < 150MB
- [ ] No memory leaks
- [ ] Test: Long session test

### CPU Usage
- [ ] Idle: < 5%
- [ ] Scrolling: < 30%
- [ ] Live updates: < 20%
- [ ] Test: Monitor Activity/DevTools

---

## Sign-Off

**Tester Name:** ___________________
**Date:** ___________________
**Build Version:** ___________________

### Summary
- [ ] All critical items passed
- [ ] All high priority items passed
- [ ] All low priority items passed
- [ ] No blocker issues
- [ ] Ready for release

**Notes:**
```
[Add any issues found and resolutions]


```

**Approved By:** ___________________
**Approval Date:** ___________________

---

*This checklist ensures the NextBus Commuter App meets all audit requirements and quality standards.*
