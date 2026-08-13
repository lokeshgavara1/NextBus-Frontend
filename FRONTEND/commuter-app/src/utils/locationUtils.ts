import * as Location from 'expo-location'

export type LocationPermissionStatus = 'granted' | 'denied' | 'pending'

export interface LocationError {
  type: 'permission_denied' | 'location_disabled' | 'timeout' | 'unknown'
  message: string
}

export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') return 'granted'
    if (status === 'denied') return 'denied'
    return 'pending'
  } catch {
    return 'denied'
  }
}

export async function getCurrentLocation(): Promise<
  { latitude: number; longitude: number; accuracy?: number } | null
> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status !== 'granted') {
      return null
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 5000,
    })

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
    }
  } catch (error) {
    return null
  }
}

export async function watchLocation(
  callback: (location: { latitude: number; longitude: number }) => void,
  errorCallback?: (error: LocationError) => void
): Promise<{ unsubscribe: () => void }> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status !== 'granted') {
      errorCallback?.({
        type: 'permission_denied',
        message: 'Location permission not granted',
      })
      return { unsubscribe: () => {} }
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      }
    )

    return subscription
  } catch (error) {
    errorCallback?.({
      type: 'unknown',
      message: 'Failed to watch location',
    })
    return { unsubscribe: () => {} }
  }
}

export const getLocationErrorMessage = (error: LocationError): string => {
  switch (error.type) {
    case 'permission_denied':
      return 'Location permission required. Enable in settings.'
    case 'location_disabled':
      return 'Location services disabled. Enable in settings.'
    case 'timeout':
      return 'Location request timed out. Try again.'
    default:
      return 'Unable to get your location.'
  }
}
