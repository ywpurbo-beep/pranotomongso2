import React, { useState } from 'react';
import { X, Wind, Cloud, Bird, Leaf, Calendar, Clock, Droplets } from 'lucide-react';
import { Observation } from '../types';

interface AddObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (observation: Omit<Observation, 'id'>) => void;
}

export default function AddObservationModal({ isOpen, onClose, onSave }: AddObservationModalProps) {
  const [category, setCategory] = useState<'angin' | 'awan' | 'hewan' | 'tanaman' | 'air'>('angin');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  // Pre-fill fields or trigger suggestion titles based on category selection
  const handleCategoryChange = (cat: 'angin' | 'awan' | 'hewan' | 'tanaman' | 'air') => {
    setCategory(cat);
    if (cat === 'angin') setTitle('Arah & Kekuatan Angin');
    else if (cat === 'awan') setTitle('Keadaan Langit & Awan');
    else if (cat === 'hewan') setTitle('Gerak-gerik Satwa');
    else if (cat === 'tanaman') setTitle('Perkembangan Flora');
    else if (cat === 'air') setTitle('Kondisi Air & Hidrologi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Format WIB datetime
    const now = new Date();
    const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', optionsDate);
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    onSave({
      category,
      title: title || getCategoryLabel(category),
      description,
      date: dateStr,
      time: timeStr
    });

    // Reset Form
    setTitle('');
    setDescription('');
    onClose();
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'angin': return 'Arah & Kekuatan Angin';
      case 'awan': return 'Keadaan Langit & Awan';
      case 'hewan': return 'Gerak-gerik Satwa';
      case 'tanaman': return 'Perkembangan Flora';
      case 'air': return 'Kondisi Air & Hidrologi';
      default: return 'Observasi Baru';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2621]/50 backdrop-blur-sm animate-fade-in">
      <div 
        id="add-observation-card" 
        className="w-full max-w-md overflow-hidden bg-editorial-bg border border-editorial-border rounded-2xl shadow-xl text-editorial-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-editorial-border bg-editorial-card">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-editorial-accent" />
            <h3 className="font-serif text-lg font-bold">Catat Sasmita Alam</h3>
          </div>
          <button 
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-editorial-accent hover:bg-editorial-border/40 hover:text-editorial-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Selector Grid */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-editorial-accent uppercase">
              1. Pilih Kategori Sasmita (Tanda Alam)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              <button
                type="button"
                id="cat-angin-btn"
                onClick={() => handleCategoryChange('angin')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === 'angin'
                    ? 'bg-editorial-text border-editorial-text text-white'
                    : 'bg-editorial-card border-editorial-border text-editorial-accent hover:border-editorial-accent hover:text-editorial-text'
                }`}
              >
                <Wind className="w-4.5 h-4.5 mb-1" />
                <span className="text-[9px] font-medium font-sans">Angin</span>
              </button>

              <button
                type="button"
                id="cat-awan-btn"
                onClick={() => handleCategoryChange('awan')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === 'awan'
                    ? 'bg-editorial-text border-editorial-text text-white'
                    : 'bg-editorial-card border-editorial-border text-editorial-accent hover:border-editorial-accent hover:text-editorial-text'
                }`}
              >
                <Cloud className="w-4.5 h-4.5 mb-1" />
                <span className="text-[9px] font-medium font-sans">Awan</span>
              </button>

              <button
                type="button"
                id="cat-hewan-btn"
                onClick={() => handleCategoryChange('hewan')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === 'hewan'
                    ? 'bg-editorial-text border-editorial-text text-white'
                    : 'bg-editorial-card border-editorial-border text-editorial-accent hover:border-editorial-accent hover:text-editorial-text'
                }`}
              >
                <Bird className="w-4.5 h-4.5 mb-1" />
                <span className="text-[9px] font-medium font-sans">Satwa</span>
              </button>

              <button
                type="button"
                id="cat-tanaman-btn"
                onClick={() => handleCategoryChange('tanaman')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === 'tanaman'
                    ? 'bg-editorial-text border-editorial-text text-white'
                    : 'bg-editorial-card border-editorial-border text-editorial-accent hover:border-editorial-accent hover:text-editorial-text'
                }`}
              >
                <Leaf className="w-4.5 h-4.5 mb-1" />
                <span className="text-[9px] font-medium font-sans">Flora</span>
              </button>

              <button
                type="button"
                id="cat-air-btn"
                onClick={() => handleCategoryChange('air')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === 'air'
                    ? 'bg-editorial-text border-editorial-text text-white'
                    : 'bg-editorial-card border-editorial-border text-editorial-accent hover:border-editorial-accent hover:text-editorial-text'
                }`}
              >
                <Droplets className="w-4.5 h-4.5 mb-1" />
                <span className="text-[9px] font-medium font-sans">Air</span>
              </button>
            </div>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-widest text-editorial-accent uppercase">
              2. Judul Observasi
            </label>
            <input
              type="text"
              id="observation-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukan nama fenomena/sasmita alam..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-editorial-border focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent text-editorial-text placeholder-slate-400 outline-none text-sm font-sans"
            />
          </div>

          {/* Description textarea */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-widest text-editorial-accent uppercase">
              3. Detail Deskripsi Gejala Alam
            </label>
            <textarea
              id="observation-desc-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan detail apa yang Anda amati di sekitar sawah, langit, pekarangan rumah, atau suhu udara saat ini..."
              rows={4}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-editorial-border focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent text-editorial-text placeholder-slate-400 outline-none text-sm font-sans resize-none"
            />
          </div>

          {/* Timestamp Indicator */}
          <div className="flex gap-4 p-3 rounded-lg bg-editorial-card/70 text-[10px] font-mono text-editorial-accent border border-editorial-border/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-editorial-accent" />
              <span>Hari Ini (Otomatis)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-editorial-accent" />
              <span>Waktu Sekarang (WIB)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              id="cancel-observation-btn"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-editorial-card hover:bg-editorial-border/50 text-editorial-text font-medium text-sm transition-all border border-editorial-border"
            >
              Kembali
            </button>
            <button
              type="submit"
              id="submit-observation-btn"
              disabled={!description.trim()}
              className="flex-1 py-2.5 rounded-xl bg-editorial-text hover:bg-editorial-accent disabled:bg-editorial-border disabled:text-slate-400 text-white font-semibold text-sm transition-all shadow-sm"
            >
              Simpan Sasmita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
