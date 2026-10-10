import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Phone,
  ExternalLink,
  RefreshCw,
  Building2,
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  Star,
  Clock,
  Globe,
  CheckCircle2,
  SlidersHorizontal,
  X,
  UserCheck,
  Compass,
  Info,
  PhoneCall
} from 'lucide-react';
import L from 'leaflet';
import { HealthcareFacility, Language, SupportedCity } from '../types';
import { searchLocationNominatim } from '../utils/osmService';
import {
  PAKISTAN_CITIES,
  VERIFIED_FACILITIES,
  calculateDistanceKm,
  computeFacilityQualityScore,
  findClosestCity,
  isFacilityOpenNow,
  getEmergencyContactsForCity
} from '../data/hospitalsData';
import { useTheme } from '../context/ThemeContext';

interface HealthcareFinderProps {
  language: Language;
}

type CategoryFilter = 'All' | 'Hospitals' | 'Clinics' | 'Pharmacies' | 'Emergency';
type RadiusFilter = 'all' | 1 | 3 | 5 | 10 | 25;
type SortOption = 'recommended' | 'nearest' | 'rating';

interface ReferenceLocation {
  lat: number;
  lon: number;
  label: string;
  labelUr: string;
  mode: 'gps' | 'locality' | 'city-center';
}

