import { useState, useEffect } from 'react';
import { 
  Compass, 
  Wind, 
  Cloud, 
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
  RefreshCw
} from 'lucide-react';
import { Mangsa, Observation, AiAnalysisResult } from './types';
import { MANGSAS_DATA, INITIAL_OBSERVATIONS } from './data';
import HeaderSection from './components/HeaderSection';
import AddObservationModal from './components/AddObservationModal';
import AiAnalysisView from './components/AiAnalysisView';

export default function App() {
  // 1. Core States
  const [activeMangsa, setActiveMangsa] = useState<Mangsa>(MANGSAS_DATA[0]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      const response = await fetch('/api/analyze-observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          observations,
          currentMangsa: activeMangsa
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
  const getLatestObservationForCategory = (cat: 'angin' | 'awan' | 'hewan' | 'tanaman') => {
    return observations.find(o => o.category === cat);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'angin': return 'sky';
      case 'awan': return 'blue';
      case 'hewan': return 'amber';
      case 'tanaman': return 'emerald';
      default: return 'slate';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'angin': return <Wind className="w-5 h-5" />;
      case 'awan': return <Cloud className="w-5 h-5" />;
      case 'hewan': return <Bird className="w-5 h-5" />;
      case 'tanaman': return <Leaf className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text font-sans selection:bg-editorial-accent/30 selection:text-editorial-text">
      {/* 1. Scrolling collapsing header */}
      <HeaderSection activeMangsa={activeMangsa} scrollY={scrollY} />

      {/* 2. Main Content Stage */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* Mangsa Saat Ini Card */}
        <section id="current-mangsa-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-editorial-text">
              Pranata Mangsa Aktif
            </h2>
            <span className="text-[10px] font-mono tracking-widest text-editorial-accent bg-editorial-card border border-editorial-border/80 px-3 py-1.5 rounded-md font-bold uppercase">
              SIKLUS: TAHUNAN JAWA
            </span>
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
                  <p className="text-xs text-editorial-accent leading-relaxed font-light">
                    {activeMangsa.candraMeaning}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.2em] font-bold text-editorial-accent uppercase">SASMITA (PANDUAN ALAM)</span>
                  <p className="text-sm text-editorial-text leading-relaxed font-sans">
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
                  <span className="text-[9px] text-editorial-accent font-mono">Pagi Hari</span>
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
                      <p className="text-xl font-bold font-serif text-editorial-text">{activeMangsa.weather.temp}</p>
                      <p className="text-[10px] text-editorial-accent font-serif italic">{activeMangsa.weather.skyCondition}</p>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Wind className="w-3.5 h-3.5" />
                      <span>Angin</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">{activeMangsa.weather.wind}</p>
                      <p className="text-[10px] text-editorial-accent">Embusan</p>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Kelembapan</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">{activeMangsa.weather.humidity}</p>
                      <p className="text-[10px] text-editorial-accent">Lembap</p>
                    </div>
                  </div>

                  {/* Rainfall */}
                  <div className="p-3 bg-white rounded-xl border border-editorial-border space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-editorial-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Hujan</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-serif text-editorial-text">{activeMangsa.weather.rainfall}</p>
                      <p className="text-[10px] text-editorial-accent">{parseInt(activeMangsa.weather.rainfall) > 50 ? 'Curah Tinggi' : 'Curah Rendah'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FBF9F6] border border-dashed border-editorial-border rounded-xl text-center">
                  <p className="text-[10px] font-mono text-editorial-accent leading-relaxed">
                    Suhu malam cenderung sejuk, dipengaruhi gerak udara siklus tahunan Jawa.
                  </p>
                </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['angin', 'awan', 'hewan', 'tanaman'] as const).map((cat) => {
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
                      {latest ? latest.title : `Observasi ${cat}`}
                    </h4>
                  </div>

                  <p className="text-[11px] text-editorial-accent line-clamp-2 leading-relaxed">
                    {latest ? latest.description : `Belum ada catatan ${cat} terdaftar.`}
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
                              {obs.category}
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
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-editorial-border relative">
                    <img 
                      src={mangsa.imageUrl} 
                      alt={mangsa.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform mix-blend-multiply brightness-[0.98]"
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
        <footer className="text-center text-editorial-accent/60 text-[10px] font-mono pt-12 pb-6 border-t border-editorial-border/60 space-y-1 max-w-xl mx-auto">
          <p className="font-semibold text-editorial-accent/85">
            Berakar pada Kecerdasan Leluhur Jawa Nusantara.
          </p>
          <p className="text-[9px] text-editorial-accent/50">
            Disempurnakan dengan bantuan Kecerdasan Buatan Gemini 3.5 Flash dan ChatGPT GPT-5.5 Thinking.
          </p>
        </footer>
      </main>

      {/* 3. Global Modal for adding observations */}
      <AddObservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveObservation}
      />
    </div>
  );
}
