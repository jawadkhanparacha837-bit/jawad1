import { HealthcareFacility } from '../types';
import { VERIFIED_FACILITIES, PAKISTAN_CITIES, calculateDistanceKm } from '../data/hospitalsData';

export interface GeoLocationResult {
  displayName: string;
  lat: number;
  lon: number;
}

/**
 * Searches for a location in Pakistan using OpenStreetMap Nominatim.
 * Falls back safely to predefined Pakistan cities if Nominatim is unreachable or rate-limited.
 */
export async function searchLocationNominatim(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // 1. Try free public OpenStreetMap Nominatim API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed + ', Pakistan')}&limit=5`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
      }
    }
  } catch {
    // Network / timeout / CORS fallback
  }

  // 2. Reliable local fallback matching Pakistan cities
  const matched = PAKISTAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(trimmed) || trimmed.includes(city.name.toLowerCase())
  );

  if (matched.length > 0) {
    return matched.map(m => ({
      displayName: `${m.name}, Pakistan`,
      lat: m.lat,
      lon: m.lon
    }));
  }

  // Default fallback to Islamabad
  return [
    {
      displayName: 'Islamabad, Pakistan',
      lat: 33.6844,
      lon: 73.0479
    }
  ];
}

/**
 * Fetches healthcare places near a coordinate using OpenStreetMap Overpass API,
 * with reliable fallback to our curated verified facilities dataset.
 * Does NOT call OpenAI.
 */
export async function fetchNearbyHealthcare(
  lat: number,
  lon: number,
  radiusMeters: number = 10000,
  category: string = 'All'
): Promise<HealthcareFacility[]> {
  let liveFacilities: HealthcareFacility[] = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const amenityFilter = category === 'Hospitals' 
      ? 'hospital' 
      : category === 'Clinics' 
        ? 'clinic|doctors' 
        : category === 'Pharmacies'
          ? 'pharmacy'
          : 'hospital|clinic|pharmacy|doctors';

    const overpassQuery = `[out:json][timeout:5];(node["amenity"~"${amenityFilter}"](around:${radiusMeters},${lat},${lon});way["amenity"~"${amenityFilter}"](around:${radiusMeters},${lat},${lon}););out center 30;`;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    const res = await fetch(overpassUrl, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.elements)) {
        liveFacilities = data.elements
          .filter((el: any) => el.tags && el.tags.name)
          .map((el: any) => {
            const itemLat = el.lat || (el.center && el.center.lat);
            const itemLon = el.lon || (el.center && el.center.lon);
            const amenity = el.tags.amenity || 'clinic';
            const facilityType: HealthcareFacility['type'] = 
              amenity === 'hospital' ? 'hospital' : 
              amenity === 'pharmacy' ? 'pharmacy' : 'clinic';

            return {
              id: `osm-${el.id}`,
              name: el.tags.name,
              nameUr: el.tags['name:ur'] || undefined,
              type: facilityType,
              address: [
                el.tags['addr:street'],
                el.tags['addr:suburb'] || el.tags['addr:district'],
                el.tags['addr:city']
              ].filter(Boolean).join(', ') || 'OpenStreetMap Verified Location',
              city: el.tags['addr:city'] || 'Nearby',
              lat: itemLat,
              lon: itemLon,
              phone: el.tags.phone || el.tags['contact:phone'],
              hasEmergency: el.tags.emergency === 'yes' || amenity === 'hospital',
              openHours: el.tags.opening_hours || (amenity === 'hospital' ? '24/7' : undefined),
              distanceKm: calculateDistanceKm(lat, lon, itemLat, itemLon)
            };
          });
      }
    }
  } catch {
    // Overpass is optional public API; fall back to verified directory seamlessly
  }

  // Combine with verified dataset sorted by distance from the requested center
  const allVerifiedWithDist = VERIFIED_FACILITIES.map(fac => ({
    ...fac,
    distanceKm: calculateDistanceKm(lat, lon, fac.lat, fac.lon)
  }));

  // Merge and deduplicate by name
  const existingNames = new Set(liveFacilities.map(f => f.name.toLowerCase()));
  const filteredVerified = allVerifiedWithDist.filter(fac => {
    if (existingNames.has(fac.name.toLowerCase())) return false;
    if (category === 'Hospitals' && fac.type !== 'hospital' && fac.type !== 'emergency') return false;
    if (category === 'Clinics' && fac.type !== 'clinic') return false;
    if (category === 'Pharmacies' && fac.type !== 'pharmacy') return false;
    if (category === 'Emergency' && !fac.hasEmergency) return false;
    return true;
  });

  const combined = [...liveFacilities, ...filteredVerified];
  
  // Sort by closest distance first
  combined.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  return combined;
}
