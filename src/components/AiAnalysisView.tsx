import { 
  Compass, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  Leaf, 
  Scroll,
  Eye,
  Activity,
  CloudSun,
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AiAnalysisResult } from '../types';

interface AiAnalysisViewProps {
  analysis: AiAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onTriggerAnalysis: () => void;
  hasObservations: boolean;
}

export default function AiAnalysisView({ 
  analysis, 
  isLoading, 
  error, 
  onTriggerAnalysis, 
  hasObservations 
}: AiAnalysisViewProps) {
  
  return (
    <div id="ai-analysis-container" className="rounded-2xl border border-editorial-border bg-editorial-card overflow-hidden shadow-md">
      {/* Banner Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-editorial-border bg-editorial-bg/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-editorial-accent/10 text-editorial-accent border border-editorial-border">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-editorial-text">Sastra Jendro AI Kaji Alam</h3>
            <p className="text-[10px] text-editorial-accent font-mono tracking-wider uppercase">Konsultasi kearifan lokal bertenaga Kecerdasan Buatan</p>
          </div>
        </div>

        {!isLoading && (
          <button
            id="trigger-analysis-btn"
            onClick={onTriggerAnalysis}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider text-white bg-editorial-text hover:bg-editorial-accent rounded-lg transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{hasObservations ? "MULAI ANALISIS" : "RINGKASAN MANGSA"}</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-editorial-accent animate-spin" />
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-editorial-text tracking-wide">Membaca Sandi Jagad...</p>
              <p className="text-xs text-editorial-accent font-serif italic max-w-sm">
                &ldquo;Kaki Pranata Mangsa sedang menafsirkan tanda-tanda alam semesta dan meramu pitutur luhur untuk pertanian Anda...&rdquo;
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="p-3 bg-red-50 rounded-full text-red-600 border border-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-800">Gagal Membaca Isyarat Jagad</p>
              <p className="text-xs text-editorial-accent max-w-sm">{error}</p>
            </div>
            <button
              id="retry-analysis-btn"
              onClick={onTriggerAnalysis}
              className="px-4 py-2 text-xs font-medium text-editorial-text bg-editorial-bg hover:bg-editorial-border/60 rounded-lg border border-editorial-border transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : analysis ? (
          <div className="space-y-8 animate-fade-in text-editorial-text">
            {/* Top Row: Harmony Score & Proverb */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Score Circular Ring */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-editorial-bg border border-editorial-border text-center">
                <div className="relative flex items-center justify-center w-28 h-28">
                  {/* Outer circle decoration */}
                  <div className="absolute inset-0 rounded-full border-4 border-editorial-border/40" />
                  {/* Dynamic Ring */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      fill="transparent"
                      stroke="#7C6A54"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - analysis.harmonyScore / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-serif font-bold text-editorial-text">{analysis.harmonyScore}%</span>
                    <span className="text-[9px] text-editorial-accent font-mono tracking-widest uppercase">SELARAS</span>
                  </div>
                </div>
                <div className="mt-4 text-xs font-serif italic text-editorial-accent">
                  {analysis.harmonyScore >= 80 ? 'Sangat Selaras dengan Siklus' : analysis.harmonyScore >= 50 ? 'Selaras Sebagian' : 'Kurang Selaras (Pancaroba)'}
                </div>
              </div>

              {/* Javanese Framed Proverb */}
              <div className="md:col-span-8 flex flex-col justify-center p-6 rounded-xl border border-editorial-border bg-[#FBF9F6] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 opacity-10">
                  <Scroll className="w-24 h-24 text-editorial-accent" />
                </div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-editorial-accent font-bold uppercase">PITUTUR LUHUR JOWO</span>
                <p className="mt-2 font-serif text-2xl font-bold italic text-editorial-text leading-tight">
                  &ldquo;{analysis.javaneseProverb.split(' - ')[0]}&rdquo;
                </p>
                <p className="mt-2 text-sm text-editorial-accent font-serif italic leading-relaxed">
                  {analysis.javaneseProverb.split(' - ')[1] || analysis.javaneseProverb}
                </p>
              </div>
            </div>

            {/* Integrated Nature Research & Contextual Synthesis Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-editorial-border">
              {/* Current Ecological Phenomena */}
              <div className="p-5 rounded-xl bg-editorial-bg border border-editorial-border space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-editorial-accent" />
                  Kaji Fenomena Ekologi Terkini
                </h4>
                <p className="text-xs md:text-sm text-editorial-text leading-relaxed font-sans font-light">
                  {analysis.phenomenaExplanation || "Sedang memetakan fenomena ekologi terkini..."}
                </p>
              </div>

              {/* Scientific Traditional Connection */}
              <div className="p-5 rounded-xl bg-editorial-bg border border-editorial-border space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  <CloudSun className="w-4 h-4 text-editorial-accent" />
                  Sintesis Sains & Pranoto Mongso
                </h4>
                <p className="text-xs md:text-sm text-editorial-text leading-relaxed font-sans font-light">
                  {analysis.scientificTraditionalConnection || "Menyinkronkan data numerik klimatologi dengan sasmita tradisional..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-editorial-border">
              {/* Forecast Phenomena */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  <Flame className="w-4 h-4 text-editorial-accent" />
                  Prakiraan Isyarat Depan
                </h4>
                <p className="text-xs md:text-sm text-editorial-text leading-relaxed font-sans font-light">
                  {analysis.forecastPhenomena || "Memperkirakan kecenderungan alam..."}
                </p>
              </div>

              {/* Recommended Action (Laku) */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-editorial-accent" />
                  Laku / Saran Tindakan
                </h4>
                <p className="text-xs md:text-sm text-editorial-text leading-relaxed font-sans font-light">
                  {analysis.recommendedAction || "Menyusun laku harian yang selaras..."}
                </p>
              </div>

              {/* Things to Observe (Verification checklist) */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold text-editorial-accent uppercase tracking-widest">
                  <Eye className="w-4 h-4 text-editorial-accent" />
                  Verifikasi Pengamatan Anda
                </h4>
                {analysis.thingsToObserve && analysis.thingsToObserve.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.thingsToObserve.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-editorial-text font-sans font-light leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-editorial-accent shrink-0 animate-ping" />
                        <span className="w-1.5 h-1.5 rounded-full bg-editorial-accent shrink-0 -ml-1.5 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-editorial-accent font-serif italic">Belum ada indikator spesifik yang harus diverifikasi.</p>
                )}
              </div>
            </div>

            {/* Risk Warnings Box */}
            {analysis.riskWarning && (
              <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                analysis.riskWarning.toLowerCase().includes('aman') || analysis.riskWarning.toLowerCase().includes('stabil')
                  ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                  : 'bg-amber-50/50 border-amber-100 text-amber-900'
              }`}>
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">Peringatan Risiko Lingkungan</span>
                  <p className="text-xs font-light leading-relaxed">
                    {analysis.riskWarning}
                  </p>
                </div>
              </div>
            )}

            {/* Original Core Analysis Sections (Kesesuaian, Makna, Saran Pertanian) inside an elegant border section */}
            <div className="pt-6 border-t border-editorial-border space-y-4">
              <span className="text-[9px] font-mono tracking-[0.2em] text-editorial-accent font-bold uppercase block">Analisis Inti Pranoto Mongso</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h5 className="text-xs font-sans font-semibold text-editorial-text flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-editorial-accent" />
                    1. Kesesuaian Sasmita
                  </h5>
                  <p className="text-xs text-editorial-accent leading-relaxed font-light">{analysis.alignmentAnalysis}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-sans font-semibold text-editorial-text flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-editorial-accent" />
                    2. Makna Kearifan Lokal
                  </h5>
                  <p className="text-xs text-editorial-accent leading-relaxed font-light">{analysis.localWisdom}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-sans font-semibold text-editorial-text flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-editorial-accent" />
                    3. Saran Bercocok Tanam
                  </h5>
                  <p className="text-xs text-editorial-accent leading-relaxed font-light">{analysis.agriculturalAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="p-4 bg-editorial-bg rounded-full text-editorial-accent border border-editorial-border">
              <Compass className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <p className="text-base font-serif font-bold text-editorial-text">Peta Keselarasan Alam Belum Diuji</p>
              <p className="text-xs text-editorial-accent leading-relaxed font-sans">
                {hasObservations 
                  ? "Anda telah mencatat sasmita alam! Klik tombol 'Mulai Analisis' di atas untuk menganalisis keselarasan kondisi lingkungan lokal bertenaga AI."
                  : "Belum ada catatan observasi pribadi. Anda bisa mencatat sasmita angin, awan, satwa, atau flora di bawah, atau klik tombol di bawah untuk langsung memunculkan ringkasan karakteristik aslinya dari Kaki Pranata Mangsa AI."}
              </p>
            </div>
            <button
              id="empty-trigger-analysis-btn"
              onClick={onTriggerAnalysis}
              className="px-5 py-2.5 text-xs font-bold tracking-widest text-white bg-editorial-text hover:bg-editorial-accent rounded-lg transition-all shadow-sm uppercase font-sans"
            >
              {hasObservations ? "Analisis Sasmita Saya" : "Lihat Ringkasan Mangsa (AI)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
