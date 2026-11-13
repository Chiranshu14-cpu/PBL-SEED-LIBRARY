const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Seed = require('../models/Seed');
const Purchase = require('../models/Purchase');
const BorrowRequest = require('../models/BorrowRequest');
const Return = require('../models/Return');
const SeedDeposit = require('../models/SeedDeposit');
const GardenEntry = require('../models/GardenEntry');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const ActivityLog = require('../models/ActivityLog');

const SEED_VARIETIES = [
  {
    name: 'Tomato',
    vernacularNames: { en: 'Tomato', hi: 'टमाटर (Tamatar)', mr: 'टोमॅटो (Tomato)' },
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    description: {
      en: 'Indeterminate heirloom variety producing deep-red, flavorful, disease-tolerant fruits ideal for village culinary use and seed preservation.',
      hi: 'पारंपरिक गहरी लाल रंग की टमाटर किस्म जो स्वादिष्ट, कीट प्रतिरोधी और लंबे समय तक फल देने वाली है।',
      mr: 'गावठी लाल रंगाचे, चवदार आणि कीड-रोग प्रतिकारक पारंपरिक देशी टोमॅटो वाण.',
    },
    packetWeightGrams: 10,
    packetWeightDisplay: '10g (~3,000 seeds)',
    pricePerPacket: 25,
    initialStock: 120,
    availableStock: 105,
    totalPurchased: 10,
    totalBorrowed: 5,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif / Rabi / Zaid (Year-round)',
    germinationPeriod: '6 - 10 Days',
    harvestPeriod: '65 - 80 Days',
    sunlight: 'Full Sun (6 - 8 hours daily)',
    soilRequirements: 'Rich, well-draining sandy loam (pH 6.0 - 6.8)',
    watering: 'Moderate, regular drip or root watering',
    growingInstructions: 'Sow in nursery beds; transplant 25-day-old saplings with 60x45cm spacing. Provide bamboo staking support.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Brinjal',
    vernacularNames: { en: 'Brinjal / Eggplant', hi: 'बैंगन (Baingan)', mr: 'वांगी (Vangi)' },
    scientificName: 'Solanum melongena',
    category: 'Vegetables',
    description: {
      en: 'Traditional purple-striped thorny village variety with soft flesh, minimal bitterness, and high drought resistance.',
      hi: 'कांटेदार पारंपरिक बैंगनी वाण, भरवां सब्जी के लिए अत्यंत उत्तम और सूखे को सहन करने में सक्षम।',
      mr: 'गावरान काटेरी जांभळी वांगी, भरित आणि भाजीसाठी प्रसिद्ध, दुष्काळ सहन करणारे वाण.',
    },
    packetWeightGrams: 10,
    packetWeightDisplay: '10g (~2,200 seeds)',
    pricePerPacket: 20,
    initialStock: 100,
    availableStock: 88,
    totalPurchased: 8,
    totalBorrowed: 4,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Summer / Kharif / Late Rabi',
    germinationPeriod: '7 - 12 Days',
    harvestPeriod: '70 - 90 Days',
    sunlight: 'Full Sun (7 - 8 hours daily)',
    soilRequirements: 'Deep, rich loamy soil with organic manure (pH 5.5 - 6.8)',
    watering: 'Deep weekly watering; keep mulch around base',
    growingInstructions: 'Raise nursery seedlings for 30 days. Transplant at 75x60cm spacing. Pinch tips to encourage dense branching.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmeZg181-dHI_dBi8tOkf7Sysge8Ql2KLxrPhlsZcccg&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Okra',
    vernacularNames: { en: 'Okra / Lady Finger', hi: 'भिंडी (Bhindi)', mr: 'भेंडी (Bhendi)' },
    scientificName: 'Abelmoschus esculentus',
    category: 'Vegetables',
    description: {
      en: 'High-yielding green heirloom okra, tender pods with low mucilage and natural resistance to Yellow Vein Mosaic Virus (YVMV).',
      hi: 'पीत शिरा मोज़ेक वायरस प्रतिरोधी, गहरे हरे रंग की मुलायम और स्वादिष्ट पारंपरिक भिंडी।',
      mr: 'रोगप्रतिकारक, कोवळी आणि हिरवीगार पारंपरिक गावरान भेंडी वाण.',
    },
    packetWeightGrams: 25,
    packetWeightDisplay: '25g (~400 seeds)',
    pricePerPacket: 20,
    initialStock: 100,
    availableStock: 82,
    totalPurchased: 12,
    totalBorrowed: 6,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif (June-July) / Summer (Feb-March)',
    germinationPeriod: '5 - 8 Days',
    harvestPeriod: '45 - 55 Days',
    sunlight: 'Full direct sunlight',
    soilRequirements: 'Warm, well-aerated sandy loam with compost',
    watering: 'Water every 3-4 days in summer, weekly in rainy season',
    growingInstructions: 'Soak seeds in tepid water for 12 hours before direct sowing. Sow 2cm deep with 45x30cm plant spacing.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0qp1FfIaRse5CdtPWQvCH-Ux3_uW7NdJKH3Z7yX1VIw&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Green Chilli',
    vernacularNames: { en: 'Green Chilli', hi: 'हरी मिर्च (Hari Mirch)', mr: 'हिरवी मिरची (Mirchi)' },
    scientificName: 'Capsicum annuum',
    category: 'Vegetables',
    description: {
      en: 'Pungent, upright-bearing heirloom variety producing prolific clusters of spicy green peppers that mature to vibrant red.',
      hi: 'तीखी और सुगन्धित देसी हरी मिर्च जो अत्यधिक फल देने वाली और कीट-प्रतिरोधी है।',
      mr: 'जास्त तिखट, दर्जेदार आणि भरघोस उत्पादन देणारे गावरान लवंगी मिरची वाण.',
    },
    packetWeightGrams: 10,
    packetWeightDisplay: '10g (~1,500 seeds)',
    pricePerPacket: 30,
    initialStock: 110,
    availableStock: 95,
    totalPurchased: 10,
    totalBorrowed: 5,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif / Summer',
    germinationPeriod: '8 - 14 Days',
    harvestPeriod: '70 - 85 Days',
    sunlight: 'Bright sunny location (6+ hours)',
    soilRequirements: 'Light, well-aerated loam rich in organic matter',
    watering: 'Avoid over-watering; let topsoil dry slightly between waterings',
    growingInstructions: 'Transplant 35-day seedlings into well-tilled soil. Apply neem cake during root formation to ward off mites.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnQqFoMXJPE8kRA9teiWcR8hOcwArVJuoBHl0GY2pBZw&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Cucumber',
    vernacularNames: { en: 'Cucumber', hi: 'खीरा (Kheera)', mr: 'काकडी (Kakdi)' },
    scientificName: 'Cucumis sativus',
    category: 'Vegetables',
    description: {
      en: 'Crisp, cooling, pale-green heirloom slicing cucumber with thin skin and juicy texture, popular in summer homestead gardens.',
      hi: 'पतले छिलके वाला, कुरकुरा और रसीला देसी खीरा जो गर्मियों के लिए अत्यंत लाभकारी है।',
      mr: 'गोड, पांढरट-हिरवी कुरकुरीत गावरान काकडी, उन्हाळ्यासाठी अत्यंत फायदेशीर वाण.',
    },
    packetWeightGrams: 20,
    packetWeightDisplay: '20g (~700 seeds)',
    pricePerPacket: 25,
    initialStock: 90,
    availableStock: 74,
    totalPurchased: 11,
    totalBorrowed: 5,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Summer (Feb-Mar) / Rainy (June-July)',
    germinationPeriod: '4 - 7 Days',
    harvestPeriod: '50 - 60 Days',
    sunlight: 'Full Sun',
    soilRequirements: 'Moist, fertile soil rich in humus (pH 6.5 - 7.5)',
    watering: 'Consistent moisture is critical to avoid bitter flavor',
    growingInstructions: 'Sow 4-5 seeds per mound on raised beds or provide trellis netting for clean, straight climbing cucumbers.',
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Pumpkin',
    vernacularNames: { en: 'Pumpkin', hi: 'कद्दू (Kaddu)', mr: 'भोपळा (Bhopla)' },
    scientificName: 'Cucurbita moschata',
    category: 'Vegetables',
    description: {
      en: 'Vigorous trailing vine producing large, ribbed, golden-orange flesh pumpkins with outstanding 6-month shelf life.',
      hi: 'पारंपरिक देसी कद्दू, मीठे नारंगी गूदे वाला और महीनों तक सुरक्षित रहने वाला टिकाऊ फल।',
      mr: 'गोड गावरान तांबडा भोपळा, दीर्घकाळ टिकणारा आणि पौष्टिक घटकांनी समृद्ध वाण.',
    },
    packetWeightGrams: 25,
    packetWeightDisplay: '25g (~180 seeds)',
    pricePerPacket: 25,
    initialStock: 80,
    availableStock: 66,
    totalPurchased: 8,
    totalBorrowed: 6,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Rainy (June-July) / Summer (Jan-Feb)',
    germinationPeriod: '6 - 10 Days',
    harvestPeriod: '90 - 120 Days',
    sunlight: 'Full sun, open space for rambling vines',
    soilRequirements: 'Fertile, well-draining soil with plenty of well-rotted manure',
    watering: 'Deep soak weekly; avoid wetting foliage directly to prevent mildew',
    growingInstructions: 'Direct seed 2-3 seeds per pit. Allow 2 meters between vine hills. Harvest when rind hardens.',
    imageUrl: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Spinach',
    vernacularNames: { en: 'Spinach / Palak', hi: 'पालक (Palak)', mr: 'पालक (Palak)' },
    scientificName: 'Spinacia oleracea',
    category: 'Vegetables',
    description: {
      en: 'Broad, succulent dark-green leafy vegetable, packed with iron and vitamins. Rapid grower allowing multiple cuttings.',
      hi: 'लगातार कई कटाई देने वाली, हरी-भरी, लोहे और विटामिन से भरपूर पौष्टिक देसी पालक।',
      mr: 'जाड आणि रुंद पानांची गावरान पालक, एका पेरणीत अनेक कापण्या देणारे फायदेशीर वाण.',
    },
    packetWeightGrams: 50,
    packetWeightDisplay: '50g (~4,500 seeds)',
    pricePerPacket: 18,
    initialStock: 120,
    availableStock: 98,
    totalPurchased: 14,
    totalBorrowed: 8,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Rabi (Oct-Dec) / Winter / Spring',
    germinationPeriod: '5 - 8 Days',
    harvestPeriod: '30 - 45 Days',
    sunlight: 'Full sun to partial shade',
    soilRequirements: 'Loamy soil rich in nitrogen and organic matter',
    watering: 'Light, regular watering to keep leaves lush and prevent bolting',
    growingInstructions: 'Broadcast or line-sow 2cm deep in flat beds. Harvest outer leaves every 12 days to promote regrowth.',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Radish',
    vernacularNames: { en: 'Radish / Mooli', hi: 'मूली (Mooli)', mr: 'मुळा (Mula)' },
    scientificName: 'Raphanus sativus',
    category: 'Vegetables',
    description: {
      en: 'Straight, crisp, pure-white roots with a pleasant mild pungency. Both roots and young green tops are edible.',
      hi: 'सीधी, कुरकुरी, सफेद और हल्की तीखी पारंपरिक मूली जो 40 दिनों में तैयार हो जाती है।',
      mr: 'पांढरा शुभ्र, लांब आणि चवदार गावरान मुळा, पाने व कंद दोन्ही खाण्यासाठी उत्तम.',
    },
    packetWeightGrams: 30,
    packetWeightDisplay: '30g (~2,800 seeds)',
    pricePerPacket: 18,
    initialStock: 100,
    availableStock: 85,
    totalPurchased: 9,
    totalBorrowed: 6,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Winter / Rabi (Sept - Jan)',
    germinationPeriod: '3 - 6 Days',
    harvestPeriod: '35 - 45 Days',
    sunlight: 'Full sunlight',
    soilRequirements: 'Deep, loose sandy loam free of stones to prevent root forking',
    watering: 'Regular and even; dry soil causes tough, overly pungent roots',
    growingInstructions: 'Sow seeds 1.5cm deep on raised ridges 30cm apart. Thin seedlings to 8cm spacing after 10 days.',
    imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Carrot',
    vernacularNames: { en: 'Carrot / Gajar', hi: 'गाजर (Gajar)', mr: 'गाजर (Gajar)' },
    scientificName: 'Daucus carota',
    category: 'Vegetables',
    description: {
      en: 'Deep-red Asiatic heirloom carrot, exceptionally sweet with a tender red core and high carotene and antioxidant content.',
      hi: 'पारंपरिक लाल गाजर, अत्यधिक मीठी, रसीली और हलवा व सलाद के लिए सबसे उत्तम देसी किस्म।',
      mr: 'गावरान लाल गाजर, अत्यंत गोड आणि रसाळ, पोषक द्रव्यांनी परिपूर्ण पारंपरिक वाण.',
    },
    packetWeightGrams: 25,
    packetWeightDisplay: '25g (~18,000 seeds)',
    pricePerPacket: 22,
    initialStock: 100,
    availableStock: 80,
    totalPurchased: 12,
    totalBorrowed: 8,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Winter / Rabi (Oct - Nov)',
    germinationPeriod: '8 - 14 Days',
    harvestPeriod: '80 - 100 Days',
    sunlight: 'Full Sun',
    soilRequirements: 'Deeply tilled, loose, friable sandy soil (pH 6.0 - 6.8)',
    watering: 'Moderate, steady moisture to avoid split roots',
    growingInstructions: 'Mix seeds with dry sand for even broadcasting on raised beds. Keep seed bed continuously moist until sprouted.',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Fenugreek',
    vernacularNames: { en: 'Fenugreek / Methi', hi: 'मेथी (Methi)', mr: 'मेथी (Methi)' },
    scientificName: 'Trigonella foenum-graecum',
    category: 'Herbs',
    description: {
      en: 'Aromatic medicinal legume; harvested as microgreens, tender culinary greens, or dried seeds with proven digestive benefits.',
      hi: 'सुगंधित और औषधीय देसी कसूरी मेथी, साग और बीजों दोनों के लिए अत्यंत उपयोगी।',
      mr: 'सुवासिक लहान पानांची गावरान मेथी, रुचकर भाजी आणि औषधी गुणधर्मांसाठी प्रसिद्ध.',
    },
    packetWeightGrams: 50,
    packetWeightDisplay: '50g (~3,200 seeds)',
    pricePerPacket: 18,
    initialStock: 110,
    availableStock: 92,
    totalPurchased: 12,
    totalBorrowed: 6,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Rabi (Oct-Feb) / Year-round for microgreens',
    germinationPeriod: '3 - 5 Days',
    harvestPeriod: '25 - 30 Days (greens) / 90 Days (seeds)',
    sunlight: 'Full sun to light shade',
    soilRequirements: 'Fertile loamy soil with good drainage (pH 6.0 - 7.0)',
    watering: 'Light sprinkling every 2-3 days',
    growingInstructions: 'Broadcast seeds closely on well-manured beds and cover lightly with 1cm soil. Fast germinating.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsN4eOd4BGWJ8II02j6kxQXjgWbvUK-UyAFozNj62KE5C4UKStrOd-FnZ1&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Coriander',
    vernacularNames: { en: 'Coriander / Dhaniya', hi: 'धनिया (Dhaniya)', mr: 'कोथिंबीर (Kothimbir)' },
    scientificName: 'Coriandrum sativum',
    category: 'Herbs',
    description: {
      en: 'Intensely fragrant traditional small-leaf coriander variety with multi-cut ability and bold citrus aromatic foliage.',
      hi: 'तीव्र सुगंध वाला देसी धनिया, कई बार कटाई देने वाला और हर भारतीय व्यंजन की जान।',
      mr: 'सुवासिक गावरान कोथिंबीर, दाट पाने आणि अप्रतिम चव देणारे पारंपरिक वाण.',
    },
    packetWeightGrams: 50,
    packetWeightDisplay: '50g (~4,000 seeds)',
    pricePerPacket: 18,
    initialStock: 110,
    availableStock: 89,
    totalPurchased: 15,
    totalBorrowed: 6,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Year-round, best in Winter (Oct - Feb)',
    germinationPeriod: '7 - 12 Days',
    harvestPeriod: '35 - 45 Days',
    sunlight: 'Morning sun, partial afternoon shade in summer',
    soilRequirements: 'Moist, fertile loam rich in worm casting compost',
    watering: 'Gentle misting; avoid overhead flooding',
    growingInstructions: 'Gently crush seeds into two halves before sowing to double germination speed. Sow in rows 15cm apart.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxRQ5yS3S5qTnwWh2aI9b_gl3eNiLlcqWnJdhOlgkYmg&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Chickpea',
    vernacularNames: { en: 'Chickpea / Desi Chana', hi: 'देसी चना (Desi Chana)', mr: 'हरभरा (Harbhara)' },
    scientificName: 'Cicer arietinum',
    category: 'Pulses',
    description: {
      en: 'Nutrient-rich, brown-coated indigenous pulse known for atmospheric nitrogen fixation, drought endurance, and superior taste.',
      hi: 'देसी भूरा चना, जमीन को उपजाऊ बनाने वाला, सूखा प्रतिरोधी और पौष्टिकता से भरपूर।',
      mr: 'गावरान तांबडा हरभरा, जमिनीत नत्र स्थिरीकरण करणारा, कमी पाण्यात येणारा देशी कडधान्य वाण.',
    },
    packetWeightGrams: 100,
    packetWeightDisplay: '100g (~450 seeds)',
    pricePerPacket: 25,
    initialStock: 80,
    availableStock: 68,
    totalPurchased: 7,
    totalBorrowed: 5,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Rabi (Oct - Nov sowing)',
    germinationPeriod: '5 - 8 Days',
    harvestPeriod: '95 - 110 Days',
    sunlight: 'Full Sun',
    soilRequirements: 'Well-drained black cotton soil or sandy clay loam',
    watering: 'Minimal; requires only 1-2 protective irrigations',
    growingInstructions: 'Seed treatment with Rhizobium culture is recommended. Sow 5cm deep in moisture-conserved furrows.',
    imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Green Gram',
    vernacularNames: { en: 'Green Gram / Moong', hi: 'मूंग (Moong)', mr: 'मूग (Moog)' },
    scientificName: 'Vigna radiata',
    category: 'Pulses',
    description: {
      en: 'Quick 60-day short-duration pulse, bright green seeds, highly digestible protein source, perfect for village catch-cropping.',
      hi: '60 दिनों में पकने वाली देशी हरी मूंग, उच्च प्रोटीन और भूमि सुधारक दलहन फसल।',
      mr: 'अल्पावधीत ६० दिवसात येणारा चमकदार हिरवा गावरान मूग, जमिनीची सुपीकता वाढवणारा वाण.',
    },
    packetWeightGrams: 75,
    packetWeightDisplay: '75g (~1,800 seeds)',
    pricePerPacket: 22,
    initialStock: 80,
    availableStock: 67,
    totalPurchased: 8,
    totalBorrowed: 5,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif / Summer catch crop',
    germinationPeriod: '3 - 6 Days',
    harvestPeriod: '60 - 70 Days',
    sunlight: 'Full Sun',
    soilRequirements: 'Fertile loams with good natural drainage',
    watering: '1 to 2 irrigations during flowering and pod development',
    growingInstructions: 'Direct line-sow at 30x10cm spacing. Pick mature brown pods in 2-3 flushes.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHTCpDaoQj0ES8hnCK4q6k3t9CojfzVAKds9pvXLB4qw&s=10',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Maize',
    vernacularNames: { en: 'Maize / Corn', hi: 'मक्का (Makka)', mr: 'मका (Maka)' },
    scientificName: 'Zea mays',
    category: 'Grains',
    description: {
      en: 'Sturdy traditional flint corn variety producing golden cobs with tight husks naturally resistant to earworms and drought.',
      hi: 'देसी पीली मक्का, मजबूत तने वाली, सुगन्धित भुट्टे और सूखा सहने वाली मजबूत अनाज किस्म।',
      mr: 'गावरान पिवळी मका, टणक दाणे, उत्कृष्ट चारा आणि दुष्काळातही तग धरणारे धान्य वाण.',
    },
    packetWeightGrams: 75,
    packetWeightDisplay: '75g (~300 seeds)',
    pricePerPacket: 20,
    initialStock: 60,
    availableStock: 50,
    totalPurchased: 6,
    totalBorrowed: 4,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif (June-July) / Rabi (Oct-Nov)',
    germinationPeriod: '4 - 7 Days',
    harvestPeriod: '85 - 100 Days',
    sunlight: 'Full intense sun',
    soilRequirements: 'Deep, rich, fertile silt or clay loams with neutral pH',
    watering: 'Ensure adequate moisture at tasseling and silking stages',
    growingInstructions: 'Plant in blocks of at least 4 rows rather than a single long row to ensure complete wind pollination.',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
  {
    name: 'Sunflower',
    vernacularNames: { en: 'Sunflower', hi: 'सूरजमुखी (Surajmukhi)', mr: 'सूर्यफूल (Suryaphool)' },
    scientificName: 'Helianthus annuus',
    category: 'Flowers',
    description: {
      en: 'Magnificent golden blooms that attract essential pollinators, improve farm biodiversity, and yield nutritious oil-rich seeds.',
      hi: 'मधुमक्खियों और परागणकों को आकर्षित करने वाला, खूबसूरत और तेल से भरपूर देसी सूरजमुखी।',
      mr: 'परागीभवनास मदत करणारे, शेताची शोभा वाढवणारे आणि तेलबिया देणारे गावरान सूर्यफूल वाण.',
    },
    packetWeightGrams: 5.625, // 80 packets * 5.625g = 450g -> Totals exactly 51.05 kg combined weight!
    packetWeightDisplay: '5.6g (~100 seeds)',
    pricePerPacket: 20,
    initialStock: 80,
    availableStock: 68,
    totalPurchased: 8,
    totalBorrowed: 4,
    totalReturned: 0,
    totalDeposited: 0,
    growingSeason: 'Kharif / Rabi / Spring',
    germinationPeriod: '6 - 10 Days',
    harvestPeriod: '80 - 95 Days',
    sunlight: 'Full Sun (requires 6-8 hrs direct sunlight)',
    soilRequirements: 'Tolerant of various soils; prefers well-drained fertile loam',
    watering: 'Water deeply once a week; drought resistant once established',
    growingInstructions: 'Sow along field borders or garden peripheries to act as a natural beneficial insect magnet.',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
    lowStockThreshold: 15,
    isHeritageVariety: true,
  },
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seed_vault';
    console.log(`[Seed Script] Connecting to database at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('[Seed Script] Connected to MongoDB.');

    // Clear existing collections
    console.log('[Seed Script] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Seed.deleteMany({}),
      Purchase.deleteMany({}),
      BorrowRequest.deleteMany({}),
      Return.deleteMany({}),
      SeedDeposit.deleteMany({}),
      GardenEntry.deleteMany({}),
      Notification.deleteMany({}),
      Feedback.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    // 1. Create Default Users (Admin, Librarian, Farmer)
    console.log('[Seed Script] Creating demonstration user accounts...');

    // We save individually so user pre-save hook hashes passwords
    const adminUser = new User({
      fullName: 'Dr. Rameshwar Patil (Agri Officer)',
      email: 'admin@seedvault.org',
      phone: '9876543210',
      password: 'Admin@123',
      villageCity: 'Ralegan Siddhi',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      role: 'admin',
      guardianPoints: 350,
      badges: [
        { id: 'master_horticulturist', title: 'Master Cultivator', icon: 'Sparkles', description: 'Agricultural Officer and Seed Bank Director' },
        { id: 'heritage_depositor', title: 'Heritage Preserver', icon: 'Crown', description: 'Preserved 15 village landraces' },
      ],
    });
    await adminUser.save();

    const librarianUser = new User({
      fullName: 'Sunita Deshmukh',
      email: 'librarian@seedvault.org',
      phone: '9876543211',
      password: 'Librarian@123',
      villageCity: 'Ralegan Siddhi',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      role: 'librarian',
      guardianPoints: 210,
      badges: [
        { id: 'new_sower', title: 'New Sower', icon: 'Sprout', description: 'Joined the community' },
        { id: 'guardian_returner', title: 'Seed Guardian', icon: 'ShieldCheck', description: 'Verified over 50 village seed returns' },
      ],
    });
    await librarianUser.save();

    const farmerUser = new User({
      fullName: 'Tukaram Shinde',
      email: 'farmer@seedvault.org',
      phone: '9876543212',
      password: 'Farmer@123',
      villageCity: 'Ralegan Siddhi',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      role: 'farmer',
      guardianPoints: 185,
      badges: [
        { id: 'new_sower', title: 'New Sower', icon: 'Sprout', description: 'Registered member' },
        { id: 'guardian_returner', title: 'Seed Guardian', icon: 'ShieldCheck', description: 'Returned viable seeds on time' },
        { id: 'heritage_depositor', title: 'Heritage Preserver', icon: 'Crown', description: 'Contributed heirloom okra seeds' },
      ],
    });
    await farmerUser.save();

    console.log('[Seed Script] Created default users:');
    console.log(' - Admin: admin@seedvault.org / Admin@123');
    console.log(' - Librarian: librarian@seedvault.org / Librarian@123');
    console.log(' - Farmer: farmer@seedvault.org / Farmer@123');

    // 2. Insert 15 Seed Varieties
    console.log('[Seed Script] Inserting 15 seed varieties...');
    const insertedSeeds = await Seed.insertMany(SEED_VARIETIES);

    let totalInitialPackets = 0;
    let totalWeightKg = 0;
    insertedSeeds.forEach((s) => {
      totalInitialPackets += s.initialStock;
      totalWeightKg += (s.initialStock * s.packetWeightGrams) / 1000;
    });

    console.log(`[Seed Script] Successfully seeded ${insertedSeeds.length} varieties!`);
    console.log(`[Seed Script] Total Initial Stock: ${totalInitialPackets} packets (Expected: 1,440)`);
    console.log(`[Seed Script] Total Combined Seed Weight: ${totalWeightKg.toFixed(2)} kg (Expected: 51.05 kg)`);

    // 3. Create Sample Activity Logs
    console.log('[Seed Script] Creating initial demonstration activity logs...');
    await ActivityLog.create([
      {
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        activityType: 'STOCK_UPDATE',
        description: 'Initialized 15 indigenous heritage seed varieties into the library catalog (1,440 packets total)',
        status: 'Success',
      },
      {
        user: farmerUser._id,
        userName: farmerUser.fullName,
        userRole: farmerUser.role,
        activityType: 'USER_REGISTRATION',
        description: 'Registered new farmer account from Ralegan Siddhi, Ahmednagar',
        status: 'Success',
      },
      {
        user: farmerUser._id,
        userName: farmerUser.fullName,
        userRole: farmerUser.role,
        activityType: 'BORROW_REQUEST',
        description: 'Submitted seasonal borrow request for 2 packets of Gaothan Tomato and 1 packet of Okra',
        status: 'Pending',
      },
    ]);

    // 4. Create Sample Garden Entry for Demo Farmer
    const tomatoSeed = insertedSeeds.find((s) => s.name === 'Tomato');
    const okraSeed = insertedSeeds.find((s) => s.name === 'Okra');

    if (tomatoSeed) {
      await GardenEntry.create({
        user: farmerUser._id,
        seed: tomatoSeed._id,
        seedName: tomatoSeed.name,
        varietyName: 'Ralegan Gaothan Desi Tomato',
        plotLocation: 'East Field Bed #2',
        plantingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
        expectedHarvestDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        stage: 'Flowering',
        progressPercent: 75,
        healthStatus: 'Thriving',
        notes: 'Drip irrigated with cow dung slurry liquid fertilizer. Flowers blooming heavily.',
      });
    }

    if (okraSeed) {
      await GardenEntry.create({
        user: farmerUser._id,
        seed: okraSeed._id,
        seedName: okraSeed.name,
        varietyName: 'Indore Green Heirloom Bhendi',
        plotLocation: 'Kitchen Garden Raised Bed',
        plantingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        expectedHarvestDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        stage: 'Seedling',
        progressPercent: 40,
        healthStatus: 'Healthy',
        notes: 'Mulched with dry straw to prevent moisture evaporation.',
      });
    }

    // 5. Create Sample Borrow Request for Demo Farmer
    if (tomatoSeed) {
      const borrowDueDate = new Date();
      borrowDueDate.setDate(borrowDueDate.getDate() + 45); // Due in 45 days

      await BorrowRequest.create({
        user: farmerUser._id,
        borrowNumber: 'SV-BOR-100248-732',
        items: [
          {
            seed: tomatoSeed._id,
            seedName: tomatoSeed.name,
            quantity: 2,
            packetWeightGrams: tomatoSeed.packetWeightGrams,
          },
        ],
        totalQuantity: 2,
        purpose: 'Seasonal field multiplication and village landrace preservation',
        status: 'Borrowed',
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        returnDueDate: borrowDueDate,
        reviewedBy: librarianUser._id,
        reviewNotes: 'Approved for Kharif village demonstration trial.',
        reviewedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      });
    }

    // 6. Create Initial Notifications for Demo Farmer
    await Notification.create([
      {
        user: farmerUser._id,
        title: 'Welcome to Seed Vault! 🌱',
        message: 'Namaste Tukaram Shinde! Your farmer membership is active with 185 Seed Guardian Points.',
        type: 'points',
      },
      {
        user: farmerUser._id,
        title: 'Return Reminder: Tomato Seeds 🍅',
        message: 'Your borrowed Gaothan Tomato seeds have reached the flowering stage. Please remember to harvest and clean seeds for library replenishment after maturity.',
        type: 'borrow',
        link: '/borrows',
      },
    ]);

    // 7. Create Sample Community Feedback
    await Feedback.create({
      user: farmerUser._id,
      userName: farmerUser.fullName,
      overallRating: 5,
      seedQualityRating: 5,
      platformExperienceRating: 5,
      comment: 'The traditional tomato seeds had a 95% germination rate in my field! Thank you Seed Vault for keeping our indigenous seeds alive.',
      suggestions: 'Please organize a seed exchange fair before the upcoming Rabi sowing season.',
      adminReply: 'Thank you Tukaram ji! We are planning a community seed mela next month at the Panchayat hall.',
      repliedAt: new Date(),
      repliedBy: adminUser._id,
    });

    console.log('[Seed Script] All demonstration data successfully seeded!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedDB();

