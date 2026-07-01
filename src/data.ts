import { Mangsa } from './types';
import imgKasa from './assets/images/mangsa_kasa_illustration_1782880543670.jpg';
import imgKaro from './assets/images/mangsa_karo_illustration_1782880555440.jpg';
import imgKatelu from './assets/images/mangsa_katelu_illustration_1782880566992.jpg';
import imgKapat from './assets/images/mangsa_kapat_illustration_1782901119681.jpg';
import imgKalima from './assets/images/mangsa_kalima_illustration_1782901135183.jpg';
import imgKanem from './assets/images/mangsa_kanem_illustration_1782901147180.jpg';
import imgKapitu from './assets/images/mangsa_kapitu_illustration_1782901158592.jpg';
import imgKawolu from './assets/images/mangsa_kawolu_illustration_1782901170417.jpg';
import imgKasanga from './assets/images/mangsa_kasanga_illustration_1782901191171.jpg';
import imgKadasa from './assets/images/mangsa_kadasa_illustration_1782901202953.jpg';
import imgDesta from './assets/images/mangsa_desta_illustration_1782901217511.jpg';
import imgSaddha from './assets/images/mangsa_saddha_illustration_1782901228474.jpg';

export const MANGSAS_DATA: Mangsa[] = [
  {
    id: 1,
    name: "Kasa",
    javaneseName: "Kartika",
    meaning: "Bulan Pertama",
    translation: "Awal Musim Kering",
    dates: "22 Juni - 1 Agustus",
    duration: 41,
    candra: "Sesotya murca ing embanan",
    candraMeaning: "Permata yang lepas dari pengikatnya (daun-daun berguguran dari rantingnya secara alami).",
    sasmita: "Udara mulai kering, embun pagi menipis, pepohonan meranggas demi menghemat air.",
    description: "Mangsa Kasa ditandai dengan mulainya angin berembus kering dari benua Australia. Daun-daun mulai gugur, dan uap air di pagi hari menipis. Petani biasanya membersihkan sisa panen dan mengistirahatkan lahan agar tanah kembali bernapas.",
    cropsAdvice: "Fokus pada pengolahan tanah (ndhudhuk/matun), mengumpulkan humus daun kering, dan menanam palawija yang tahan kering seperti kedelai atau wijen.",
    weather: {
      temp: "28°C",
      wind: "14 km/j Timur",
      humidity: "62%",
      rainfall: "0 mm",
      skyCondition: "Cerah Berawan"
    },
    imageUrl: imgKasa,
    themeColor: "amber",
    seasonPhase: "Kemarau"
  },
  {
    id: 2,
    name: "Karo",
    javaneseName: "Pusa",
    meaning: "Bulan Kedua",
    translation: "Puncak Kemarau & Angin Kencang",
    dates: "2 Agustus - 24 Agustus",
    duration: 23,
    candra: "Bantala rengka",
    candraMeaning: "Tanah yang retak (tanah pertanian mengering dan pecah-pecah).",
    sasmita: "Langit sangat cerah tanpa awan, matahari terasa menyengat di siang hari, angin kencang.",
    description: "Puncak musim kemarau di mana curah hujan sangat rendah atau bahkan nihil. Angin bertiup stabil dan kencang. Sumur-sumur warga dan sumber air mulai menyusut, tanah pematang sawah mulai pecah menganga secara alami.",
    cropsAdvice: "Sangat baik untuk menyemai benih palawija di tanah kering (gaga), menanam jagung, kacang tanah, atau tembakau yang membutuhkan sinar matahari berlimpah.",
    weather: {
      temp: "31°C",
      wind: "18 km/j Timur",
      humidity: "55%",
      rainfall: "0 mm",
      skyCondition: "Cerah Benderang"
    },
    imageUrl: imgKaro,
    themeColor: "orange",
    seasonPhase: "Kemarau"
  },
  {
    id: 3,
    name: "Katelu",
    javaneseName: "Katiga",
    meaning: "Bulan Ketiga",
    translation: "Akhir Kemarau & Rebung Tumbuh",
    dates: "25 Agustus - 17 September",
    duration: 24,
    candra: "Suta manut ing bapa",
    candraMeaning: "Anak yang patuh pada ayahnya (tanaman menjalar mengikuti sulur/lajurnya).",
    sasmita: "Panas terasa menyengat, tanah berdebu, namun tunas rebung (bambu) mulai menyembul dari tanah kering.",
    description: "Merupakan masa transisi akhir kemarau. Meskipun panas masih menyengat dan tanah berdebu halus, tanda-tanda kehidupan baru mulai muncul di bawah tanah. Tanaman obat keluarga (empon-empon) dan bambu mulai bertunas.",
    cropsAdvice: "Memanen tanaman palawija siklus pendek. Bersiap mengumpulkan pupuk organik hewani di sekitar kandang untuk persiapan musim tanam berikutnya.",
    weather: {
      temp: "32°C",
      wind: "16 km/j Tenggara",
      humidity: "58%",
      rainfall: "2 mm",
      skyCondition: "Cerah Berdebu"
    },
    imageUrl: imgKatelu,
    themeColor: "yellow",
    seasonPhase: "Kemarau"
  },
  {
    id: 4,
    name: "Kapat",
    javaneseName: "Sitra",
    meaning: "Bulan Keempat",
    translation: "Awal Pancaroba (Labuh)",
    dates: "18 September - 12 Oktober",
    duration: 25,
    candra: "Waspa kumembeng jroning kalbu",
    candraMeaning: "Air mata yang tertahan di dalam kalbu (sumber air perlahan terisi, awan mendung mengambang hangat).",
    sasmita: "Awan hitam mulai berarak, udara terasa gerah (sumuk), burung-burung mulai bersarang dan kawin.",
    description: "Memasuki masa pancaroba 'Labuh'. Udara siang hari terasa sangat gerah (sumuk) karena penguapan meningkat. Angin mulai bertiup tidak menentu arahnya, membawa awan mendung tebal ke atas pegunungan.",
    cropsAdvice: "Saat terbaik membersihkan saluran irigasi sawah (selokan), memperbaiki tanggul pematang, dan menyemai padi gaga di pekarangan.",
    weather: {
      temp: "29°C",
      wind: "10 km/j Pancaroba",
      humidity: "75%",
      rainfall: "45 mm",
      skyCondition: "Mendung Hangat"
    },
    imageUrl: imgKapat,
    themeColor: "teal",
    seasonPhase: "Labuh"
  },
  {
    id: 5,
    name: "Kalima",
    javaneseName: "Manggala",
    meaning: "Bulan Kelima",
    translation: "Awal Musim Hujan (Rendheng)",
    dates: "13 Oktober - 8 November",
    duration: 27,
    candra: "Pancuran mas sumawur ing jagad",
    candraMeaning: "Pancuran emas menyiram jagat raya (hujan lebat mulai turun merata menyuburkan bumi).",
    sasmita: "Hujan turun hampir setiap sore, pohon asam mulai bersemi daun muda, kunyit bertunas subur.",
    description: "Memasuki awal musim penghujan seutuhnya. Air hujan menyirami bumi yang gersang, membangkitkan kehidupan mikroorganisme tanah. Air sungai mulai mengalir keruh membawa lumpur subur dari pegunungan.",
    cropsAdvice: "Memulai penanaman padi sawah tadah hujan. Lahan palawija harus dipastikan memiliki saluran pembuangan air agar akar tidak membusuk terendam genangan.",
    weather: {
      temp: "27°C",
      wind: "12 km/j Barat Daya",
      humidity: "82%",
      rainfall: "120 mm",
      skyCondition: "Hujan Sedang"
    },
    imageUrl: imgKalima,
    themeColor: "emerald",
    seasonPhase: "Rendheng"
  },
  {
    id: 6,
    name: "Kanem",
    javaneseName: "Naya",
    meaning: "Bulan Keenam",
    translation: "Puncak Hujan & Buah Berlimpah",
    dates: "9 November - 21 Desember",
    duration: 43,
    candra: "Rasa mulya kasantosan",
    candraMeaning: "Rasa mulia yang memberi kekuatan (tanaman tumbuh kokoh, buah tropis mulai masak).",
    sasmita: "Hujan deras disertai petir, buah-buahan lokal mulai dipanen melimpah di pasar, serangga sangat aktif.",
    description: "Puncak musim hujan pertama di mana air melimpah ruah. Hutan dan pegunungan tampak sangat hijau pekat. Suara petir sering menggelegar di sore hari menandakan keaktifan cuaca tropis khas Nusantara.",
    cropsAdvice: "Masa krusial untuk pemupukan padi pertama. Kendalikan gulma pengganggu secara intensif karena kelembapan tinggi memicu pertumbuhan gulma sangat cepat.",
    weather: {
      temp: "26°C",
      wind: "15 km/j Barat",
      humidity: "90%",
      rainfall: "250 mm",
      skyCondition: "Hujan Lebat & Petir"
    },
    imageUrl: imgKanem,
    themeColor: "green",
    seasonPhase: "Rendheng"
  },
  {
    id: 7,
    name: "Kapitu",
    javaneseName: "Palguna",
    meaning: "Bulan Ketujuh",
    translation: "Musim Badai & Angin Barat",
    dates: "22 Desember - 2 Februari",
    duration: 43,
    candra: "Wisa kenthir ing maruta",
    candraMeaning: "Racun hanyut bersama angin (udara dingin menyingkirkan penyakit tanaman).",
    sasmita: "Angin Barat berembus kencang, gelombang laut tinggi, hujan deras berlangsung berhari-hari.",
    description: "Masa di mana curah hujan sangat tinggi disertai angin kencang (Angin Barat). Suhu udara cenderung menurun dingin di malam hari. Petani biasanya menghindari melaut dan berfokus merawat tanaman padi di sawah.",
    cropsAdvice: "Jagalah ketinggian air sawah agar tidak terlalu dalam (cukup macak-macak). Lakukan penyiangan kedua dan bersihkan sampah dahan pohon yang patah akibat angin.",
    weather: {
      temp: "25°C",
      wind: "24 km/j Barat",
      humidity: "92%",
      rainfall: "280 mm",
      skyCondition: "Hujan & Badai Angin"
    },
    imageUrl: imgKapitu,
    themeColor: "cyan",
    seasonPhase: "Rendheng"
  },
  {
    id: 8,
    name: "Kawolu",
    javaneseName: "Wisaka",
    meaning: "Bulan Kedelapan",
    translation: "Akhir Rendheng & Padi Mengisi",
    dates: "3 Februari - 28 Februari",
    duration: 26,
    candra: "Anjrah jroning kayun",
    candraMeaning: "Harapan yang merekah dalam hati (bulir padi mulai berisi susu, ulat keluar mencari daun).",
    sasmita: "Hujan mulai berkurang intensitasnya, ulat dan kupu-kupu bermunculan di taman, kicau burung bersahut-sahutan.",
    description: "Masa transisi di mana musim hujan deras mulai mereda. Sinar matahari kembali menyinari bumi lebih lama di siang hari. Tanaman padi di sawah mulai bunting dan mengisi bulir-bulir beras muda yang manis di dalamnya.",
    cropsAdvice: "Lindungi tanaman padi dari serangan hama ulat grayak dan walang sangit. Pasang orang-orangan sawah atau pengusir burung tradisional (kitiran).",
    weather: {
      temp: "28°C",
      wind: "12 km/j Barat Laut",
      humidity: "78%",
      rainfall: "95 mm",
      skyCondition: "Hujan Ringan"
    },
    imageUrl: imgKawolu,
    themeColor: "lime",
    seasonPhase: "Rendheng"
  },
  {
    id: 9,
    name: "Kasanga",
    javaneseName: "Jita",
    meaning: "Bulan Kesembilan",
    translation: "Pancaroba Akhir (Mareng)",
    dates: "1 Maret - 25 Maret",
    duration: 25,
    candra: "Wedaring wacana mulya",
    candraMeaning: "Lahirnya ucapan-ucapan mulia (hewan-hewan bersuara gembira, burung melepas anaknya terbang).",
    sasmita: "Angin bertiup hangat, jangkrik berbunyi nyaring di malam hari, aliran sungai mulai jernih kembali.",
    description: "Memasuki masa peralihan 'Mareng' dari basah menuju kering. Suhu udara mulai menghangat kembali dengan hembusan angin sepoi-sepoi yang bersahabat. Hewan liar mulai keluar menyambut hari-hari cerah yang akan datang.",
    cropsAdvice: "Sangat cocok untuk mengeringkan hasil panen di bawah terik matahari langsung. Sawah yang telah dipanen mulai dipersiapkan untuk tanaman palawija.",
    weather: {
      temp: "30°C",
      wind: "9 km/j Variabel",
      humidity: "72%",
      rainfall: "40 mm",
      skyCondition: "Cerah Berawan"
    },
    imageUrl: imgKasanga,
    themeColor: "rose",
    seasonPhase: "Mareng"
  },
  {
    id: 10,
    name: "Kadasa",
    javaneseName: "Srawana",
    meaning: "Bulan Kesepuluh",
    translation: "Panen Raya & Kemarau Tenang",
    dates: "26 Maret - 18 April",
    duration: 24,
    candra: "Gedhong mineb jroning kalbu",
    candraMeaning: "Gedung indah yang tertutup rapat (lumbung padi terisi penuh sebagai persediaan).",
    sasmita: "Padi menguning sempurna di sawah, burung pipit beterbangan gembira, udara sejuk pagi hari.",
    description: "Masa keemasan panen raya di bumi Jawa. Petani bersuka ria memotong padi (ani-ani) dan mengangkutnya ke lumbung desa. Angin berembus tenang dan kering, menandai datangnya kemarau yang damai.",
    cropsAdvice: "Panen padi secara serempak. Setelah dipanen, segera bajak tanah sawah selagi masih lembap untuk ditanami palawija pendamping (jagung, kedelai, kacang hijau).",
    weather: {
      temp: "29°C",
      wind: "11 km/j Timur",
      humidity: "65%",
      rainfall: "15 mm",
      skyCondition: "Cerah Indah"
    },
    imageUrl: imgKadasa,
    themeColor: "amber",
    seasonPhase: "Mareng"
  },
  {
    id: 11,
    name: "Desta",
    javaneseName: "Pratama",
    meaning: "Bulan Kesebelas",
    translation: "Awal Kemarau & Pohon Meranggas",
    dates: "19 April - 11 Mei",
    duration: 23,
    candra: "Sotya sinarawedi",
    candraMeaning: "Permata yang digosok mulia (pohon kapuk randu berbuah dan mengeluarkan serat putih bersih bagai permata).",
    sasmita: "Burung melatih anaknya terbang tinggi, pohon randu mulai memutih memecah buahnya, malam dingin.",
    description: "Musim kemarau seutuhnya telah tiba. Langit biru bersih membentang tanpa awan di siang hari. Angin kering mulai bertiup konstan dari arah tenggara, membawa hawa sejuk kering khas pegunungan Jawa.",
    cropsAdvice: "Lakukan pengairan terjadwal (leb) untuk tanaman palawija. Lindungi tanaman dari penguapan berlebih dengan menutup permukaan tanah menggunakan jerami padi.",
    weather: {
      temp: "30°C",
      wind: "14 km/j Tenggara",
      humidity: "60%",
      rainfall: "5 mm",
      skyCondition: "Cerah Bersih"
    },
    imageUrl: imgDesta,
    themeColor: "indigo",
    seasonPhase: "Kemarau"
  },
  {
    id: 12,
    name: "Saddha",
    javaneseName: "Asuji",
    meaning: "Bulan Keduabelas",
    translation: "Puncak Dingin Kemarau (Bediding)",
    dates: "12 Mei - 21 Juni",
    duration: 41,
    candra: "Tirta sah saking sasana",
    candraMeaning: "Air meninggalkan tempatnya (sumber air menyusut drastis, embun dingin membeku di dataran tinggi Jawa/embun upas).",
    sasmita: "Suhu udara sangat dingin di malam hari (bediding), air sumur terasa dingin sekali, dedaunan bambu kering berguguran.",
    description: "Siklus penutup tahunan Pranata Mangsa. Ditandai dengan cuaca dingin ekstrem di malam hari namun sangat terik di siang hari. Pada puncaknya, dataran tinggi seperti Dieng mengalami pembekuan embun upas.",
    cropsAdvice: "Batasi aktivitas pertanian berat, biarkan sebagian lahan bera (istirahat) untuk memutus siklus hama alami sebelum memasuki mangsa Kasa baru.",
    weather: {
      temp: "27°C",
      wind: "16 km/j Tenggara",
      humidity: "52%",
      rainfall: "0 mm",
      skyCondition: "Dingin & Kering"
    },
    imageUrl: imgSaddha,
    themeColor: "violet",
    seasonPhase: "Kemarau"
  }
];

export const INITIAL_OBSERVATIONS = [
  {
    id: "obs_1",
    category: "angin" as const,
    title: "Arah Angin",
    description: "Angin kencang berembus stabil ke barat daya dari arah timur laut di sore hari.",
    date: "30 Juni 2026",
    time: "16:30 WIB"
  },
  {
    id: "obs_2",
    category: "awan" as const,
    title: "Bentuk Awan",
    description: "Langit cerah bersih dengan gumpalan awan cumulus tipis di kaki langit utara.",
    date: "30 Juni 2026",
    time: "09:00 WIB"
  },
  {
    id: "obs_3",
    category: "hewan" as const,
    title: "Aktivitas Hewan",
    description: "Burung sriti dan burung hantu aktif terbang rendah di pekarangan bambu belakangan ini.",
    date: "29 Juni 2026",
    time: "18:15 WIB"
  },
  {
    id: "obs_4",
    category: "tanaman" as const,
    title: "Kondisi Tanaman",
    description: "Daun pohon jati dan dadap di pinggir ladang mulai berguguran kuning kering sempurna.",
    date: "28 Juni 2026",
    time: "07:30 WIB"
  }
];
