import { useState, useEffect } from 'react';
import { 
  Compass, 
  Wind, 
  Cloud, 
  CloudSun,
  Bird, 
  Leaf, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Thermometer, 
  Droplets, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Mangsa, Observation, AiAnalysisResult } from './types';
import { MANGSAS_DATA, INITIAL_OBSERVATIONS } from './data';
import HeaderSection from './components/HeaderSection';
import AddObservationModal from './components/AddObservationModal';
import AiAnalysisView from './components/AiAnalysisView';
import { getMangsaForDate, getStartDateForMangsa, formatDateToYYYYMMDD } from './utils/dateUtils';
import splashBg from './assets/images/splash_background_1783082851478.jpg';
import gununganCrest from './assets/images/gold_gunungan_crest_1783082871234.jpg';

interface RealtimeWeather {
  temp: string;
  wind: string;
  humidity: string;
  rainfall: string;
  skyCondition: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  pressure?: string;
  hourlyForecast24h?: Array<{
    time: string;
    temp: string;
    humidity: string;
    precipitation: string;
    condition: string;
  }>;
}

export default function App() {
  // 1. Core States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeMangsa, setActiveMangsa] = useState<Mangsa>(getMangsaForDate(new Date()));
  const [observations, setObservations] = useState<Observation[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeen = sessionStorage.getItem('pranoto_mongso_seen_splash');
    return hasSeen !== 'true';
  });
  
  // Realtime Weather State
  const [realtimeWeather, setRealtimeWeather] = useState<RealtimeWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 2. Load Local Storage
  useEffect(() => {
    const savedObs = localStorage.getItem('pranoto_mongso_observations');
    if (savedObs) {
      try {
        setObservations(JSON.parse(savedObs));
      } catch (err) {
        setObservations(INITIAL_OBSERVATIONS);
      }
    } else {
      setObservations(INITIAL_OBSERVATIONS);
      localStorage.setItem('pranoto_mongso_observations', JSON.stringify(INITIAL_OBSERVATIONS));
    }

    const savedAnalysis = localStorage.getItem(`pranoto_mongso_analysis_${activeMangsa.id}`);
    if (savedAnalysis) {
      try {
        setAiAnalysis(JSON.parse(savedAnalysis));
      } catch (err) {
        setAiAnalysis(null);
      }
    }
  }, []);

  // Realtime weather effect using Geolocation & Open-Meteo
  useEffect(() => {
    if (!navigator.geolocation) return;

    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code&forecast_days=2`;
          const weatherRes = await fetch(weatherUrl);
          if (!weatherRes.ok) throw new Error();
          const weatherData = await weatherRes.json();
          const cur = weatherData.current;

          const getWindDirectionIndonesian = (deg: number): string => {
            if (deg >= 337.5 || deg < 22.5) return "Utara";
            if (deg >= 22.5 && deg < 67.5) return "Timur Laut";
            if (deg >= 67.5 && deg < 112.5) return "Timur";
            if (deg >= 112.5 && deg < 157.5) return "Tenggara";
            if (deg >= 157.5 && deg < 202.5) return "Selatan";
            if (deg >= 202.5 && deg < 247.5) return "Barat Daya";
            if (deg >= 247.5 && deg < 292.5) return "Barat";
            if (deg >= 292.5 && deg < 337.5) return "Barat Laut";
            return "Timur";
          };

          const getSkyConditionIndonesian = (code: number): string => {
            switch (code) {
              case 0: return "Cerah Benderang";
              case 1: case 2: case 3: return "Cerah Berawan";
              case 45: case 48: return "Berkabut";
              case 51: case 53: case 55: return "Gerimis Tipis";
              case 61: case 63: case 65: return "Hujan";
              case 80: case 81: case 82: return "Hujan Deras";
              case 95: case 96: case 99: return "Hujan Badai & Guntur";
              default: return "Berawan";
            }
          };

          let locationName = `Kab. Sleman (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
              headers: {
                'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
              }
            });
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const city = geoData.address?.city || geoData.address?.town || geoData.address?.municipality || geoData.address?.county || geoData.address?.state;
              if (city) {
                locationName = `${city} (${latitude.toFixed(1)}°, ${longitude.toFixed(1)}°)`;
              }
            }
          } catch (e) {
            // ignore nominatim failure, fallback works fine
          }

          // Parse hourly forecast for next 24 hours
          const hourly = weatherData.hourly;
          const hourlyForecast24h = [];
          if (hourly && hourly.time) {
            for (let i = 0; i < 24; i++) {
              if (hourly.time[i]) {
                const hourStr = new Date(hourly.time[i]).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
                hourlyForecast24h.push({
                  time: hourStr,
                  temp: `${Math.round(hourly.temperature_2m[i])}°C`,
                  humidity: `${hourly.relative_humidity_2m[i]}%`,
                  precipitation: `${hourly.precipitation[i]} mm`,
                  condition: getSkyConditionIndonesian(hourly.weather_code[i])
                });
              }
            }
          }

          const pressureStr = cur.pressure_msl ? `${Math.round(cur.pressure_msl)} hPa` : "Tidak tersedia";

          setRealtimeWeather({
            temp: `${Math.round(cur.temperature_2m)}°C`,
            wind: `${Math.round(cur.wind_speed_10m)} km/j ${getWindDirectionIndonesian(cur.wind_direction_10m)}`,
            humidity: `${cur.relative_humidity_2m}%`,
            rainfall: `${cur.rain} mm`,
            skyCondition: getSkyConditionIndonesian(cur.weather_code),
            locationName,
            latitude,
            longitude,
            pressure: pressureStr,
            hourlyForecast24h
          });
        } catch (err) {
          console.error("Gagal memperbarui cuaca realtime", err);
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        console.warn("Akses lokasi tidak diizinkan", error);
        setWeatherLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Update localStorage when observations change
  const saveObservationsToStorage = (newObs: Observation[]) => {
    setObservations(newObs);
    localStorage.setItem('pranoto_mongso_observations', JSON.stringify(newObs));
  };

  // 3. Scroll tracking for collapsing header
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 4. Save and load AI analysis per active mangsa
  useEffect(() => {
    const savedAnalysis = localStorage.getItem(`pranoto_mongso_analysis_${activeMangsa.id}`);
    if (savedAnalysis) {
      try {
        setAiAnalysis(JSON.parse(savedAnalysis));
      } catch (err) {
        setAiAnalysis(null);
      }
    } else {
      setAiAnalysis(null);
    }
    setAiError(null);
  }, [activeMangsa]);

  // 5. Actions
  const handleSaveObservation = (newObsData: Omit<Observation, 'id'>) => {
    const newObs: Observation = {
      ...newObsData,
      id: `obs_${Date.now()}`
    };
    const updated = [newObs, ...observations];
    saveObservationsToStorage(updated);
  };

  const handleDeleteObservation = (id: string) => {
    const updated = observations.filter(o => o.id !== id);
    saveObservationsToStorage(updated);
  };

  const handleResetObservations = () => {
    if (window.confirm("Apakah Anda ingin menyetel ulang data observasi ke data contoh bawaan?")) {
      saveObservationsToStorage(INITIAL_OBSERVATIONS);
      localStorage.removeItem(`pranoto_mongso_analysis_${activeMangsa.id}`);
      setAiAnalysis(null);
    }
  };

  // AI analysis fetch handler
  const handleTriggerAiAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const sanitizedMangsas = MANGSAS_DATA.map(({ imageUrl, ...m }) => m);
      const formattedDate = selectedDate.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const response = await fetch('/api/analyze-observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          observations,
          latestObservation: observations[0] || null,
          observationsHistory: observations.slice(1),
          currentMangsa: activeMangsa,
          allMangsas: sanitizedMangsas,
          selectedDate: formattedDate,
          location: {
            name: realtimeWeather?.locationName || "Tidak terdeteksi (Fallback Sleman, Yogyakarta)",
            coords: realtimeWeather?.latitude && realtimeWeather?.longitude ? {
              latitude: realtimeWeather.latitude,
              longitude: realtimeWeather.longitude
            } : null
          },
          realtimeWeather: realtimeWeather ? {
            temp: realtimeWeather.temp,
            humidity: realtimeWeather.humidity,
            rainfall: realtimeWeather.rainfall,
            wind: realtimeWeather.wind,
            pressure: realtimeWeather.pressure || "Tidak tersedia",
            skyCondition: realtimeWeather.skyCondition,
            hourlyForecast24h: realtimeWeather.hourlyForecast24h || []
          } : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan saat menganalisis.');
      }

      const result: AiAnalysisResult = await response.json();
      setAiAnalysis(result);
      localStorage.setItem(`pranoto_mongso_analysis_${activeMangsa.id}`, JSON.stringify(result));
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Gagal menghubungi asisten AI Pranata Mangsa.');
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to filter observations for the rapid visual tiles
  const getLatestObservationForCategory = (cat: 'cuaca' | 'hewan' | 'tanaman' | 'air') => {
    return observations.find(o => o.category === cat);
  };

  const getCategoryDisplayLabel = (cat: string) => {
    switch (cat) {
      case 'cuaca': return 'Langit & Cuaca';
      case 'hewan': return 'Satwa';
      case 'tanaman': return 'Flora';
      case 'air': return 'Air & Hidrologi';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'cuaca': return 'sky';
      case 'hewan': return 'amber';
      case 'tanaman': return 'emerald';
      case 'air': return 'cyan';
      default: return 'slate';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'cuaca': return <CloudSun className="w-5 h-5" />;
      case 'hewan': return <Bird className="w-5 h-5" />;
      case 'tanaman': return <Leaf className="w-5 h-5" />;
      case 'air': return <Droplets className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text font-sans selection:bg-editorial-accent/30 selection:text-editorial-text">
      {/* Dynamic Immersive Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 overflow-hidden bg-[#12100e]"
          >
            {/* Background Image with Vignette and Overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={splashBg}
                alt="Pranoto Mongso Landscape"
                className="w-full h-full object-cover brightness-[0.8] scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#12100e]/40 to-black/90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#12100e_90%)]" />
            </div>

            {/* Top Header Text */}
            <div className="w-full text-center pt-8 z-10 opacity-60">
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#EAD8C0] uppercase font-bold">
                KAWURUH PRANATA MANGSA
              </span>
            </div>

            {/* Central content card */}
            <div className="flex flex-col items-center text-center max-w-xl px-4 z-10 my-auto">
              {/* Golden Gunungan Crest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
                className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border border-[#EAD8C0]/35 shadow-[0_0_60px_rgba(234,216,192,0.2)] flex items-center justify-center p-1 bg-black/40 backdrop-blur-md"
              >
                <img
                  src={gununganCrest}
                  alt="Golden Gunungan Crest"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-8 space-y-4"
              >
                <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#EAD8C0] tracking-[0.25em] leading-none uppercase">
                  Pranoto Mongso
                </h1>
                
                {/* Custom Elegant Divider */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#EAD8C0]/40" />
                  <span className="text-[#EAD8C0]/60 text-xs">❖</span>
                  <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#EAD8C0]/40" />
                </div>

                <p className="font-serif text-sm md:text-lg text-[#D4C5B3]/95 italic leading-relaxed max-w-md mx-auto">
                  Membaca Ritme Alam, Menjaga Harmoni Kehidupan
                </p>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8"
              >
                <button
                  id="dismiss-splash-btn"
                  onClick={() => {
                    setShowSplash(false);
                    sessionStorage.setItem('pranoto_mongso_seen_splash', 'true');
                  }}
                  className="px-8 py-3.5 bg-[#EAD8C0] hover:bg-[#F5E8D6] text-black rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(234,216,192,0.25)] hover:shadow-[0_4px_30px_rgba(234,216,192,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 group"
                >
                  Mulai Jelajah
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Bottom Footer */}
            <div className="w-full text-center pb-4 z-10">
              <p className="text-[9px] md:text-[10px] text-[#A49685]/80 tracking-[0.2em] uppercase font-bold">
                Pranata Mangsa • Warisan Kearifan Nusantara
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Scrolling collapsing header */}
      <HeaderSection activeMangsa={activeMangsa} scrollY={scrollY} onInfoClick={() => setIsInfoOpen(true)} />

      {/* 2. Main Content Stage */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* Mangsa Saat Ini Card */}
        <section id="current-mangsa-section" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text">
                Pranata Mangsa Aktif
              </h2>
              <p className="text-xs text-editorial-accent font-serif italic mt-0.5">Sistem pranata mangsa Jawa diselaraskan dengan penanggalan masehi</p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-[10px] font-mono font-bold text-editorial-accent tracking-wider uppercase hidden sm:inline">PILIH TANGGAL:</span>
              <div className="flex items-center gap-2 bg-white border border-editorial-border rounded-xl px-3 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-editorial-accent" />
                <input 
                  type="date"
                  value={formatDateToYYYYMMDD(selectedDate)}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : new Date();
                    setSelectedDate(newDate);
                    const newMangsa = getMangsaForDate(newDate);
                    setActiveMangsa(newMangsa);
                  }}
                  className="bg-transparent text-xs text-editorial-text font-mono font-bold outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left side: Circular Cycle Dial */}
            <div className="md:col-span-7 rounded-2xl border border-editorial-border bg-editorial-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
              {/* Highlight accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-editorial-accent" />

              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-editorial-accent tracking-widest uppercase">
                      MANGSA KE-{activeMangsa.id}
                    </span>
                    <h3 className="font-serif text-3xl font-bold mt-1 text-editorial-text flex items-center gap-2">
                      {activeMangsa.name}
                      <span className="text-lg font-normal text-editorial-accent font-sans">({activeMangsa.javaneseName})</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-white border border-editorial-border text-[10px] font-mono font-bold text-editorial-text tracking-wide uppercase">
                      Durasi: {activeMangsa.duration} Hari
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF9F6] border border-editorial-border space-y-1.5 shadow-sm">
                  <span className="text-[9px] font-mono tracking-widest text-editorial-accent font-bold uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-editorial-accent" />
                    CANDRA (LAMBANG PUITIS)
                  </span>
                  <p className="font-serif text-lg font-bold italic text-editorial-text leading-tight">
                    &ldquo;{activeMangsa.candra}&rdquo;
                  </p>
                  <p className="text-xs text-editorial-accent leading-relaxed font-light font-serif">
                    {activeMangsa.candraMeaning}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.2em] font-bold text-editorial-accent uppercase">SASMITA (PANDUAN ALAM)</span>
                  <p className="text-sm text-editorial-text leading-relaxed font-sans font-light">
                    {activeMangsa.sasmita}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-editorial-border/60 mt-5 flex items-center justify-between text-[11px] font-mono text-editorial-accent">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-editorial-accent" />
                  <span>Periode Tradisional: <strong className="text-editorial-text font-serif italic">{activeMangsa.dates}</strong></span>
                </div>
                <span className="text-white bg-editorial-text px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase">AKTIF</span>
              </div>
            </div>

            {/* Right side: Climate Parameters (Ringkasan Hari Ini) */}
            <div className="md:col-span-5 rounded-2xl border border-editorial-border bg-editorial-card p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-editorial-text/80 tracking-widest uppercase">
                    RINGKASAN IRAMA CUACA
                  </span>
                  {realtimeWeather ? (
                    <span className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      REALTIME LOKASI
                    </span>
                  ) : weatherLoading ? (
                    <span className="text-[9px] text-editorial-accent font-mono animate-pulse">
                      MENDAPATKAN LOKASI...
                    </span>
                  ) : (
                    <span className="text-[9px] text-editorial-accent font-mono">ESTIMASI MUSIM</span>
                  )}
                </div>

                {/* Grid items */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Temp */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>Cuaca</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">
                        {realtimeWeather ? realtimeWeather.temp : activeMangsa.weather.temp}
                      </p>
                      <p className="text-[10px] text-editorial-accent font-serif italic line-clamp-1">
                        {realtimeWeather ? realtimeWeather.skyCondition : activeMangsa.weather.skyCondition}
                      </p>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Wind className="w-3.5 h-3.5" />
                      <span>Angin</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-serif text-editorial-text leading-tight mt-0.5">
                        {realtimeWeather ? realtimeWeather.wind : activeMangsa.weather.wind}
                      </p>
                      <p className="text-[9px] text-editorial-accent">Arah Hembusan</p>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Kelembapan</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">
                        {realtimeWeather ? realtimeWeather.humidity : activeMangsa.weather.humidity}
                      </p>
                      <p className="text-[10px] text-editorial-accent">Kadar Lembap</p>
                    </div>
                  </div>

                  {/* Rainfall */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Hujan</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">
                        {realtimeWeather ? realtimeWeather.rainfall : activeMangsa.weather.rainfall}
                      </p>
                      <p className="text-[10px] text-editorial-accent">
                        {realtimeWeather 
                          ? (parseFloat(realtimeWeather.rainfall) > 0 ? 'Sedang Basah' : 'Tanpa Curahan')
                          : (parseInt(activeMangsa.weather.rainfall) > 50 ? 'Curah Tinggi' : 'Curah Rendah')}
                      </p>
                    </div>
                  </div>
                </div>

                {realtimeWeather ? (
                  <div className="p-3 bg-emerald-50/50 border border-dashed border-emerald-200/80 rounded-xl text-center">
                    <p className="text-[9.5px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                      LOKASI: {realtimeWeather.locationName}
                    </p>
                    <p className="text-[9px] text-emerald-700/80 font-sans mt-0.5">
                      Prakiraan disinkronkan otomatis melalui satelit lokasi Anda.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FBF9F6] border border-dashed border-editorial-border rounded-xl text-center">
                    <p className="text-[10px] font-mono text-editorial-accent leading-relaxed">
                      Suhu cenderung sejuk, dipengaruhi gerak matahari dan siklus tahunan Jawa.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* AI Analisis Section (Berasal dari backend server.ts) */}
        <section id="ai-analysis-section">
          <AiAnalysisView 
            analysis={aiAnalysis}
            isLoading={aiLoading}
            error={aiError}
            onTriggerAnalysis={handleTriggerAiAnalysis}
            hasObservations={observations.length > 0}
          />
        </section>

        {/* Observasi Cepat Section */}
        <section id="observations-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text">
                Observasi Cepat Saya
              </h2>
              <p className="text-xs text-editorial-accent mt-1.5 font-serif italic">Catat fenomena alam lokal untuk mencocokkan dengan siklus agraris Jawa</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                id="reset-obs-btn"
                onClick={handleResetObservations}
                title="Reset ke data contoh"
                className="p-2.5 text-editorial-accent hover:text-editorial-text bg-editorial-card border border-editorial-border rounded-xl hover:bg-editorial-border/40 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                id="open-modal-btn"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-editorial-text hover:bg-editorial-accent rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Observasi</span>
              </button>
            </div>
          </div>

          {/* 4 Primary Category Summary Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {(['cuaca', 'hewan', 'tanaman', 'air'] as const).map((cat) => {
              const latest = getLatestObservationForCategory(cat);
              return (
                <div 
                  key={cat}
                  className="p-4 rounded-2xl bg-editorial-card border border-editorial-border hover:border-editorial-accent transition-all flex flex-col justify-between h-36 relative overflow-hidden shadow-sm group"
                >
                  {/* Decorative background logo */}
                  <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:scale-110 transition-transform text-editorial-text">
                    {getCategoryIcon(cat)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-editorial-bg text-editorial-text border border-editorial-border/60">
                        {getCategoryIcon(cat)}
                      </span>
                      <span className="text-[9px] font-mono text-editorial-accent font-bold uppercase tracking-widest">{cat}</span>
                    </div>
                    <h4 className="text-xs font-serif font-bold text-editorial-text capitalize mt-1.5">
                      {latest ? latest.title : `Observasi ${getCategoryDisplayLabel(cat)}`}
                    </h4>
                  </div>

                  <p className="text-[11px] text-editorial-accent line-clamp-2 leading-relaxed">
                    {latest ? latest.description : `Belum ada catatan ${getCategoryDisplayLabel(cat)} terdaftar.`}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Observations List (History Log) */}
          <div className="rounded-2xl border border-editorial-border bg-editorial-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-editorial-border bg-editorial-bg/60 flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-editorial-accent uppercase">
              <span>DAFTAR JURNAL SASMITA LUHUR</span>
              <span>{observations.length} Catatan Aktif</span>
            </div>

            {observations.length === 0 ? (
              <div className="p-10 text-center text-editorial-accent font-serif italic text-sm bg-[#FBF9F6]/50">
                <Compass className="w-8 h-8 mx-auto mb-3 opacity-20 text-editorial-text" />
                <p>Jurnal observasi alam Anda masih kosong.</p>
                <p className="text-[10px] font-sans not-italic text-slate-400 mt-1">Gunakan tombol tambah untuk mencatat tanda-tanda alam di pekarangan Anda.</p>
              </div>
            ) : (
              <div className="divide-y divide-editorial-border/60 max-h-[380px] overflow-y-auto bg-[#FBF9F6]/40">
                {observations.map((obs) => {
                  return (
                    <div key={obs.id} className="p-5 flex justify-between items-start hover:bg-editorial-bg/25 transition-colors">
                      <div className="flex gap-4">
                        <div className="p-2.5 rounded-xl bg-editorial-bg text-editorial-text border border-editorial-border/60 h-fit">
                          {getCategoryIcon(obs.category)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-serif font-bold text-editorial-text">{obs.title}</h4>
                            <span className="text-[9px] font-mono bg-white px-2 py-0.5 rounded text-editorial-accent border border-editorial-border uppercase tracking-widest font-bold">
                              {getCategoryDisplayLabel(obs.category)}
                            </span>
                          </div>
                          <p className="text-xs text-editorial-text leading-relaxed font-sans font-light">
                            {obs.description}
                          </p>
                          <div className="flex gap-3 text-[10px] font-mono text-editorial-accent pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-editorial-accent" />
                              {obs.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-editorial-accent" />
                              {obs.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        id={`delete-obs-${obs.id}`}
                        onClick={() => handleDeleteObservation(obs.id)}
                        className="p-2 rounded text-editorial-accent hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Kalender Mangsa Exploration Section */}
        <section id="calendar-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text">
                Eksplorasi Kalender Pranata Mangsa
              </h2>
              <p className="text-xs text-editorial-accent mt-1.5 font-serif italic">Pilih salah satu mangsa untuk mempelajari sasmita dan karakteristiknya</p>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-editorial-accent bg-editorial-card border border-editorial-border px-3 py-1.5 rounded-md uppercase font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              12 MANGSA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MANGSAS_DATA.map((mangsa) => {
              const isActive = activeMangsa.id === mangsa.id;
              return (
                <button
                  key={mangsa.id}
                  id={`select-mangsa-${mangsa.id}`}
                  onClick={() => {
                    setActiveMangsa(mangsa);
                    const startDate = getStartDateForMangsa(mangsa.id);
                    setSelectedDate(startDate);
                    // Scroll back to top slightly so they see the header change
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-5 rounded-2xl text-left border transition-all flex justify-between gap-4 group relative overflow-hidden shadow-sm ${
                    isActive 
                      ? 'bg-[#FBF9F6] border-editorial-text' 
                      : 'bg-editorial-card border-editorial-border hover:border-editorial-accent hover:bg-editorial-bg/50'
                  }`}
                >
                  {/* Subtle active border indicator */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-editorial-text" />
                  )}

                  {/* Seasonal thumb image */}
                  <div className="w-20 h-20 aspect-square rounded-xl overflow-hidden flex-shrink-0 border border-editorial-border relative">
                    <img 
                      src={mangsa.imageUrl} 
                      alt={mangsa.name} 
                      className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform mix-blend-multiply brightness-[0.98]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-editorial-accent font-bold uppercase tracking-widest">MANGSA KE-{mangsa.id}</span>
                        {isActive && (
                          <span className="text-[9px] font-mono font-bold bg-editorial-text text-white px-2 py-0.5 rounded tracking-widest">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-editorial-text flex items-center gap-1.5 mt-0.5">
                        {mangsa.name}
                        <span className="text-xs font-sans text-editorial-accent font-light italic">({mangsa.javaneseName})</span>
                      </h4>
                      <p className="text-[11px] text-editorial-accent mt-1 italic font-serif leading-relaxed line-clamp-1">
                        &ldquo;{mangsa.candra}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-editorial-accent pt-2 border-t border-editorial-border/60 mt-2.5">
                      <span>Durasi: {mangsa.duration} Hari</span>
                      <span className="text-editorial-text font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 uppercase tracking-wider text-[9px]">
                        Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer info banner */}
        <footer className="text-center text-editorial-accent/60 text-[10px] font-mono pt-12 pb-6 border-t border-editorial-border/60 space-y-2 max-w-xl mx-auto leading-relaxed">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-editorial-card border border-editorial-border font-bold text-[10px] text-editorial-text tracking-widest uppercase mb-1 shadow-sm">
            AI + AI
          </div>
          <p className="font-semibold text-editorial-accent/85">
            Dirancang berdasarkan Ancestral Intelligence yang diwariskan melalui kearifan Pranata Mangsa Nusantara.
          </p>
          <p className="text-[9px] text-editorial-accent/50">
            Dikembangkan dengan bantuan Artificial Intelligence menggunakan Google Gemini 3.5 Flash dan OpenAI ChatGPT GPT-5.5.
          </p>
        </footer>
      </main>

      {/* 3. Global Modal for adding observations */}
      <AddObservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveObservation}
      />

      {/* 4. Global Modal for Pranata Mangsa Information & Philosophy */}
      <AnimatePresence>
        {isInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInfoOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-editorial-bg border border-editorial-border rounded-2xl p-6 md:p-8 shadow-2xl z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsInfoOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-editorial-border/30 text-editorial-accent hover:text-editorial-text transition-colors"
                title="Tutup Dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="space-y-2 text-center border-b border-editorial-border/80 pb-4">
                <div className="inline-flex p-3 rounded-full bg-editorial-accent/10 text-editorial-accent border border-editorial-border/50 mx-auto">
                  <Compass className="w-6 h-6 text-editorial-accent" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text">
                  Kearifan Pranata Mangsa Jawa
                </h3>
                <p className="text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  Ancestral Intelligence • Pranoto Mongso
                </p>
              </div>

              {/* Content Grid */}
              <div className="space-y-5 text-sm text-editorial-text leading-relaxed font-sans font-light">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-editorial-text flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent rounded-full" />
                    Apa itu Pranata Mangsa?
                  </h4>
                  <p className="pl-3.5">
                    <strong>Pranata Mangsa</strong> (artinya: ketentuan musim) adalah sistem kalender pertanian tradisional Jawa kuno berbasis penanggalan matahari (Solar/Surya). Diwariskan turun-temurun, kalender ini membagi satu tahun penuh menjadi 12 siklus <em>(Mangsa)</em> dengan durasi tidak seragam, mencerminkan pergeseran rasi bintang, iklim mikro, dan tanda-tanda alam di pulau Jawa.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-editorial-text flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent rounded-full" />
                    Filosofi Pemanfaatan Aplikasi
                  </h4>
                  <p className="pl-3.5">
                    Aplikasi ini dirancang sebagai jembatan interaktif antara <strong>Ancestral Intelligence</strong> (kecerdasan leluhur nusantara) dengan <strong>Artificial Intelligence</strong> (kecerdasan buatan modern). Kami percaya bahwa teknologi masa depan yang terbaik dikembangkan tanpa melupakan kearifan masa lalu yang mengajarkan kehidupan yang selaras dengan bumi <em>(Hamemayu Hayuning Bawana)</em>.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-editorial-text flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent rounded-full" />
                    Manfaat & Guna Aplikasi
                  </h4>
                  <ul className="pl-3.5 space-y-2.5 list-none">
                    <li className="flex gap-2 items-start">
                      <span className="font-serif font-bold text-editorial-accent">1.</span>
                      <span><strong>Menyelaraskan Penanggalan</strong>: Gunakan penyeleksi tanggal dinamis untuk memetakan penanggalan masehi hari ini, hari esok, atau masa lampau ke siklus 12 mangsa secara otomatis.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-serif font-bold text-editorial-accent">2.</span>
                      <span><strong>Mencatat Sasmita Alam</strong>: Jurnal "Observasi Cepat" Anda mencakup tanda-tanda biologi (hewan dan tanaman) serta tanda abiotik (arah angin, tipe awan) di sekitar pekarangan atau lahan Anda.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-serif font-bold text-editorial-accent">3.</span>
                      <span><strong>Prakiraan & Analisis AI</strong>: Kecerdasan Buatan (Google Gemini & OpenAI ChatGPT) menganalisis keselarasan jurnal observasi lokal Anda dengan siklus tradisional mangsa aktif guna memberi masukan agraris presisi.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Close */}
              <div className="pt-4 border-t border-editorial-border/60 text-center">
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="px-6 py-2.5 bg-editorial-text hover:bg-editorial-accent text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Saya Mengerti & Siap Mengamati
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
