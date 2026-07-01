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

      if (observations.length === 0) {
        return res.status(400).json({ error: "Silakan tambahkan setidaknya satu observasi terlebih dahulu." });
      }

      let aiClient;
      try {
        aiClient = getGeminiClient();
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

      const obsText = observations.map((o: any, idx: number) => {
        return `${idx + 1}. Kategori: ${o.category}, Deskripsi: ${o.description}, Tanggal: ${o.date || 'Hari ini'}`;
      }).join("\n");

      const prompt = `Anda adalah seorang ahli pertanian tradisional Jawa (Kaki Pranata Mangsa) yang bijaksana. 
Masyarakat lokal telah mencatat beberapa observasi gejala alam (Sasmita/tanda-tanda alam) saat ini:

${obsText}

Mangsa (Musim tradisional) yang sedang aktif saat ini menurut kalender adalah: **Mangsa ${currentMangsa.name}** (${currentMangsa.translation || ''}) yang bercirikan secara umum: "${currentMangsa.description}".
Sasmita (Tanda) tradisional mangsa ini adalah: "${currentMangsa.sasmita || 'Tidak ada'}".

Tugas Anda adalah memberikan analisis ramah, mendalam, dan puitis khas budaya Jawa mengenai observasi tersebut:
1. Analisis apakah tanda-tanda alam yang dicatat oleh pengguna (arah angin, bentuk awan, perilaku hewan, kondisi tanaman) selaras dengan karakteristik Mangsa ${currentMangsa.name} saat ini.
2. Berikan penjelasan kearifan lokal pertanian tradisional Jawa mengenai makna dari kombinasi tanda-tanda tersebut bagi kegiatan bertani saat ini (misalnya persiapan tanah, penyemaian, penanaman padi/palawija, penyiangan, atau pemanenan).
3. Berikan saran praktis & bijaksana untuk langkah bercocok tanam atau kegiatan sehari-hari yang selaras dengan irama alam (misal menghemat air, bersiap menghadapi hujan deras, menjaga kesuburan dsb).

Format output harus berupa JSON terstruktur yang elegan dengan skema berikut:
{
  "harmonyScore": 85, // Angka 0-100 seberapa selaras observasi pengguna dengan mangsa aktif
  "alignmentAnalysis": "Kalimat penjelasan keselarasan tanda alam...",
  "localWisdom": "Penjelasan kearifan lokal mengenai kondisi alam saat ini...",
  "agriculturalAdvice": "Saran praktis bercocok tanam yang bijak...",
  "javaneseProverb": "Peribahasa atau nasihat puitis Jawa pendek yang relevan dengan maknanya (misal: 'Bantala Rengka', 'Udan Sumawur', dll), lengkap dengan terjemahannya."
}

Tulis tanggapan Anda hanya dalam format JSON murni. Jangan menambahkan teks pembuka atau penutup markdown seperti \`\`\`json. Pastikan teksnya puitis, mendalam, namun mudah dimengerti oleh petani modern dan sarat kearifan tradisional Jawa yang indah.`;

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
