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
      const { observations, currentMangsa } = req.body;
      
      if (!observations || !Array.isArray(observations)) {
        return res.status(400).json({ error: "Data observasi tidak valid." });
      }

      let aiClient;
      try {
        aiClient = getGeminiClient();
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

      // Limit to 6 most recent observations to avoid cluttering AI context with old logs
      const recentObservations = observations.slice(0, 6);

      let obsText = "";
      let hasObs = recentObservations.length > 0;

      if (hasObs) {
        obsText = recentObservations.map((o: any, idx: number) => {
          return `${idx + 1}. Kategori: ${o.category}, Deskripsi: ${o.description}, Tanggal: ${o.date || 'Hari ini'}`;
        }).join("\n");
      } else {
        obsText = "Tidak ada observasi lokal spesifik yang dicatat oleh pengguna saat ini.";
      }

      const prompt = `Anda adalah seorang ahli klimatologi dan kearifan ekologis Nusantara yang menguasai sistem Pranata Mangsa Jawa. 
Masyarakat lokal dari berbagai daerah di Nusantara ingin mendapatkan ringkasan dan analisis mengenai kondisi musim saat ini:

Mangsa (Musim tradisional) yang sedang aktif saat ini menurut kalender adalah: **Mangsa ${currentMangsa.name}** (${currentMangsa.translation || ''}) yang bercirikan secara umum: "${currentMangsa.description}".
Sasmita (Tanda) tradisional mangsa ini adalah: "${currentMangsa.sasmita || 'Tidak ada'}".

Observasi lokal saat ini:
${obsText}

Tugas Anda adalah memberikan analisis ramah, mendalam, dan puitis mengenai musim ini:
${hasObs ? `1. Analisis apakah tanda-tanda alam yang dicatat oleh pengguna (kondisi langit & cuaca, perilaku satwa, kondisi flora, kondisi sumber air/hidrologi) selaras dengan karakteristik Mangsa ${currentMangsa.name} saat ini.
2. Berikan penjelasan kearifan lokal pertanian tradisional mengenai makna dari kombinasi tanda-tanda tersebut bagi kegiatan bertani saat ini (misalnya persiapan tanah, penyemaian, penanaman padi/palawija, penyiangan, atau pemanenan).` : `1. Karena tidak ada observasi lokal khusus yang dicatat pengguna, berikan ringkasan murni mengenai esensi dari Mangsa ${currentMangsa.name} ini beserta tanda-tanda alam (sasmita) alamiahnya yang patut diperhatikan.
2. Jelaskan kearifan lokal pertanian tradisional mengenai makna rohaniah dan jasmaniah dari musim ini bagi kegiatan pertanian.`}
3. Berikan saran praktis & bijaksana untuk langkah bercocok tanam atau kegiatan sehari-hari yang selaras dengan irama alam (misal menghemat air, bersiap menghadapi hujan deras, menjaga kesuburan dsb).

PENTING UNTUK BAHASA & AUDIENS:
- Tuliskan tanggapan Anda dalam **BAHASA INDONESIA YANG BAIK, UTUH, DAN DOMINAN** agar dapat dipahami secara universal oleh seluruh masyarakat Indonesia (Nusantara).
- **HINDARI** menulis seluruh penjelasan dalam bahasa Jawa penuh.
- Berikan nuansa Jawa hanya sebagai **sentuhan secukupnya** (seperti istilah/konsep tradisional, nama sasmita, atau peribahasa pendek) untuk menjaga nilai orisinalitas tanpa mengorbankan keterbacaan publik nasional.

Format output harus berupa JSON terstruktur yang elegan dengan skema berikut:
{
  "harmonyScore": ${hasObs ? '85' : '100'}, // Angka 0-100 seberapa selaras observasi pengguna dengan mangsa aktif (jika tidak ada observasi, berikan nilai 100 sebagai harmoni dasar alam semesta)
  "alignmentAnalysis": "Kalimat penjelasan keselarasan tanda alam dalam Bahasa Indonesia...",
  "localWisdom": "Penjelasan kearifan lokal mengenai kondisi alam saat ini dalam Bahasa Indonesia...",
  "agriculturalAdvice": "Saran praktis bercocok tanam yang bijak dalam Bahasa Indonesia...",
  "javaneseProverb": "Peribahasa atau nasihat puitis Jawa pendek yang relevan dengan maknanya (misal: 'Bantala Rengka', 'Udan Sumawur', dll), lengkap dengan terjemahannya dalam Bahasa Indonesia."
}

Tulis tanggapan Anda hanya dalam format JSON murni. Jangan menambahkan teks pembuka atau penutup markdown seperti \`\`\`json. Pastikan teksnya puitis, mendalam, namun mudah dimengerti oleh petani modern dan sarat kearifan tradisional Nusantara yang indah.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
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
