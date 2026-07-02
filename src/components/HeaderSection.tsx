import { Mangsa } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Compass, Info } from 'lucide-react';

interface HeaderSectionProps {
  activeMangsa: Mangsa;
  scrollY: number;
  onExploreClick?: () => void;
  onInfoClick: () => void;
}

export default function HeaderSection({ activeMangsa, scrollY, onExploreClick, onInfoClick }: HeaderSectionProps) {
  // Calculate collapse levels based on scrollY
  const maxScroll = 200;
  const rawRatio = Math.min(scrollY / maxScroll, 1);
  const ratio = Math.max(0, rawRatio); // 0 is fully expanded, 1 is fully collapsed

  // Styles dynamically interpolated
  const headerHeight = 280 - (ratio * 190); // 280px to 90px
  const imageOpacity = 1 - ratio; // Image fully fades out
  const contentOffset = ratio * -24; // Slide up
  const scale = 1 - (ratio * 0.12); // Scale title down slightly

  return (
    <div 
      className="sticky top-0 z-40 w-full overflow-hidden transition-colors duration-500 border-b border-editorial-border/60"
      style={{ 
        height: `${headerHeight}px`,
        backgroundColor: ratio > 0.8 ? '#F0EBE3' : '#F5F2ED' // Transition to solid warm editorial-card on collapse
      }}
    >
      {/* Background Season Landscape with crossfade transition */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{ opacity: imageOpacity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMangsa.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img 
              src={activeMangsa.imageUrl} 
              alt={`Latar Belakang ${activeMangsa.name}`}
              className="object-cover w-full h-full filter brightness-90 contrast-[1.02] mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            {/* Soft cream-to-warm-dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-editorial-bg via-transparent to-black/25" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Earthy Accent overlay at the bottom when expanded */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-editorial-bg to-transparent"
        style={{ opacity: 1 - ratio }}
      />

      {/* Collapsed Compact Title Bar (Shown when fully scrolled) */}
      {ratio > 0.7 && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-editorial-accent/10 text-editorial-accent border border-editorial-border">
              <Compass className="w-5 h-5 text-editorial-accent" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-editorial-text tracking-wide">
                Kawuruh Pranoto Mongso
              </h1>
              <p className="text-[9px] text-editorial-accent font-mono tracking-widest uppercase">
                MANGSA {activeMangsa.name} • {activeMangsa.javaneseName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onInfoClick}
              className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest uppercase text-editorial-accent bg-white/90 px-3 py-1.5 rounded-full border border-editorial-border hover:bg-editorial-accent hover:text-white transition-all cursor-pointer pointer-events-auto"
              title="Filosofi & Guna"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filosofi</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-editorial-text bg-editorial-bg px-3 py-1.5 rounded-full border border-editorial-border">
              <Leaf className="w-3.5 h-3.5 text-editorial-accent" />
              <span className="font-serif italic">{activeMangsa.dates}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Expanded Header Content */}
      <div 
        className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 md:p-8"
        style={{ 
          transform: `translateY(${contentOffset}px) scale(${scale})`,
          opacity: 1 - (ratio * 1.2), // Fades faster as it collapses
          pointerEvents: ratio > 0.6 ? 'none' : 'auto'
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* Badge line with Info Trigger */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-editorial-card/90 text-editorial-text border border-editorial-border text-[9px] sm:text-[10px] font-mono tracking-widest uppercase shadow-sm">
              <Compass className="w-3 sm:w-3.5 sm:h-3.5 h-3 text-editorial-accent flex-shrink-0" />
              <span className="hidden xs:inline">Kawuruh Alam • Pranoto Mongso</span>
              <span className="inline xs:hidden">Pranata Mangsa</span>
            </div>

            <button
              onClick={onInfoClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-editorial-text hover:text-white transition-all text-editorial-accent border border-editorial-border text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm pointer-events-auto cursor-pointer"
              title="Filosofi & Guna"
            >
              <Info className="w-3 h-3 text-editorial-accent hover:text-inherit flex-shrink-0" />
              <span className="hidden xs:inline">Filosofi & Guna</span>
              <span className="inline xs:hidden">Filosofi</span>
            </button>
          </div>

          {/* Core Title */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-editorial-text tracking-tight">
            Kawuruh Pranoto Mongso
          </h1>
          
          {/* Subtitle - hidden on very small portrait screens to prevent overflow */}
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm md:text-base text-editorial-accent font-serif italic max-w-lg leading-relaxed hidden xs:block xs:line-clamp-2 sm:line-clamp-none">
            Aplikasi berbasis sistem Pranata Mangsa Jawa untuk mengamati alam, memahami ritme kehidupan, dan hidup selaras dengan warisan kearifan luhur nusantara.
          </p>

          {/* Quick Stats Indicator */}
          <div className="mt-2 sm:mt-4 flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-mono text-editorial-text/70 uppercase tracking-widest">
            <span className="flex items-center gap-1 sm:gap-1.5 font-semibold">
              <Leaf className="w-3 sm:w-3.5 sm:h-3.5 h-3 text-editorial-accent" />
              Sastra Jendro Hayuningrat
            </span>
            <span className="w-1 h-1 rounded-full bg-editorial-border" />
            <span className="hidden xxs:inline">Kearifan Ekologis Jawa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
