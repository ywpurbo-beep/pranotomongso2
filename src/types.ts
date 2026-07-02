export interface WeatherMetrics {
  temp: string;
  wind: string;
  humidity: string;
  rainfall: string;
  skyCondition: string;
}

export interface Mangsa {
  id: number;
  name: string;
  javaneseName: string;
  meaning: string;
  translation: string;
  dates: string;
  duration: number;
  candra: string;
  candraMeaning: string;
  sasmita: string;
  description: string;
  cropsAdvice: string;
  weather: WeatherMetrics;
  imageUrl: string;
  themeColor: string; // Tailwind color e.g., 'amber', 'emerald', 'cyan', 'rose'
  seasonPhase?: string; // e.g., 'Kemarau', 'Labuh', 'Rendheng', 'Mareng'
}

export interface Observation {
  id: string;
  category: 'angin' | 'awan' | 'hewan' | 'tanaman' | 'air';
  title: string;
  description: string;
  date: string;
  time: string;
}

export interface AiAnalysisResult {
  harmonyScore: number;
  alignmentAnalysis: string;
  localWisdom: string;
  agriculturalAdvice: string;
  javaneseProverb: string;
}
