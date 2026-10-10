import { HealthcareFacility, SupportedCity } from '../types';
import {
  VERIFIED_FACILITIES,
  PAKISTAN_CITIES,
  calculateDistanceKm,
  computeFacilityQualityScore,
  findClosestCity
} from '../data/hospitalsData';

export interface GeoLocationResult {
  displayName: string;
  city: SupportedCity;
  localityName?: string;
  lat: number;
  lon: number;
  isExactLocality: boolean;
}

/**
 * Searches for a city, sector, or locality in Pakistan using our verified locality database
 * first for instant, accurate city/landmark matching, then OpenStreetMap Nominatim.
 */
export async function searchLocationNominatim(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const localMatches: GeoLocationResult[] = [];

  // 1. Check exact or partial matches in our verified Pakistan Cities & Localities
  for (const cityInfo of PAKISTAN_CITIES) {
    const cityLower = cityInfo.name.toLowerCase();

    // Check localities inside this city first (e.g. "F-8 Markaz", "Johar Town", "Clifton", "Hayatabad")
    for (const loc of cityInfo.localities) {
      const locLower = loc.name.toLowerCase();
      if (
        locLower.includes(trimmed) ||
        trimmed.includes(locLower.split('/')[0].trim()) ||
        (trimmed.includes(cityLower) && trimmed.replace(cityLower, '').trim().length > 1 && locLower.includes(trimmed.replace(cityLower, '').trim()))
      ) {
        localMatches.push({
          displayName: `${loc.name}, ${cityInfo.name}`,
          city: cityInfo.name,
          localityName: loc.name,
          lat: loc.lat,
          lon: loc.lon,
          isExactLocality: true
        });
      }
    }

    // Check city name match
    if (cityLower === trimmed || cityLower.includes(trimmed) || trimmed === `${cityLower}, pakistan`) {
      localMatches.push({
        displayName: `${cityInfo.name}, Pakistan`,
        city: cityInfo.name,
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        isExactLocality: false
      });
    }
  }

  if (localMatches.length > 0) {
    return localMatches;
  }

  // 2. Try free public OpenStreetMap Nominatim API for any other landmark in Pakistan
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed + ', Pakistan')}&limit=5`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const closest = findClosestCity(lat, lon);
          const firstPart = String(item.display_name || '').split(',')[0].trim();
          const isCityItself = firstPart.toLowerCase() === closest.city.name.toLowerCase();

          return {
            displayName: item.display_name,
            city: closest.city.name,
            localityName: isCityItself ? undefined : firstPart,
            lat,
            lon,
            isExactLocality: !isCityItself
          };
        });
      }
    }
  } catch {
    // Network / timeout fallback
  }

  return [];
}

export interface FetchCityHealthcareOptions {
  city: SupportedCity;
  category: 'All' | 'Hospitals' | 'Clinics' | 'Pharmacies' | 'Emergency';
  referenceCoords?: { lat: number; lon: number; label: string } | null;
  includeLiveOsm?: boolean;
}

/**
 * Returns verified healthcare facilities strictly for the selected city and category.
 * Never mixes facilities from different cities, and strictly separates Hospitals, Clinics, and Pharmacies.
 * Calculates accurate Haversine distances ONLY when a valid reference coordinate is provided.
 */
export async function fetchNearbyHealthcare(
  lat: number,
  lon: number,
  _radiusMeters: number = 12000,
  category: string = 'All',
  selectedCity?: SupportedCity,
  referencePoint?: { lat: number; lon: number; label: string } | null
): Promise<HealthcareFacility[]> {
  // Determine target city strictly
  const targetCity: SupportedCity = selectedCity || findClosestCity(lat, lon).city.name;

  // 1. Filter verified dataset strictly by city and category
  const cityVerified = VERIFIED_FACILITIES.filter(fac => {
    // Strict city isolation: never mix Islamabad with Lahore/Karachi/Rawalpindi, etc.
    if (fac.city.toLowerCase() !== targetCity.toLowerCase()) {
      return false;
    }

    // Strict category separation
    if (category === 'Hospitals') return fac.type === 'hospital';
    if (category === 'Clinics') return fac.type === 'clinic';
    if (category === 'Pharmacies') return fac.type === 'pharmacy';
    if (category === 'Emergency') return fac.hasEmergency === true || fac.is24Hours === true;
    return true;
  });

  // 2. Attach accurate Haversine distance ONLY if a valid reference point is supplied
  const enrichedFacilities: HealthcareFacility[] = cityVerified.map(fac => {
    if (referencePoint && fac.lat !== undefined && fac.lon !== undefined) {
      return {
        ...fac,
        distanceKm: calculateDistanceKm(referencePoint.lat, referencePoint.lon, fac.lat, fac.lon),
        distanceSourceLabel: referencePoint.label
      };
    }
    return {
      ...fac,
      distanceKm: undefined,
      distanceSourceLabel: undefined
    };
  });

  // 3. Default sort: If referencePoint is GPS ("Your GPS Location"), sort nearest-first;
  // otherwise rank by composite medical quality score (services, rating, review volume, verification).
  enrichedFacilities.sort((a, b) => {
    if (referencePoint?.label === 'Your GPS Location' && a.distanceKm !== undefined && b.distanceKm !== undefined) {
      return a.distanceKm - b.distanceKm;
    }
    return computeFacilityQualityScore(b) - computeFacilityQualityScore(a);
  });

  return enrichedFacilities;
}
