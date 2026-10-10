import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Phone, ExternalLink, RefreshCw, Building2, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';
import L from 'leaflet';
import { HealthcareFacility, Language } from '../types';
import { fetchNearbyHealthcare, searchLocationNominatim } from '../utils/osmService';
import { PAKISTAN_CITIES } from '../data/hospitalsData';

interface HealthcareFinderProps {
  language: Language;
}

export const HealthcareFinder: React.FC<HealthcareFinderProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  // 1. Search Inputs & State
  const [searchQuery, setSearchQuery] = useState('');
  const [facilitySearch, setFacilitySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hospitals' | 'Clinics' | 'Pharmacies' | 'Emergency'>('All');
  const [currentCityName, setCurrentCityName] = useState('Islamabad');
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lon: number }>({ lat: 33.6844, lon: 73.0479 });
  
  // Facilities & UI state
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFacility, setActiveFacility] = useState<HealthcareFacility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Map DOM & Leaflet instance refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Load facilities whenever centerCoords or selectedCategory changes
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const results = await fetchNearbyHealthcare(centerCoords.lat, centerCoords.lon, 12000, selectedCategory);
        if (!isCancelled) {
          setFacilities(results);
          if (results.length > 0 && !activeFacility) {
            setActiveFacility(results[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching healthcare places:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [centerCoords, selectedCategory]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lon],
        zoom: 13,
        zoomControl: true
      });

      // Public OpenStreetMap tile layer (100% free, no API key, no OpenAI dependency)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lon], 13);
    }
  }, [centerCoords]);

  // Update map markers whenever facilities or activeFacility changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Custom Teal Circle Icon matching screenshot finder-map.png
    const createCustomIcon = (isActive: boolean, type: string) => {
      const bgColor = isActive ? '#0284c7' : type === 'emergency' ? '#dc2626' : '#0d9488';
      return L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="
            background-color: ${bgColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
          ">
            +
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    facilities.forEach(fac => {
      if (!fac.lat || !fac.lon) return;

      const isCurrentActive = activeFacility?.id === fac.id;
      const marker = L.marker([fac.lat, fac.lon], {
        icon: createCustomIcon(isCurrentActive, fac.type)
      });

      // Custom popup HTML matching screenshot finder-popup.png
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
          <h4 style="margin: 0 0 6px; font-weight: 700; font-size: 14px; color: #0f172a; line-height: 1.3;">
            ${fac.name}
          </h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
            ${fac.address}
          </p>
          ${fac.distanceKm !== undefined ? `
            <div style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #0284c7;">
              ${fac.distanceKm} km
            </div>
          ` : ''}
          <div style="display: flex; gap: 12px; font-size: 12px; font-weight: 600; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <a href="https://www.openstreetmap.org/?mlat=${fac.lat}&mlon=${fac.lon}#map=16/${fac.lat}/${fac.lon}" target="_blank" rel="noreferrer" style="color: #0284c7; text-decoration: none;">
              OpenStreetMap ↗
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lon}" target="_blank" rel="noreferrer" style="color: #0284c7; text-decoration: none;">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setActiveFacility(fac);
      });

      marker.addTo(markersLayerRef.current!);
    });

    // Add user location marker if detected
    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lon], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      });
      userMarker.bindPopup('<b>Your Current Location</b>');
      userMarker.addTo(markersLayerRef.current!);
    }
  }, [facilities, activeFacility, userLocation]);

  // Handle Location Search (Nominatim / Overpass)
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchLocationNominatim(searchQuery);
      if (results.length > 0) {
        const first = results[0];
        setCenterCoords({ lat: first.lat, lon: first.lon });
        setCurrentCityName(first.displayName.split(',')[0]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([first.lat, first.lon], 13);
        }
      }
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Detect GPS Location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setCenterCoords({ lat: latitude, lon: longitude });
        setCurrentCityName('Your Location');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err);
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filter facilities locally by name / address if user types in the secondary filter
  const displayedFacilities = facilities.filter(fac => {
    if (!facilitySearch.trim()) return true;
    const query = facilitySearch.toLowerCase();
    return (
      fac.name.toLowerCase().includes(query) ||
      fac.address.toLowerCase().includes(query) ||
      (fac.nameUr && fac.nameUr.includes(query))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice: Free OpenStreetMap Confirmation */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-4 flex items-start gap-3 shadow-3xs animate-fade-in-up">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-pulse-subtle" />
        <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
          <span className="font-extrabold block sm:inline">
            {isUrdu ? (
              <>اوپن اسٹریٹ میپ (<span className="font-black italic">OSM</span>) پر فعال:</>
            ) : (
              <>Powered by <span className="font-black italic text-emerald-800">OpenStreetMap</span>:</>
            )}
          </span>{' '}
          {isUrdu
            ? <>ہیلتھ کیئر فائنڈر مفت اوپن اسٹریٹ میپ سروسز (<span className="font-bold italic">Overpass API</span> + <span className="font-bold italic">Nominatim</span>) پر چلتا ہے۔ یہ اوپن اے آئی پر بالکل منحصر نہیں ہے اور ہمیشہ دستیاب ہے۔</>
            : <>Healthcare Finder runs entirely on free <span className="font-bold italic">OpenStreetMap</span> services (<span className="font-bold italic">Leaflet</span> + <span className="font-bold italic">Nominatim</span> + <span className="font-bold italic">Overpass API</span>). It does NOT depend on <span className="font-bold italic">OpenAI</span> and remains 100% operational.</>}
        </div>
      </div>

      {/* Main Search Bar & City Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 animate-fade-in-up animation-delay-100">
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
              placeholder={isUrdu ? 'شہر یا علاقہ تلاش کریں (مثلاً اسلام آباد، راولپنڈی، لاہور)...' : 'Search city or area in Pakistan (e.g. Islamabad, Lahore)...'}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleLocationSearch}
            id="osm-search-btn"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isUrdu ? 'تلاش کریں' : 'Search Area'}</span>
          </button>

          {/* GPS Auto Detect */}
          <button
            onClick={handleDetectLocation}
            id="osm-gps-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-bold rounded-xl border border-slate-200/90 transition-all active:scale-95 cursor-pointer shadow-3xs"
            title="Use current GPS location"
          >
            <Navigation className="w-4 h-4 text-cyan-600" />
            <span>{isUrdu ? 'میری لوکیشن' : 'Near Me'}</span>
          </button>
        </div>

        {/* Quick Pakistan City Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500">
          <span className="font-semibold shrink-0">{isUrdu ? 'شہر منتخب کریں:' : 'Popular Cities:'}</span>
          {PAKISTAN_CITIES.map(city => (
            <button
              key={city.name}
              onClick={() => {
                setCenterCoords({ lat: city.lat, lon: city.lon });
                setCurrentCityName(city.name);
                setSearchQuery(city.name);
              }}
              className={`px-3 py-1 rounded-full shrink-0 transition-colors ${
                currentCityName === city.name
                  ? 'bg-cyan-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">{isUrdu ? 'قسم:' : 'Type:'}</span>
          {(['All', 'Hospitals', 'Clinics', 'Pharmacies', 'Emergency'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`filter-cat-${cat}`}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? (isUrdu ? 'تمام' : 'All') :
               cat === 'Hospitals' ? (isUrdu ? 'ہسپتال' : 'Hospitals') :
               cat === 'Clinics' ? (isUrdu ? 'کلینک' : 'Clinics') :
               cat === 'Pharmacies' ? (isUrdu ? 'فارمیسی' : 'Pharmacies') :
               (isUrdu ? 'ایمرجنسی 24/7' : '24/7 Emergency')}
            </button>
          ))}
        </div>
      </div>

      {/* Map & Facility List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Map matching screenshot finder-map.png */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2">
            <div 
              ref={mapContainerRef} 
              id="leaflet-osm-map"
              className="w-full h-[400px] sm:h-[460px] rounded-xl overflow-hidden bg-slate-100"
            />
          </div>
          <div className="text-center text-xs text-slate-500">
            Map data &copy; <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer" className="underline hover:text-slate-700">OpenStreetMap contributors</a> — free and live.
          </div>
        </div>

        {/* Right Column: Facilities Directory */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* In-list filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={facilitySearch}
              id="facility-name-filter"
              onChange={(e) => setFacilitySearch(e.target.value)}
              placeholder={isUrdu ? 'نتائج میں نام سے تلاش کریں...' : 'Filter facilities by name...'}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {isUrdu ? `${displayedFacilities.length} مراکز دستیاب ہیں` : `Found ${displayedFacilities.length} healthcare facilities`}
            </span>
            <span className="font-medium text-slate-700">{currentCityName}</span>
          </div>

          {/* List Scroll Container */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {displayedFacilities.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isUrdu ? 'کوئی ہسپتال یا کلینک نہیں ملا' : 'No facilities matched'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isUrdu ? 'سرچ تبدیل کریں یا کیٹیگری تبدیل کریں۔' : 'Try searching another city or adjusting filters.'}
                </p>
              </div>
            ) : (
              displayedFacilities.map((fac, idx) => {
                const isSelected = activeFacility?.id === fac.id;
                return (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setActiveFacility(fac);
                      if (mapInstanceRef.current && fac.lat && fac.lon) {
                        mapInstanceRef.current.setView([fac.lat, fac.lon], 15);
                      }
                    }}
                    id={`facility-card-${fac.id}`}
                    className={`reveal-on-scroll stagger-${(idx % 4) + 1} p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-500' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                          {isUrdu && fac.nameUr ? fac.nameUr : fac.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {isUrdu && fac.addressUr ? fac.addressUr : fac.address}
                        </p>
                      </div>
                      {fac.distanceKm !== undefined && (
                        <span className="shrink-0 text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                          {fac.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                      {fac.hasEmergency && (
                        <span className="inline-flex items-center gap-1 font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>24/7 Emergency</span>
                        </span>
                      )}
                      {fac.phone && (
                        <a
                          href={`tel:${fac.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{fac.phone}</span>
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lon}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 ml-auto font-medium"
                      >
                        <span>{isUrdu ? 'راستہ' : 'Directions'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
