import { Mangsa } from './types';

export const MANGSAS_DATA: Mangsa[] = [
  {
    id: 1,
    name: "Kasa",
    javaneseName: "Kartika",
    meaning: "Bulan Pertama",
    translation: "Musim Kering Utama",
    dates: "22 Juni - 1 Agustus",
    duration: 41,
    candra: "Sesotya murca ing embanan",
    candraMeaning: "Permata yang lepas dari pengikatnya (daun-daun berguguran dari rantingnya).",
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
    imageUrl: "/src/assets/images/mangsa_kasa_illustration_1782880543670.jpg",
    themeColor: "amber"
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
    imageUrl: "/src/assets/images/mangsa_karo_illustration_1782880555440.jpg",
    themeColor: "orange"
  },
  {
    id: 3,
    name: "Katelu",
    javaneseName: "Kartika / Manggasri",
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
    imageUrl: "/src/assets/images/mangsa_katelu_illustration_1782880566992.jpg",
    themeColor: "yellow"
  },
  {
    id: 4,
    name: "Labuh",
    javaneseName: "Sitra",
    meaning: "Bulan Keempat",
    translation: "Masa Pancaroba (Kemarau ke Hujan)",
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
    imageUrl: "/src/assets/images/mangsa_labuh_illustration_1782880580244.jpg",
    themeColor: "teal"
  },
  {
    id: 5,
    name: "Rendheng",
    javaneseName: "Manggala",
    meaning: "Bulan Kelima & Keenam",
    translation: "Musim Hujan Utama",
    dates: "13 Oktober - 21 Desember",
    duration: 70,
    candra: "Pancuran mas sumawur ing jagad",
    candraMeaning: "Pancuran emas menyiram jagat raya (hujan lebat turun merata menyuburkan bumi).",
    sasmita: "Hujan turun hampir setiap sore dan malam, air melimpah di sungai, katak mulai bernyanyi riang.",
    description: "Musim hujan seutuhnya atau 'Rendheng'. Bumi yang semula kering kerontang disiram air melimpah, mengembalikan keasrian alam Jawa. Hutan-hutan bambu menjadi hijau pekat, tanah melunak sempurna siap dibajak.",
    cropsAdvice: "Masa keemasan untuk menanam padi sawah utama (padi Rendengan). Pastikan aliran air lancar di sawah agar bibit padi muda tidak tergenang membusuk.",
    weather: {
      temp: "26°C",
      wind: "12 km/j Barat Daya",
      humidity: "88%",
      rainfall: "240 mm",
      skyCondition: "Hujan Lebat"
    },
    imageUrl: "/src/assets/images/mangsa_rendheng_illustration_1782880591923.jpg",
    themeColor: "emerald"
  },
  {
    id: 6,
    name: "Mareng",
    javaneseName: "Naya",
    meaning: "Bulan Ketujuh & Kedelapan",
    translation: "Masa Pancaroba (Hujan ke Kemarau)",
    dates: "22 Desember - 28 Februari",
    duration: 69,
    candra: "Rasa mulya kasantosan",
    candraMeaning: "Rasa mulia yang memberi kekuatan (tanaman tumbuh kokoh, padi mulai mengisi bulir).",
    sasmita: "Hujan berangsur mereda, angin dingin bertiup di pagi hari, bulir-bulir padi di sawah mulai menguning hangat.",
    description: "Musim transisi 'Mareng' dari hujan kembali ke kemarau. Udara terasa sejuk di pagi hari, curah hujan menurun drastis. Padi yang ditanam pada masa Rendheng kini menguning subur, membentang bagaikan karpet emas raksasa.",
    cropsAdvice: "Lakukan penyiangan terakhir, lindungi tanaman padi dari hama burung pipit menggunakan jaring, bersiap memanen padi sawah dengan gembira.",
    weather: {
      temp: "27°C",
      wind: "10 km/j Barat Laut",
      humidity: "70%",
      rainfall: "35 mm",
      skyCondition: "Cerah Sejuk"
    },
    imageUrl: "/src/assets/images/mangsa_mareng_illustration_1782880604216.jpg",
    themeColor: "sky"
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
