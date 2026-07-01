import { Mangsa } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Compass } from 'lucide-react';

interface HeaderSectionProps {
  activeMangsa: Mangsa;
  scrollY: number;
  onExploreClick?: () => void;
}

export default function HeaderSection({ activeMangsa, scrollY, onExploreClick }: HeaderSectionProps) {
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
                Pranoto Mongso Explorer
              </h1>
              <p className="text-[9px] text-editorial-accent font-mono tracking-widest uppercase">
                MANGSA {activeMangsa.name} • {activeMangsa.javaneseName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-editorial-text bg-editorial-bg px-3 py-1 rounded-full border border-editorial-border">
            <Leaf className="w-3.5 h-3.5 text-editorial-accent" />
            <span className="font-serif italic">Hari ke-18</span>
          </div>
        </motion.div>
      )}

      {/* Expanded Header Content */}
      <div 
        className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8"
        style={{ 
          transform: `translateY(${contentOffset}px) scale(${scale})`,
          opacity: 1 - (ratio * 1.2), // Fades faster as it collapses
          pointerEvents: ratio > 0.6 ? 'none' : 'auto'
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-editorial-card/90 text-editorial-text border border-editorial-border text-[10px] font-mono tracking-widest uppercase shadow-sm">
            <Compass className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Kawuruh Alam • Pranoto Mongso</span>
          </div>

          {/* Core Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-editorial-text tracking-tight">
            Pranoto Mongso Explorer
          </h1>
          
          {/* Subtitle */}
          <p className="mt-1.5 text-base text-editorial-accent font-serif italic max-w-lg leading-relaxed">
            Mengamati alam, memahami ritme kehidupan, dan selaras dengan warisan kearifan luhur nusantara.
          </p>

          {/* Quick Stats Indicator */}
          <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-editorial-text/70 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 font-semibold">
              <Leaf className="w-3.5 h-3.5 text-editorial-accent" />
              Sastra Jendro Hayuningrat
            </span>
            <span className="w-1 h-1 rounded-full bg-editorial-border" />
            <span>Kearifan Ekologis Jawa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
