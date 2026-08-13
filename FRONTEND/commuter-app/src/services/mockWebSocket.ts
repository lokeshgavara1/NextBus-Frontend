import { generateLiveBusUpdate, MOCK_BUSES, getMockSnapshot } from './mockData'

/**
 * Mock WebSocket Service — simulates real WebSocket for live bus tracking
 * Use this when backend WebSocket is unavailable
 */

export class MockWebSocket {
  private listeners: Record<string, Function[]> = {}
  private updateInterval: NodeJS.Timeout | null = null
  private readyState = WebSocket.OPEN
  private busUpdateIntervals: Map<number, NodeJS.Timeout> = new Map()

  constructor(private url: string) {
    this.listeners = {
      open: [],
      message: [],
      error: [],
      close: [],
    }
  }

  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null

  // Simulate connection
  connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN
      this.triggerEvent('open', new Event('open'))

      // Send initial snapshot
      this.sendSnapshot()

      // Start continuous bus updates
      this.startBusUpdates()
    }, 1000)
  }

  // Send initial snapshot of all buses
  private sendSnapshot() {
    const snapshot = getMockSnapshot()
    this.triggerEvent('message', new MessageEvent('message', { data: JSON.stringify(snapshot) }))
  }

  // Start updating bus positions
  private startBusUpdates() {
    // Update buses every 2-3 seconds
    MOCK_BUSES.forEach((bus) => {
      const updateInterval = Math.random() * 1000 + 2000 // 2-3 seconds
      const interval = setInterval(() => {
        if (this.readyState === WebSocket.OPEN) {
          const updatedBus = generateLiveBusUpdate(bus.trip_id)
          if (updatedBus) {
            const message = {
              type: 'BUS_UPDATE',
              data: updatedBus,
            }
            this.triggerEvent('message', new MessageEvent('message', { data: JSON.stringify(message) }))
          }
        }
      }, updateInterval)

      this.busUpdateIntervals.set(bus.trip_id, interval)
    })
  }

  // EventTarget methods
  addEventListener(type: string, listener: EventListener): void {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener as any)
  }

  removeEventListener(type: string, listener: EventListener): void {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener)
    }
  }

  private triggerEvent(type: string, event: Event | MessageEvent | CloseEvent) {
    // Call legacy handlers
    if (type === 'open' && this.onopen) this.onopen(event as Event)
    if (type === 'message' && this.onmessage) this.onmessage(event as MessageEvent)
    if (type === 'error' && this.onerror) this.onerror(event as Event)
    if (type === 'close' && this.onclose) this.onclose(event as CloseEvent)

    // Call registered listeners
    if (this.listeners[type]) {
      this.listeners[type].forEach((listener) => {
        if (typeof listener === 'function') {
          listener(event)
        } else if (listener && 'handleEvent' in listener) {
          listener.handleEvent(event)
        }
      })
    }
  }

  send(data: string): void {
    // Mock: Just acknowledge
    console.log('MockWebSocket.send:', data)
  }

  close(): void {
    this.readyState = WebSocket.CLOSED

    // Clean up intervals
    this.busUpdateIntervals.forEach((interval) => clearInterval(interval))
    this.busUpdateIntervals.clear()

    if (this.updateInterval) clearInterval(this.updateInterval)

    this.triggerEvent('close', new CloseEvent('close'))
  }

  // Mock dispatchEvent for EventTarget compatibility
  dispatchEvent(event: Event): boolean {
    this.triggerEvent(event.type, event)
    return true
  }
}

// Create a mock WebSocket constructor function
export function createMockWebSocket(url: string): MockWebSocket {
  const ws = new MockWebSocket(url)
  ws.connect()
  return ws
}
