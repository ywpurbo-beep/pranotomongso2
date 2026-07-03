import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client lazily to avoid crashing if the API key isn't provided yet
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the Secrets panel.");
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route for analyzing nature observations
  app.post("/api/analyze-observations", async (req, res) => {
    try {
      const { 
        observations, 
        latestObservation, 
        observationsHistory, 
        currentMangsa, 
        allMangsas, 
        selectedDate, 
        location, 
        realtimeWeather 
      } = req.body;
      
      let aiClient;
      try {
        aiClient = getGeminiClient();
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

      // Build weather details text
      let weatherInfo = "Tidak tersedia";
      if (realtimeWeather) {
        weatherInfo = `- Temperatur: ${realtimeWeather.temp}
- Kelembapan: ${realtimeWeather.humidity}
- Curah Hujan: ${realtimeWeather.rainfall}
- Angin: ${realtimeWeather.wind}
- Tekanan Udara: ${realtimeWeather.pressure || "Tidak tersedia"}
- Kondisi Langit: ${realtimeWeather.skyCondition}`;

        if (realtimeWeather.hourlyForecast24h && realtimeWeather.hourlyForecast24h.length > 0) {
          weatherInfo += `\n\nPrakiraan Cuaca 24 Jam Ke Depan:\n` + 
            realtimeWeather.hourlyForecast24h.slice(0, 12).map((h: any) => `- Pukul ${h.time}: ${h.temp}, ${h.condition}, Hujan: ${h.precipitation}`).join("\n");
        }
      }

      // Location details
      let locationInfo = location ? `Nama Wilayah: ${location.name}` : "Sleman, Yogyakarta (Default)";
      if (location?.coords) {
        locationInfo += ` (Koordinat: Lat ${location.coords.latitude}, Lon ${location.coords.longitude})`;
      }

      // Observations history
      let historyText = "";
      if (observationsHistory && observationsHistory.length > 0) {
        historyText = observationsHistory.slice(0, 5).map((o: any, idx: number) => {
          return `${idx + 1}. Kategori: ${o.category}, Deskripsi: ${o.description}, Tanggal: ${o.date || 'Lalu'}`;
        }).join("\n");
      } else {
        historyText = "Tidak ada catatan riwayat observasi tambahan.";
      }

      let latestText = latestObservation 
        ? `Kategori: ${latestObservation.category}, Deskripsi: ${latestObservation.description}, Tanggal/Waktu: ${latestObservation.date} ${latestObservation.time || ''}`
        : "Tidak ada catatan observasi terbaru saat ini.";

      const systemInstruction = `Anda adalah asisten pengamat alam Pranoto Mongso luhur yang ahli dan bijaksana. 
Tugas Anda adalah menggabungkan ilmu klimatologi modern (data ilmiah kuantitatif) dengan kearifan ekologis tradisional Nusantara (sistem Pranoto Mongso Jawa) secara harmonis. 
Posisikan kedua perspektif ini sejajar dan saling melengkapi tanpa menganggap salah satu lebih tinggi atau lebih rendah dari yang lain. 
Misalnya, hubungkan data kuantitatif kelembapan tinggi atau tekanan rendah dengan tanda alam (sasmita) atau perubahan perilaku satwa/flora secara logis dan puitis.

Bahasa tanggapan harus didominasi oleh Bahasa Indonesia yang baik, utuh, dan universal agar dapat dipahami oleh seluruh masyarakat Nusantara. Berikan nuansa Jawa hanya secukupnya sebagai sentuhan keaslian budaya (seperti istilah tanda alam asli, pepatah pendek, atau nama sasmita).`;

      const prompt = `Lakukan analisis kaji alam secara kontekstual terpadu berdasarkan data-data berikut:

[KONTEKS MANGSA SEKARANG]
- Mangsa Aktif: Mangsa ${currentMangsa.name} (${currentMangsa.translation || ''})
- Periode Kalender: ${currentMangsa.dates}
- Candra (Ungkapan Puitis): "${currentMangsa.candra || ''}" - Makna: "${currentMangsa.candraMeaning || ''}"
- Karakteristik Umum: "${currentMangsa.description || ''}"
- Sasmita (Tanda Alam) Tradisional: "${currentMangsa.sasmita || ''}"
- Saran Tradisional: "${currentMangsa.cropsAdvice || ''}"
- Nilai Acuan Cuaca Mangsa Ini: Suhu ${currentMangsa.weather?.temp || ''}, Angin ${currentMangsa.weather?.wind || ''}, Kelembapan ${currentMangsa.weather?.humidity || ''}, Curah Hujan ${currentMangsa.weather?.rainfall || ''}

[SITUASI RIIL PENGGUNA]
- Tanggal Terpilih: ${selectedDate || 'Hari ini'}
- Lokasi Pengguna: ${locationInfo}
- Cuaca Realtime Saat Ini:
${weatherInfo}

[OBSERVASI LAPANGAN PENGGUNA]
- Catatan Observasi Terbaru Pengguna:
${latestText}
- Riwayat Observasi Pengguna Lainnya yang Relevan:
${historyText}

Analisislah seluruh informasi tersebut secara mendalam untuk memberikan laporan kaji alam yang terintegrasi. 
Hasilkan tanggapan dalam format JSON murni dengan struktur berikut:
{
  "harmonyScore": 85, // Angka 0-100, seberapa selaras kondisi cuaca riil & observasi pengguna dengan karakteristik asli Mangsa aktif saat ini menurut irama alam semesta.
  "alignmentAnalysis": "Analisis terperinci mengenai tingkat keselarasan sasmita/tanda alam riil yang diamati dengan kondisi teoretis Mangsa saat ini...",
  "localWisdom": "Penjelasan makna kearifan lokal mengenai kondisi alam saat ini...",
  "agriculturalAdvice": "Saran bercocok tanam yang bijaksana dan praktis...",
  "javaneseProverb": "Pepatah atau nasihat puitis Jawa pendek yang relevan beserta artinya dalam Bahasa Indonesia...",
  "phenomenaExplanation": "Penjelasan mendalam tentang fenomena alam/cuaca yang sedang berlangsung, mengawinkan data kuantitatif modern (suhu, kelembapan, tekanan, dll) dengan sasmita tradisional Pranoto Mongso...",
  "forecastPhenomena": "Fenomena alam atau cuaca yang kemungkinan besar akan muncul dalam beberapa hari ke depan berdasarkan data prakiraan cuaca 24 jam dan tren siklus mangsa...",
  "thingsToObserve": [
    "Hal spesifik pertama yang perlu diamati di lingkungan sekitar oleh pengguna untuk memverifikasi analisis ini...",
    "Hal spesifik kedua yang perlu diamati..."
  ],
  "recommendedAction": "Saran tindakan konkrit (Laku) sehari-hari atau kegiatan luar ruangan yang paling selaras dengan kondisi ekologis saat ini...",
  "riskWarning": "Peringatan risiko lingkungan atau keselamatan jika ada (misal: dehidrasi, peningkatan hama tertentu, angin kencang tiba-tiba, atau banjir kilat akibat anomali cuaca). Jika tidak ada risiko, tuliskan 'Kondisi terpantau aman dan stabil.'",
  "scientificTraditionalConnection": "Penjelasan singkat yang menghubungkan data cuaca modern (seperti tekanan hPa, kecepatan angin km/j) dengan kearifan Pranoto Mongso secara logis dan mencerahkan..."
}

PENTING:
1. Pastikan tanggapan hanya berupa JSON murni tanpa penutup markdown \`\`\`json.
2. Semua penjelasan menggunakan Bahasa Indonesia yang didominasi oleh kosakata universal, informatif, mendalam, puitis, dan penuh rasa hormat pada alam semesta.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const analysisResult = JSON.parse(cleanedJson);

      return res.json(analysisResult);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({ error: error.message || "Gagal menganalisis observasi." });
    }
  });

  // Serve static assets in production, use Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
