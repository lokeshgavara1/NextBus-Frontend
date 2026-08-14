import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import useCommuterStore from '../store/useCommuterStore'
import { BRAND } from '../styles/brand'

interface City {
  id: string
  name: string
  icon: string
  description: string
  routeCount: number
  color: string
}

const CITIES: City[] = [
  {
    id: 'karnataka',
    name: 'Karnataka',
    icon: '🏛️',
    description: 'Bangalore • Mysore • Mangalore',
    routeCount: 5,
    color: '#6366F1',
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    icon: '🌊',
    description: 'Vizag • Hyderabad • Chennai',
    routeCount: 5,
    color: '#3B82F6',
  },
]

export default function CitySelectionScreen({ navigation }: any) {
  const { selectedCity, setSelectedCity } = useCommuterStore()
  const [activeCity, setActiveCity] = useState<string>(selectedCity || '')

  const handleCitySelect = (cityId: string) => {
    setActiveCity(cityId)
    setSelectedCity(cityId)
    // Navigate to search routes after selection
    navigation.reset({
      index: 0,
      routes: [{ name: 'SearchRoutes' }],
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Your City</Text>
        <Text style={styles.headerSubtitle}>
          Choose a city to see available routes
        </Text>
      </View>

      {/* City Cards */}
      <View style={styles.cardsContainer}>
        {CITIES.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[
              styles.cityCard,
              activeCity === city.id && styles.cityCardActive,
              { borderColor: activeCity === city.id ? city.color : 'transparent' },
            ]}
            onPress={() => handleCitySelect(city.id)}
            activeOpacity={0.7}
          >
            {/* Background accent */}
            {activeCity === city.id && (
              <View
                style={[
                  styles.cardBackground,
                  { backgroundColor: city.color + '15' },
                ]}
              />
            )}

            {/* Content */}
            <View style={styles.cardContent}>
              {/* Icon */}
              <Text style={styles.cityIcon}>{city.icon}</Text>

              {/* City name */}
              <Text style={styles.cityName}>{city.name}</Text>

              {/* Description */}
              <Text style={styles.cityDescription}>{city.description}</Text>

              {/* Route count */}
              <View style={styles.routeCountBadge}>
                <Text style={styles.routeCountText}>
                  🚌 {city.routeCount} Routes
                </Text>
              </View>
            </View>

            {/* Selection indicator */}
            {activeCity === city.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Info section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>💡</Text>
          <Text style={styles.infoText}>
            Switch cities anytime from the search screen
          </Text>
        </View>
      </View>

      {/* Continue button */}
      {activeCity && (
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: CITIES.find((c) => c.id === activeCity)?.color },
          ]}
          onPress={() => handleCitySelect(activeCity)}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Explore Routes in{' '}
            {CITIES.find((c) => c.id === activeCity)?.name}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: BRAND.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BRAND.textSecondary,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  cityCard: {
    backgroundColor: BRAND.surface,
    borderRadius: BRAND.radius.lg,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    ...BRAND.shadow,
  },
  cityCardActive: {
    borderWidth: 3,
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  cityIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND.text,
    marginBottom: 6,
  },
  cityDescription: {
    fontSize: 12,
    color: BRAND.textSecondary,
    fontWeight: '500',
    marginBottom: 12,
  },
  routeCountBadge: {
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  routeCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND.text,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoBadge: {
    backgroundColor: BRAND.surfaceMuted,
    borderRadius: BRAND.radius.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoBadgeText: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: BRAND.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  continueButton: {
    borderRadius: BRAND.radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    ...BRAND.shadow,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
})