export const HealthcareFinder: React.FC<HealthcareFinderProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const { activeAccentHex } = useTheme();

  // 1. Primary City & Search State
  const [selectedCity, setSelectedCity] = useState<SupportedCity>('Islamabad');
  const [searchQuery, setSearchQuery] = useState('Islamabad');
  const [searchStatusMsg, setSearchStatusMsg] = useState<string | null>(null);

  // 2. Category, Name, Specialty, Locality, Distance, Rating, OpenNow & Sort Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [facilitySearch, setFacilitySearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('All');
  const [selectedRadius, setSelectedRadius] = useState<RadiusFilter>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // 3. Starting Location Reference State for Accurate Distance Calculation
  // By default when switching cities without GPS or locality selection, referenceLocation is null
  // so we never pretend the user is at the city center unless they choose a locality, GPS, or city-center reference.
  const [referenceLocation, setReferenceLocation] = useState<ReferenceLocation | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 4. Active / Selected Facility & Modal Detail State
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>('pims-islamabad');
  const [detailModalFacilityId, setDetailModalFacilityId] = useState<string | null>(null);

  // 5. Map DOM & Leaflet instance refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  const currentCityInfo = useMemo(
    () => PAKISTAN_CITIES.find(c => c.name === selectedCity) || PAKISTAN_CITIES[0],
    [selectedCity]
  );

  // Switch city cleanly: reset city-specific filters and remove results from previous city
  const handleSelectCity = (city: SupportedCity, keepReferenceIfMatch = false) => {
    const cityObj = PAKISTAN_CITIES.find(c => c.name === city) || PAKISTAN_CITIES[0];
    setSelectedCity(city);
    setSearchQuery(city);
    setSelectedSpecialty('All');
    setSelectedLocalityFilter('All');
    setFacilitySearch('');
    setSearchStatusMsg(null);
    setGpsError(null);

    if (!keepReferenceIfMatch) {
      setReferenceLocation(null);
      setSelectedRadius('all');
      if (sortBy === 'nearest') {
        setSortBy('recommended');
      }
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([cityObj.lat, cityObj.lon], 12);
    }
  };

  // Select a verified locality/landmark in the current city as the distance reference point
  const handleSelectReferencePoint = (value: string) => {
    setGpsError(null);
    if (value === 'none') {
      setReferenceLocation(null);
      setSelectedRadius('all');
      if (sortBy === 'nearest') setSortBy('recommended');
      return;
    }

    if (value === 'city-center') {
      setReferenceLocation({
        lat: currentCityInfo.lat,
        lon: currentCityInfo.lon,
        label: `${currentCityInfo.name} City Center`,
        labelUr: `${currentCityInfo.nameUr} سٹی سینٹر`,
        mode: 'city-center'
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([currentCityInfo.lat, currentCityInfo.lon], 13);
      }
      return;
    }

    const loc = currentCityInfo.localities.find(l => l.name === value);
    if (loc) {
      setReferenceLocation({
        lat: loc.lat,
        lon: loc.lon,
        label: `${loc.name}, ${currentCityInfo.name}`,
        labelUr: `${loc.nameUr}، ${currentCityInfo.nameUr}`,
        mode: 'locality'
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([loc.lat, loc.lon], 14);
      }
    }
  };

  // Mode A: Near Me (Browser Geolocation)
  const handleDetectLocation = () => {
    setGpsError(null);
    setSearchStatusMsg(null);

    if (!navigator.geolocation) {
      setGpsError(
        isUrdu
          ? 'آپ کا براؤزر جیو لوکیشن سپورٹ نہیں کرتا۔ براہ کرم شہر میں اپنا علاقہ منتخب کریں۔'
          : 'Browser geolocation is not supported on this device. Please select a locality starting point below.'
      );
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const closest = findClosestCity(latitude, longitude);

        // Update to the user's closest supported city and set exact GPS reference
        setSelectedCity(closest.city.name);
        setSearchQuery(`${closest.city.name} (Near Me)`);
        setSelectedSpecialty('All');
        setSelectedLocalityFilter('All');
        setReferenceLocation({
          lat: latitude,
          lon: longitude,
          label: 'Your GPS Location',
          labelUr: 'آپ کی موجودہ جی پی ایس لوکیشن',
          mode: 'gps'
        });
        setSortBy('nearest');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 13);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err);
        setGpsLoading(false);
        setGpsError(
          isUrdu
            ? 'لوکیشن کی اجازت نہیں ملی۔ درست فاصلہ معلوم کرنے کے لیے نیچے دیے گئے مینو سے اپنا علاقہ/سیکٹر منتخب کریں۔'
            : 'Location permission was declined or unavailable. Select a locality or landmark below to calculate accurate straight-line distances.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Mode B: Search City, Sector, or Landmark
  const handleLocationSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setGpsLoading(true);
    setGpsError(null);
    setSearchStatusMsg(null);

    try {
      const results = await searchLocationNominatim(q);
      if (results.length > 0) {
        const first = results[0];
        setSelectedCity(first.city);
        setSelectedSpecialty('All');
        setSelectedLocalityFilter('All');

        if (first.isExactLocality && first.localityName) {
          setReferenceLocation({
            lat: first.lat,
            lon: first.lon,
            label: `${first.localityName}, ${first.city}`,
            labelUr: `${first.localityName}، ${first.city}`,
            mode: 'locality'
          });
          setSortBy('nearest');
          setSearchStatusMsg(
            isUrdu
              ? `${first.city} میں "${first.localityName}" سے سیدھے فاصلے دکھائے جا رہے ہیں۔`
              : `Showing verified ${first.city} facilities with approximate straight-line distances from ${first.localityName}.`
          );
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([first.lat, first.lon], 14);
          }
        } else {
          // City-level search: do not pretend city center is user's exact location
          setReferenceLocation(null);
          setSelectedRadius('all');
          if (sortBy === 'nearest') setSortBy('recommended');
          setSearchStatusMsg(
            isUrdu
              ? `${first.city} کے تصدیق شدہ ہسپتال، کلینک اور فارمیسی دکھائے جا رہے ہیں۔ فاصلے کے لیے اپنا علاقہ منتخب کریں۔`
              : `Showing verified facilities in ${first.city}. Select a locality starting point or click "Near Me" to calculate distances.`
          );
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([first.lat, first.lon], 12);
          }
        }
      } else {
        setSearchStatusMsg(
          isUrdu
            ? `"${q}" سے متعلق کوئی علاقہ نہیں ملا۔ براہ کرم اسلام آباد، راولپنڈی، لاہور، کراچی، پشاور، کوئٹہ، ملتان یا فیصل آباد تلاش کریں۔`
            : `No matching location found for "${q}". Please select one of the 8 supported cities or search a known sector/locality.`
        );
      }
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setGpsLoading(false);
    }
  };

  // All verified facilities strictly in the selected city
  const cityFacilities = useMemo(() => {
    return VERIFIED_FACILITIES.filter(
      fac => fac.city.toLowerCase() === selectedCity.toLowerCase()
    );
  }, [selectedCity]);

  // Available specialties in the selected city for the Specialty filter dropdown
  const availableSpecialties = useMemo(() => {
    const set = new Set<string>();
    cityFacilities.forEach(fac => {
      fac.specialties.forEach(sp => set.add(sp));
    });
    return Array.from(set).sort();
  }, [cityFacilities]);

  // Available localities in the selected city for the Locality filter dropdown
  const availableFacilityLocalities = useMemo(() => {
    const set = new Set<string>();
    cityFacilities.forEach(fac => {
      if (fac.locality) set.add(fac.locality);
    });
    return Array.from(set).sort();
  }, [cityFacilities]);

  // Compute filtered & sorted facilities with accurate Haversine distances
  const displayedFacilities = useMemo(() => {
    // 1. Enrich with distance if referenceLocation is active
    const withDistances: HealthcareFacility[] = cityFacilities.map(fac => {
      if (referenceLocation && fac.lat !== undefined && fac.lon !== undefined) {
        return {
          ...fac,
          distanceKm: calculateDistanceKm(referenceLocation.lat, referenceLocation.lon, fac.lat, fac.lon),
          distanceSourceLabel: isUrdu ? referenceLocation.labelUr : referenceLocation.label
        };
      }
      return {
        ...fac,
        distanceKm: undefined,
        distanceSourceLabel: undefined
      };
    });

    // 2. Apply all active filters (Category, Name/Keyword, Specialty, Locality, Rating, OpenNow, Distance Radius)
    const filtered = withDistances.filter(fac => {
      // Strict category separation: never classify a pharmacy as a clinic or a clinic as a hospital
      if (selectedCategory === 'Hospitals' && fac.type !== 'hospital') return false;
      if (selectedCategory === 'Clinics' && fac.type !== 'clinic') return false;
      if (selectedCategory === 'Pharmacies' && fac.type !== 'pharmacy') return false;
      if (selectedCategory === 'Emergency' && !fac.hasEmergency && !fac.is24Hours) return false;

      // Facility Name / Address / Specialty keyword search
      if (facilitySearch.trim()) {
        const q = facilitySearch.trim().toLowerCase();
        const matchesName = fac.name.toLowerCase().includes(q) || (fac.nameUr && fac.nameUr.includes(q));
        const matchesAddr = fac.address.toLowerCase().includes(q) || fac.locality.toLowerCase().includes(q);
        const matchesSpec = fac.specialties.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesAddr && !matchesSpec) return false;
      }

      // Specialty dropdown filter
      if (selectedSpecialty !== 'All') {
        if (!fac.specialties.includes(selectedSpecialty)) return false;
      }

      // Locality filter
      if (selectedLocalityFilter !== 'All') {
        if (fac.locality !== selectedLocalityFilter) return false;
      }

      // Rating filter
      if (minRating > 0) {
        if (!fac.rating || fac.rating < minRating) return false;
      }

      // Open Now filter (only when operating hours are reliable)
      if (openNowOnly) {
        const openStatus = isFacilityOpenNow(fac);
        if (openStatus !== true) return false;
      }

      // Distance radius filter (strictly enforces <= selectedRadius km)
      if (selectedRadius !== 'all') {
        if (fac.distanceKm === undefined || fac.distanceKm > selectedRadius) {
          return false;
        }
      }

      return true;
    });

    // 3. Sort results
    filtered.sort((a, b) => {
      if (sortBy === 'nearest') {
        const dA = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
        const dB = b.distanceKm ?? Number.MAX_SAFE_INTEGER;
        if (dA !== dB) return dA - dB;
      }
      if (sortBy === 'rating') {
        const rA = a.rating ?? 0;
        const rB = b.rating ?? 0;
        if (rB !== rA) return rB - rA;
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      }
      // Default 'recommended': multi-factor ranking (medical services, emergency capability, rating, review volume, verification)
      return computeFacilityQualityScore(b) - computeFacilityQualityScore(a);
    });

    return filtered;
  }, [
    cityFacilities,
    referenceLocation,
    isUrdu,
    selectedCategory,
    facilitySearch,
    selectedSpecialty,
    selectedLocalityFilter,
    minRating,
    openNowOnly,
    selectedRadius,
    sortBy
  ]);

  // Keep activeFacility synchronized with displayedFacilities
  useEffect(() => {
    if (displayedFacilities.length > 0) {
      const stillVisible = displayedFacilities.some(f => f.id === activeFacilityId);
      if (!stillVisible) {
        setActiveFacilityId(displayedFacilities[0].id);
      }
    } else {
      setActiveFacilityId(null);
    }
  }, [displayedFacilities, activeFacilityId]);

  const activeFacility = useMemo(
    () => displayedFacilities.find(f => f.id === activeFacilityId) || null,
    [displayedFacilities, activeFacilityId]
  );

  const detailModalFacility = useMemo(
    () => displayedFacilities.find(f => f.id === detailModalFacilityId) || cityFacilities.find(f => f.id === detailModalFacilityId) || null,
    [displayedFacilities, cityFacilities, detailModalFacilityId]
  );

  // Category counts for the current city
  const categoryCounts = useMemo(() => {
    return {
      All: cityFacilities.length,
      Hospitals: cityFacilities.filter(f => f.type === 'hospital').length,
      Clinics: cityFacilities.filter(f => f.type === 'clinic').length,
      Pharmacies: cityFacilities.filter(f => f.type === 'pharmacy').length,
      Emergency: cityFacilities.filter(f => f.hasEmergency || f.is24Hours).length
    };
  }, [cityFacilities]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCityInfo.lat, currentCityInfo.lon],
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }
  }, [currentCityInfo.lat, currentCityInfo.lon]);

  // Listen for custom event from Leaflet popup "View Details" button
  useEffect(() => {
    const handleOpenDetailEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveFacilityId(customEvent.detail);
        setDetailModalFacilityId(customEvent.detail);
      }
    };
    window.addEventListener('medinova-open-facility-detail', handleOpenDetailEvent);
    return () => window.removeEventListener('medinova-open-facility-detail', handleOpenDetailEvent);
  }, []);

  // Update map markers whenever displayedFacilities, activeFacilityId, referenceLocation, or activeAccentHex changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markerMapRef.current.clear();

    const createCustomIcon = (isActive: boolean, fac: HealthcareFacility) => {
      const bgColor = isActive
        ? activeAccentHex
        : fac.type === 'hospital'
          ? (fac.hasEmergency ? '#dc2626' : '#0891b2')
          : fac.type === 'clinic'
            ? '#0d9488'
            : '#7c3aed';
      const size = isActive ? 38 : 32;
      const symbol = fac.type === 'pharmacy' ? 'Rx' : fac.type === 'clinic' ? 'C' : '+';

      return L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="
            background-color: ${bgColor};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: ${isActive ? '3px' : '2px'} solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: ${fac.type === 'pharmacy' ? '12px' : '16px'};
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${symbol}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2)]
      });
    };

    displayedFacilities.forEach(fac => {
      // Do not assign arbitrary coordinates to facilities with missing location data
      if (fac.lat === undefined || fac.lon === undefined) return;

      const isCurrentActive = activeFacilityId === fac.id;
      const marker = L.marker([fac.lat, fac.lon], {
        icon: createCustomIcon(isCurrentActive, fac),
        zIndexOffset: isCurrentActive ? 1000 : 0
      });

      const categoryBadge =
        fac.type === 'hospital'
          ? 'Hospital'
          : fac.type === 'clinic'
            ? 'Clinic'
            : 'Pharmacy';

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 230px; max-width: 270px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: rgba(8,145,178,0.15); color: #0891b2;">
              ${categoryBadge}
            </span>
            ${fac.hasEmergency ? '<span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: rgba(220,38,38,0.15); color: #dc2626;">24/7 ER</span>' : ''}
          </div>
          <h4 style="margin: 0 0 4px; font-weight: 800; font-size: 14px; line-height: 1.3;">
            ${fac.name}
          </h4>
          <p style="margin: 0 0 6px; font-size: 11.5px; opacity: 0.85; line-height: 1.35;">
            ${fac.address}
          </p>
          ${fac.rating !== undefined ? `
            <div style="margin: 0 0 5px; font-size: 11.5px; font-weight: 700; color: #f59e0b;">
              ★ ${fac.rating.toFixed(1)} <span style="opacity: 0.75; font-weight: 500;">(${fac.reviewCount || 0} reviews)</span>
            </div>
          ` : ''}
          ${fac.phone ? `
            <div style="margin: 0 0 5px; font-size: 11.5px; font-weight: 600;">
              📞 <a href="tel:${fac.phone}" style="color: inherit; text-decoration: underline;">${fac.phone}</a>
            </div>
          ` : ''}
          ${fac.distanceKm !== undefined ? `
            <div style="margin: 0 0 8px; font-size: 11.5px; font-weight: 700; color: #0891b2;">
              📍 ${fac.distanceKm} km away <span style="font-weight: 500; opacity: 0.8;">(approx. straight-line)</span>
            </div>
          ` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11.5px; font-weight: 700; border-top: 1px solid rgba(148,163,184,0.3); padding-top: 7px; margin-top: 4px;">
            <button
              type="button"
              onclick="window.dispatchEvent(new CustomEvent('medinova-open-facility-detail', { detail: '${fac.id}' }))"
              style="background: #0891b2; color: #ffffff; border: none; border-radius: 6px; padding: 4px 9px; font-size: 11px; font-weight: 700; cursor: pointer;"
            >
              View Details
            </button>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lon}"
              target="_blank"
              rel="noreferrer"
              style="color: #0891b2; text-decoration: none; padding: 3px 4px;"
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setActiveFacilityId(fac.id);
      });

      marker.addTo(markersLayerRef.current!);
      markerMapRef.current.set(fac.id, marker);
    });

    // Add reference location marker + radius circle if a starting point is active
    if (referenceLocation) {
      const refMarker = L.circleMarker([referenceLocation.lat, referenceLocation.lon], {
        radius: 9,
        fillColor: '#2563eb',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.95
      });
      refMarker.bindPopup(
        `<div style="font-family: system-ui, sans-serif; font-size: 12px;">
          <strong>Starting Location:</strong><br/>${referenceLocation.label}
        </div>`
      );
      refMarker.addTo(markersLayerRef.current!);

      if (selectedRadius !== 'all') {
        const radiusCircle = L.circle([referenceLocation.lat, referenceLocation.lon], {
          radius: selectedRadius * 1000,
          color: activeAccentHex,
          weight: 1.5,
          fillColor: activeAccentHex,
          fillOpacity: 0.08,
          dashArray: '4 4'
        });
        radiusCircle.addTo(markersLayerRef.current!);
      }
    }
  }, [displayedFacilities, activeFacilityId, referenceLocation, selectedRadius, activeAccentHex]);

  // Handle selecting a radius filter: if no starting point is active yet, set explicit City Center reference
  // and inform the user clearly so distance filtering works immediately and transparently.
  const handleSelectRadius = (radius: RadiusFilter) => {
    setSelectedRadius(radius);
    if (radius !== 'all' && !referenceLocation) {
      setReferenceLocation({
        lat: currentCityInfo.lat,
        lon: currentCityInfo.lon,
        label: `${currentCityInfo.name} City Center`,
        labelUr: `${currentCityInfo.nameUr} سٹی سینٹر`,
        mode: 'city-center'
      });
    }
  };

  // City-specific verified emergency contacts
  const cityEmergencyContacts = useMemo(
    () => getEmergencyContactsForCity(selectedCity),
    [selectedCity]
  );

  // Verified 24/7 Hospital Emergency Departments in the selected city
  const cityHospitalERs = useMemo(
    () => cityFacilities.filter(f => f.type === 'hospital' && f.hasEmergency),
    [cityFacilities]
  );

  const getTypeBadge = (fac: HealthcareFacility) => {
    if (fac.type === 'hospital') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/80">
          <Building2 className="w-3 h-3" />
          <span>{isUrdu ? 'ہسپتال' : 'Hospital'}</span>
        </span>
      );
    }
    if (fac.type === 'clinic') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80">
          <Stethoscope className="w-3 h-3" />
          <span>{isUrdu ? 'کلینک' : 'Clinic'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
        <span>Rx</span>
        <span>{isUrdu ? 'فارمیسی' : 'Pharmacy'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Verified Directory + Free OpenStreetMap Confirmation */}
      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/90 dark:border-emerald-800/70 rounded-xl p-4 flex items-start gap-3 shadow-3xs animate-fade-in-up">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 animate-pulse-subtle" />
        <div className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
          <span className="font-extrabold block sm:inline">
            {isUrdu ? (
              <>اوپن اسٹریٹ میپ (<span className="font-black italic">OSM</span>) اور تصدیق شدہ ڈائریکٹری:</>
            ) : (
              <>Verified Healthcare Directory &amp; <span className="font-black italic text-emerald-800 dark:text-emerald-300">OpenStreetMap</span>:</>
            )}
          </span>{' '}
          {isUrdu
            ? <>منتخب شہر کے مستند ہسپتال، کلینک، فارمیسی اور 24/7 ایمرجنسی سینٹرز بمعہ درست (Haversine) فاصلہ اور رابطہ نمبرز۔</>
            : <>Displays city-verified hospitals, clinics, pharmacies, and 24/7 emergency departments across 8 major cities in Pakistan with Haversine straight-line distance calculation.</>}
        </div>
      </div>

      {/* Main Search Bar, City Selector & Category Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in-up animation-delay-100">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Location Search Input */}
          <div className="relative flex-1">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              id="osm-location-search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
              placeholder={
                isUrdu
                  ? 'شہر، سیکٹر یا علاقہ تلاش کریں (مثلاً اسلام آباد، ایف ایٹ مرکز، جوہر ٹاؤن لاہور)...'
                  : 'Search city, sector, or locality (e.g. Islamabad, F-8 Markaz, Johar Town Lahore, Clifton Karachi)...'
              }
              className="w-full pl-11 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Area Button */}
          <button
            type="button"
            onClick={handleLocationSearch}
            id="osm-search-btn"
            disabled={gpsLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {gpsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isUrdu ? 'تلاش کریں' : 'Search Area'}</span>
          </button>

          {/* GPS Near Me Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            id="osm-gps-btn"
            disabled={gpsLoading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition-all active:scale-95 cursor-pointer shadow-3xs ${
              referenceLocation?.mode === 'gps'
                ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-800 dark:text-cyan-200'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200/90 dark:border-slate-700'
            }`}
            title="Use current browser GPS location to calculate exact straight-line distances"
          >
            <Navigation className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{isUrdu ? 'میری لوکیشن (Near Me)' : 'Near Me'}</span>
          </button>
        </div>

        {/* Status or Geolocation Feedback Banner */}
        {(gpsError || searchStatusMsg) && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
              gpsError
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/70 text-cyan-900 dark:text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{gpsError || searchStatusMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setGpsError(null);
                setSearchStatusMsg(null);
              }}
              className="p-1 hover:opacity-75 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Popular Pakistan Cities Buttons (8 Supported Cities) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold shrink-0 text-slate-700 dark:text-slate-300">
            {isUrdu ? 'شہر منتخب کریں:' : 'Popular Cities:'}
          </span>
          {PAKISTAN_CITIES.map(city => {
            const active = selectedCity === city.name;
            return (
              <button
                key={city.name}
                type="button"
                id={`city-btn-${city.name.toLowerCase()}`}
                onClick={() => handleSelectCity(city.name)}
                className={`px-3.5 py-1.5 rounded-full shrink-0 transition-all cursor-pointer font-bold ${
                  active
                    ? 'bg-cyan-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isUrdu ? city.nameUr : city.name}
              </button>
            );
          })}
        </div>

        {/* Category Filters (Strictly Separated) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1">
              {isUrdu ? 'قسم:' : 'Category:'}
            </span>
            {(['All', 'Hospitals', 'Clinics', 'Pharmacies', 'Emergency'] as const).map(cat => {
              const active = selectedCategory === cat;
              const count = categoryCounts[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  id={`filter-cat-${cat}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-slate-900 dark:bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>
                    {cat === 'All'
                      ? isUrdu ? 'تمام' : 'All'
                      : cat === 'Hospitals'
                        ? isUrdu ? 'ہسپتال' : 'Hospitals'
                        : cat === 'Clinics'
                          ? isUrdu ? 'کلینک' : 'Clinics'
                          : cat === 'Pharmacies'
                            ? isUrdu ? 'فارمیسی' : 'Pharmacies'
                            : isUrdu ? 'ایمرجنسی 24/7' : '24/7 Emergency'}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Open Now Filter Toggle */}
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <input
              type="checkbox"
              id="filter-open-now"
              checked={openNowOnly}
              onChange={(e) => setOpenNowOnly(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isUrdu ? 'اس وقت کھلا ہے (Open Now)' : 'Open Now'}</span>
          </label>
        </div>

        {/* Distance Starting Point & Radius Filter Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Starting Point Selector (Mode A: GPS or Mode B: Verified Locality / City Center) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200">
                <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{isUrdu ? 'فاصلے کا نقطہ آغاز:' : 'Distance Starting Point:'}</span>
              </span>

              <select
                id="distance-starting-point-select"
                aria-label="Select starting location for distance calculation"
                value={
                  referenceLocation?.mode === 'gps'
                    ? 'gps'
                    : referenceLocation?.mode === 'city-center'
                      ? 'city-center'
                      : referenceLocation?.mode === 'locality'
                        ? currentCityInfo.localities.find(l => referenceLocation.label.startsWith(l.name))?.name || 'none'
                        : 'none'
                }
                onChange={(e) => {
                  if (e.target.value === 'gps') {
                    handleDetectLocation();
                  } else {
                    handleSelectReferencePoint(e.target.value);
                  }
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="none">
                  {isUrdu
                    ? '-- کوئی نقطہ آغاز منتخب نہیں (کلک کر کے علاقہ منتخب کریں) --'
                    : '-- Select a Locality / Landmark in ' + selectedCity + ' --'}
                </option>
                {referenceLocation?.mode === 'gps' && (
                  <option value="gps">📍 Your Verified GPS Location (Active)</option>
                )}
                {currentCityInfo.localities.map(loc => (
                  <option key={loc.name} value={loc.name}>
                    📍 {isUrdu ? `${loc.nameUr} (${selectedCity})` : `${loc.name}, ${selectedCity}`}
                  </option>
                ))}
                <option value="city-center">
                  🏛️ {isUrdu ? `${currentCityInfo.nameUr} سٹی سینٹر سے فاصلہ` : `Measure from ${selectedCity} City Center`}
                </option>
              </select>

              {referenceLocation && (
                <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 px-2.5 py-1 rounded-md border border-cyan-200/70 dark:border-cyan-800/70">
                  {isUrdu
                    ? `نقطہ آغاز: ${referenceLocation.labelUr} (سیدھا فاصلہ)`
                    : `Measured from: ${referenceLocation.label} (approx. straight-line)`}
                </span>
              )}
            </div>

            {/* Distance Radius Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1">
                {isUrdu ? 'دائرہ کار (Radius):' : 'Distance Filter:'}
              </span>
              {(
                [
                  { id: 'all', label: isUrdu ? 'تمام فاصلے' : 'All distances' },
                  { id: 1, label: isUrdu ? '1 کلومیٹر' : 'Within 1 km' },
                  { id: 3, label: isUrdu ? '3 کلومیٹر' : 'Within 3 km' },
                  { id: 5, label: isUrdu ? '5 کلومیٹر' : 'Within 5 km' },
                  { id: 10, label: isUrdu ? '10 کلومیٹر' : 'Within 10 km' },
                  { id: 25, label: isUrdu ? '25 کلومیٹر' : 'Within 25 km' }
                ] as { id: RadiusFilter; label: string }[]
              ).map(rad => {
                const active = selectedRadius === rad.id;
                return (
                  <button
                    key={String(rad.id)}
                    type="button"
                    id={`radius-filter-${rad.id}`}
                    onClick={() => handleSelectRadius(rad.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {rad.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters Row: Specialty, Locality Filter, Min Rating, Sort By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty-filter-select" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isUrdu ? 'شعبہ / اسپیشلٹی (Specialty)' : 'Specialty / Department'}
              </label>
              <select
                id="specialty-filter-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">{isUrdu ? 'تمام شعبہ جات' : 'All Specialties'}</option>
                {availableSpecialties.map(sp => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>

            {/* Locality Filter */}
            <div>
              <label htmlFor="locality-filter-select" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isUrdu ? 'علاقہ / سیکٹر (Locality)' : `Locality in ${selectedCity}`}
              </label>
              <select
                id="locality-filter-select"
                value={selectedLocalityFilter}
                onChange={(e) => setSelectedLocalityFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">{isUrdu ? `تمام علاقے (${selectedCity})` : `All Localities in ${selectedCity}`}</option>
                {availableFacilityLocalities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Minimum Public Rating Filter */}
            <div>
              <label htmlFor="rating-filter-select" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isUrdu ? 'کم از کم ریٹنگ (Rating)' : 'Public Rating'}
              </label>
              <select
                id="rating-filter-select"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value={0}>{isUrdu ? 'تمام ریٹنگز' : 'Any Rating'}</option>
                <option value={4.0}>4.0+ ★ &amp; above</option>
                <option value={4.3}>4.3+ ★ &amp; above</option>
                <option value={4.5}>4.5+ ★ &amp; above</option>
              </select>
            </div>

            {/* Sort By Control */}
            <div>
              <label htmlFor="sort-by-select" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isUrdu ? 'ترتیب (Sort By)' : 'Sort Facilities By'}
              </label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => {
                  const nextSort = e.target.value as SortOption;
                  setSortBy(nextSort);
                  if (nextSort === 'nearest' && !referenceLocation) {
                    setReferenceLocation({
                      lat: currentCityInfo.lat,
                      lon: currentCityInfo.lon,
                      label: `${currentCityInfo.name} City Center`,
                      labelUr: `${currentCityInfo.nameUr} سٹی سینٹر`,
                      mode: 'city-center'
                    });
                  }
                }}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="recommended">
                  {isUrdu ? 'مستند خدمات، ریٹنگ اور تصدیق' : 'Recommended (Services, Rating & Verification)'}
                </option>
                <option value="nearest">
                  {isUrdu ? 'سب سے قریب (Nearest First)' : 'Nearest First (Distance)'}
                </option>
                <option value="rating">
                  {isUrdu ? 'بہترین ریٹنگ (Highest Rated)' : 'Highest Public Rating'}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Map & Facility List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Leaflet Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-2">
            <div
              ref={mapContainerRef}
              id="leaflet-osm-map"
              className="w-full h-[420px] sm:h-[520px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                <span>24/7 Hospital ER</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                <span>Clinic</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
                <span>Pharmacy</span>
              </span>
            </div>
            <div>
              Map data &copy;{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-slate-700 dark:hover:text-slate-200"
              >
                OpenStreetMap contributors
              </a>
            </div>
          </div>

          {/* Selected Facility Detailed Preview Panel below map on desktop */}
          {activeFacility && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-cyan-500/60 dark:border-cyan-500/50 shadow-sm p-5 space-y-4 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getTypeBadge(activeFacility)}
                    {activeFacility.hasEmergency && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isUrdu ? '24/7 ایمرجنسی دستیاب' : 'Verified 24/7 Emergency'}</span>
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {isUrdu ? `تصدیق شدہ: ${activeFacility.lastVerified}` : `Verified: ${activeFacility.lastVerified}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {isUrdu && activeFacility.nameUr ? activeFacility.nameUr : activeFacility.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    📍 {isUrdu && activeFacility.addressUr ? activeFacility.addressUr : activeFacility.address} ({activeFacility.city})
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {activeFacility.rating !== undefined && (
                    <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{activeFacility.rating.toFixed(1)}</span>
                      {activeFacility.reviewCount && (
                        <span className="text-[11px] font-normal opacity-80">
                          ({activeFacility.reviewCount.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  {activeFacility.distanceKm !== undefined && (
                    <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-200/70 dark:border-cyan-800">
                      {activeFacility.distanceKm} km away (approx. straight-line)
                    </span>
                  )}
                </div>
              </div>

              {/* Grid of Verified Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase block text-[10px]">
                    {isUrdu ? 'اوقاتِ کار اور او پی ڈی' : 'Opening Hours & OPD Timings'}
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {isUrdu && activeFacility.openHoursUr ? activeFacility.openHoursUr : activeFacility.openHours}
                  </p>
                  {activeFacility.opdTimings && (
                    <p className="text-slate-600 dark:text-slate-300">
                      OPD: {isUrdu && activeFacility.opdTimingsUr ? activeFacility.opdTimingsUr : activeFacility.opdTimings}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase block text-[10px]">
                    {isUrdu ? 'رابطہ اور کوآرڈینیٹس' : 'Verified Contact & Coordinates'}
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {activeFacility.phone ? (
                      <a href={`tel:${activeFacility.phone}`} className="hover:underline text-cyan-700 dark:text-cyan-300">
                        📞 {activeFacility.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400">Phone unavailable</span>
                    )}
                  </p>
                  {activeFacility.lat !== undefined && activeFacility.lon !== undefined && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      GPS: {activeFacility.lat.toFixed(4)}° N, {activeFacility.lon.toFixed(4)}° E
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Info Banner inside Hospital Detail */}
              {activeFacility.hasEmergency && activeFacility.emergencyDetails && (
                <div className="p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-red-900 dark:text-red-200 block">
                      🚨 {isUrdu && activeFacility.emergencyDetailsUr ? activeFacility.emergencyDetailsUr : activeFacility.emergencyDetails}
                    </span>
                    <span className="text-[11px] text-red-700 dark:text-red-300">
                      For life-threatening ambulance dispatch, dial <strong>1122</strong> or <strong>115</strong> immediately.
                    </span>
                  </div>
                  {activeFacility.emergencyPhone && (
                    <a
                      href={`tel:${activeFacility.emergencyPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>ER Desk: {activeFacility.emergencyPhone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Specialties chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                  {isUrdu ? 'دستیاب طبی شعبہ جات:' : 'Available Departments & Specialties:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(isUrdu && activeFacility.specialtiesUr ? activeFacility.specialtiesUr : activeFacility.specialties).map((sp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold border border-slate-200/70 dark:border-slate-700"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Source: <strong className="text-slate-700 dark:text-slate-300">{activeFacility.dataSource}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailModalFacilityId(activeFacility.id)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {isUrdu ? 'مکمل تفصیلات دیکھیں' : 'Full Profile & Doctors'}
                  </button>
                  {activeFacility.website && (
                    <a
                      href={activeFacility.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  )}
                  {activeFacility.lat !== undefined && activeFacility.lon !== undefined && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${activeFacility.lat},${activeFacility.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 hover:bg-black text-white font-bold rounded-lg"
                    >
                      <span>{isUrdu ? 'راستہ (Directions)' : 'Directions'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Facilities Directory */}
        <div className="lg:col-span-5 space-y-3">
          {/* In-list Facility Name & Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={facilitySearch}
              id="facility-name-filter"
              onChange={(e) => setFacilitySearch(e.target.value)}
              placeholder={
                isUrdu
                  ? `${selectedCity} کے نتائج میں نام، علاقہ یا شعبہ تلاش کریں...`
                  : `Filter ${selectedCity} facilities by name, locality, or specialty...`
              }
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {facilitySearch && (
              <button
                type="button"
                onClick={() => setFacilitySearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear facility filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {isUrdu
                ? `${selectedCity} میں ${displayedFacilities.length} تصدیق شدہ مراکز`
                : `Showing ${displayedFacilities.length} verified facilities in ${selectedCity}`}
            </span>
            <span className="font-bold text-cyan-700 dark:text-cyan-400">
              {selectedCategory === 'All' ? `${selectedCity} Directory` : `${selectedCity} • ${selectedCategory}`}
            </span>
          </div>

          {/* List Scroll Container */}
          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {displayedFacilities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <Building2 className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedRadius !== 'all'
                      ? isUrdu
                        ? `${selectedRadius} کلومیٹر کے دائرے میں کوئی مرکز نہیں ملا`
                        : `No verified ${selectedCity} facilities within ${selectedRadius} km`
                      : isUrdu
                        ? 'اس فلٹر کے مطابق کوئی ہسپتال یا کلینک نہیں ملا'
                        : `No facilities in ${selectedCity} matched your active filters`}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    {selectedRadius !== 'all'
                      ? isUrdu
                        ? 'فاصلے کا دائرہ کار بڑھائیں یا تمام فاصلے منتخب کریں۔'
                        : `Measured from ${referenceLocation?.label || selectedCity}. Expand the distance radius to see more verified facilities in ${selectedCity}.`
                      : isUrdu
                        ? 'فلٹرز کو ری سیٹ کر کے دوبارہ تلاش کریں۔'
                        : 'Try clearing the specialty, rating, or distance filter.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {selectedRadius !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedRadius('all')}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {isUrdu ? 'تمام فاصلے دکھائیں' : 'Show All Distances'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSpecialty('All');
                      setSelectedLocalityFilter('All');
                      setSelectedRadius('all');
                      setMinRating(0);
                      setOpenNowOnly(false);
                      setFacilitySearch('');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {isUrdu ? 'فلٹرز ری سیٹ کریں' : 'Reset All Filters'}
                  </button>
                </div>
              </div>
            ) : (
              displayedFacilities.map((fac) => {
                const isSelected = activeFacilityId === fac.id;
                const openNow = isFacilityOpenNow(fac);

                return (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setActiveFacilityId(fac.id);
                      if (mapInstanceRef.current && fac.lat !== undefined && fac.lon !== undefined) {
                        mapInstanceRef.current.setView([fac.lat, fac.lon], 15);
                        const m = markerMapRef.current.get(fac.id);
                        if (m) m.openPopup();
                      }
                    }}
                    id={`facility-card-${fac.id}`}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 shadow-sm ring-1 ring-cyan-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Top Row: Badges + Distance */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getTypeBadge(fac)}
                        {fac.hasEmergency && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            <span>24/7 ER</span>
                          </span>
                        )}
                        {openNow === true && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/70">
                            {isUrdu ? 'کھلا ہے' : 'Open Now'}
                          </span>
                        )}
                      </div>

                      {fac.distanceKm !== undefined ? (
                        <span
                          className="shrink-0 text-xs font-extrabold text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-950/90 px-2.5 py-0.5 rounded-md border border-cyan-200/60 dark:border-cyan-800"
                          title={`Approximate straight-line distance from ${fac.distanceSourceLabel}`}
                        >
                          {fac.distanceKm} km away
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                          {fac.locality}
                        </span>
                      )}
                    </div>

                    {/* Title & Verified Address */}
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {isUrdu && fac.nameUr ? fac.nameUr : fac.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {isUrdu && fac.addressUr ? fac.addressUr : fac.address}
                      </p>
                      {fac.distanceKm !== undefined && fac.distanceSourceLabel && (
                        <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5">
                          ↔ {fac.distanceKm} km straight-line from {fac.distanceSourceLabel}
                        </p>
                      )}
                    </div>

                    {/* Rating, Hours & Specialties Preview */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {fac.rating !== undefined && (
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{fac.rating.toFixed(1)}</span>
                          {fac.reviewCount && (
                            <span className="text-slate-400 dark:text-slate-500 font-normal">
                              ({fac.reviewCount.toLocaleString()})
                            </span>
                          )}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{fac.openHours}</span>
                      </span>
                    </div>

                    {/* Top 3 Specialties */}
                    {fac.specialties && fac.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {fac.specialties.slice(0, 4).map((sp, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {sp}
                          </span>
                        ))}
                        {fac.specialties.length > 4 && (
                          <span className="text-[11px] font-semibold px-1.5 py-0.5 text-cyan-600 dark:text-cyan-400">
                            +{fac.specialties.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      {fac.phone ? (
                        <a
                          href={`tel:${fac.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{fac.phone}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Phone unavailable</span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailModalFacilityId(fac.id);
                        }}
                        className="inline-flex items-center gap-1 font-bold text-cyan-700 dark:text-cyan-300 hover:underline px-2 py-1 cursor-pointer"
                      >
                        <span>{isUrdu ? 'تفصیلات' : 'View Details'}</span>
                      </button>

                      {fac.lat !== undefined && fac.lon !== undefined && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lon}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 ml-auto font-bold"
                        >
                          <span>{isUrdu ? 'راستہ' : 'Directions'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* City-Specific Verified Emergency Services & 24/7 Hospital ERs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>
                {isUrdu
                  ? `${currentCityInfo.nameUr} کے تصدیق شدہ ہنگامی رابطہ نمبرز`
                  : `Verified Emergency & Ambulance Services for ${selectedCity}`}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isUrdu
                ? 'جان لیوا ہنگامی صورتحال میں عام ہسپتال استقبالیہ کے بجائے براہِ راست ریسکیو ایمبولینس (1122 / 115) پر کال کریں۔'
                : 'For immediately life-threatening situations, call official emergency ambulance dispatch directly rather than general hospital reception.'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 self-start sm:self-center">
            {selectedCity} Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cityEmergencyContacts.map(service => (
            <div
              key={service.id}
              className={`p-4 rounded-xl border ${service.borderColor} ${service.bgColor} flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 inline-block">
                  {isUrdu ? service.categoryLabelUr : service.categoryLabel}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {isUrdu ? service.nameUr : service.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isUrdu ? service.descriptionUr : service.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                <span className={`text-2xl font-black italic ${service.textColor}`}>
                  {service.number}
                </span>
                <a
                  href={`tel:${service.number}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'کال کریں' : `Dial ${service.number}`}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Hospital Emergency Desks in Selected City */}
        {cityHospitalERs.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isUrdu
                ? `${currentCityInfo.nameUr} کے 24/7 ہسپتال ایمرجنسی ڈیسک:`
                : `24/7 Hospital Emergency Desks in ${selectedCity}:`}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {cityHospitalERs.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {isUrdu && hosp.nameUr ? hosp.nameUr : hosp.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {hosp.locality} • 24/7 ER
                    </p>
                  </div>
                  {hosp.emergencyPhone ? (
                    <a
                      href={`tel:${hosp.emergencyPhone}`}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>ER Call</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 shrink-0">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Facility Detail Modal */}
      {detailModalFacility && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="facility-modal-title"
          onClick={() => setDetailModalFacilityId(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-8 animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {getTypeBadge(detailModalFacility)}
                  {detailModalFacility.hasEmergency && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 px-2.5 py-0.5 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Verified 24/7 Emergency Department</span>
                    </span>
                  )}
                </div>
                <h2 id="facility-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {isUrdu && detailModalFacility.nameUr ? detailModalFacility.nameUr : detailModalFacility.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  📍 {detailModalFacility.address} — <strong>{detailModalFacility.locality}, {detailModalFacility.city}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalFacilityId(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Verified Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Public Rating &amp; Source
                </span>
                {detailModalFacility.rating ? (
                  <>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>{detailModalFacility.rating.toFixed(1)} / 5.0</span>
                      <span className="text-xs font-normal text-slate-500">
                        ({detailModalFacility.reviewCount?.toLocaleString()} reviews)
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Source: {detailModalFacility.ratingSource || 'Public Directory'}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">Rating not publicly listed</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Opening Hours &amp; OPD
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{detailModalFacility.openHours}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {detailModalFacility.opdTimings ? `OPD: ${detailModalFacility.opdTimings}` : 'Standard Walk-in Hours'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Coordinates &amp; Distance
                </span>
                {detailModalFacility.lat !== undefined && detailModalFacility.lon !== undefined ? (
                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {detailModalFacility.lat.toFixed(4)}°N, {detailModalFacility.lon.toFixed(4)}°E
                  </p>
                ) : (
                  <p className="text-slate-400">Coordinates unverified</p>
                )}
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-bold">
                  {detailModalFacility.distanceKm !== undefined
                    ? `${detailModalFacility.distanceKm} km straight-line from ${detailModalFacility.distanceSourceLabel}`
                    : 'Select a starting point to measure distance'}
                </p>
              </div>
            </div>

            {/* Departments & Specialties */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Available Departments &amp; Specialties
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {detailModalFacility.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border border-cyan-200/80 dark:border-cyan-800/80 text-xs font-semibold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Associated Doctors (When Reliable Data Is Available) */}
            {detailModalFacility.doctors && detailModalFacility.doctors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Associated Specialists &amp; Consultants</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {detailModalFacility.doctors.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-0.5"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">{doc.name}</p>
                      <p className="text-cyan-700 dark:text-cyan-400 font-semibold">{doc.specialty}</p>
                      {doc.qualification && <p className="text-[11px] text-slate-500">{doc.qualification}</p>}
                      {doc.schedule && <p className="text-[11px] text-slate-500">🕒 {doc.schedule}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact, Official Website, Directions & Verification Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <p>Data Source: <strong>{detailModalFacility.dataSource}</strong></p>
                <p>Last Verification Date: <strong>{detailModalFacility.lastVerified}</strong></p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {detailModalFacility.phone && (
                  <a
                    href={`tel:${detailModalFacility.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {detailModalFacility.phone}</span>
                  </a>
                )}
                {detailModalFacility.website && (
                  <a
                    href={detailModalFacility.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Website</span>
                  </a>
                )}
                {detailModalFacility.lat !== undefined && detailModalFacility.lon !== undefined && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${detailModalFacility.lat},${detailModalFacility.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-black text-white font-bold rounded-xl"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
