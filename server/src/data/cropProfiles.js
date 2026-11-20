// Agronomic Crop Profiles citing Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (PJTSAU & ANGRAU)

export const CROP_PROFILES = {
  "tomato": {
    id: "tomato",
    name: "Tomato (Tamatar / టమాటా)",
    scientificName: "Solanum lycopersicum",
    category: "Solanaceous Vegetable",
    growingSeason: "Kharif (June–Oct), Rabi (Oct–March), and Zaid / Summer (Jan–May)",
    durationDays: "100–120 days",
    soilConsiderations: "Deep, well-drained fertile loamy soils with pH 6.0–7.0. Sensitive to waterlogging.",
    growthStages: [
      { stage: "Nursery / Seedling", days: "0–25 days", care: "Maintain light moisture, shield from direct harsh afternoon sun, treat with Trichoderma viride." },
      { stage: "Transplanting & Vegetative", days: "25–50 days", care: "Ensure 60x45cm spacing, apply recommended NPK baseline, stake indeterminate varieties." },
      { stage: "Flowering & Fruit Setting", days: "50–75 days", care: "Critical water stage. Avoid moisture stress to prevent blossom end rot (calcium deficiency)." },
      { stage: "Fruit Maturation & Harvest", days: "75–120 days", care: "Harvest at breaker stage for distant transit or ripe red stage for local mandi." }
    ],
    waterRequirements: "400–600 mm. Drip irrigation recommended every 2–3 days. Avoid flood irrigation to curb root rot.",
    commonPests: [
      { name: "Fruit Borer (Helicoverpa armigera)", symptom: "Bore holes in fruits with excreta", control: "Pheromone traps (5/acre), Neem oil 1500 ppm, or approved bio-agents." },
      { name: "Whitefly & Aphids", symptom: "Leaf curling, honey dew secretion, viral transmission", control: "Yellow sticky traps (10/acre), Imidacloprid as per agronomic guidelines." },
      { name: "Leaf Miner", symptom: "Serpentine white mines inside leaf tissue", control: "Prompt removal of affected foliage, NSKE 5% spray." }
    ],
    commonDiseases: [
      { name: "Early Blight (Alternaria solani)", symptom: "Concentric rings ('target board' spots) on lower leaves", control: "Mancozeb or Copper Oxychloride spray upon first appearance." },
      { name: "Late Blight (Phytophthora infestans)", symptom: "Water-soaked dark lesions during cool humid spells", control: "Systemic fungicides (Cymoxanil + Mancozeb), avoid overhead wetting." },
      { name: "Tomato Leaf Curl Virus (ToLCV)", symptom: "Upward curling, puckering, stunted growth", control: "Vector (whitefly) management; use resistant hybrids." }
    ],
    harvestPeriod: "Starts 70–80 days after transplanting. 6–8 pickings over 4–6 weeks.",
    storageConsiderations: "Mature green tomatoes store 14–21 days at 12–15°C (85–90% RH). Ripe tomatoes store 4–7 days at 8–10°C. Never store below 10°C to avoid chilling injury.",
    marketInformation: "High price volatility. Major national benchmarks: Madanapalle (AP), Kolar (KA), Pimpalgaon (MH). Peak price spikes correlate with heavy monsoon washouts.",
    source: "ICAR-Indian Institute of Horticultural Research (IIHR) & PJTSAU"
  },
  "onion": {
    id: "onion",
    name: "Onion (Pyaaz / ఉల్లిపాయ)",
    scientificName: "Allium cepa",
    category: "Alliaceae Bulb",
    growingSeason: "Kharif, Late Kharif, and Rabi (predominant, 65% of national output)",
    durationDays: "120–150 days",
    soilConsiderations: "Friable sandy loam to clay loam rich in organic matter. Optimal pH 6.5–7.5.",
    growthStages: [
      { stage: "Nursery", days: "0–45 days", care: "Raised beds, regular light irrigations, drench against damping-off." },
      { stage: "Vegetative Growth", days: "45–90 days", care: "Weed control within first 40 days is critical due to shallow roots." },
      { stage: "Bulb Development", days: "90–130 days", care: "Adequate potash application; avoid excessive nitrogen." },
      { stage: "Bulb Maturity & Curing", days: "130–150 days", care: "Withhold irrigation 10–15 days before harvest when 50% tops fall over." }
    ],
    waterRequirements: "350–550 mm. Frequent light irrigations every 7–10 days.",
    commonPests: [
      { name: "Onion Thrips (Thrips tabaci)", symptom: "Silvering/mottling of leaves, dried leaf tips", control: "Blue/Yellow sticky traps, Profenophos or neem-based formulations." }
    ],
    commonDiseases: [
      { name: "Purple Blotch (Alternaria porri)", symptom: "Purple centered lesions on leaves and seed stalks", control: "Chlorothalonil or Mancozeb sprays at 15-day intervals." },
      { name: "Basal Rot (Fusarium oxysporum)", symptom: "Yellowing and rotting at bulb base", control: "Crop rotation, seed bulb treatment with Trichoderma." }
    ],
    harvestPeriod: "Harvest when 50% of plant tops collapse (neck fall). Field curing for 3–5 days followed by shade curing.",
    storageConsiderations: "Rabi onions with thin necks store 4–6 months in well-ventilated bottom-aerated storage structures at 25–30°C and 65–70% RH.",
    marketInformation: "Benchmark market: Lasalgaon APMC (Nashik). High price elasticity influenced by export tariffs and monsoon timing.",
    source: "ICAR-Directorate of Onion and Garlic Research (DOGR)"
  },
  "chilli": {
    id: "chilli",
    name: "Chilli (Mirchi / మిరప)",
    scientificName: "Capsicum annuum",
    category: "Solanaceous Spice / Vegetable",
    growingSeason: "Kharif and Rabi (July–February)",
    durationDays: "150–180 days",
    soilConsiderations: "Well drained black cotton soils, clay loams, or red loamy soils. pH 6.5–7.5.",
    growthStages: [
      { stage: "Nursery", days: "0–35 days", care: "Pro-trays under shade net, seed treatment with Pseudomonas." },
      { stage: "Vegetative", days: "35–70 days", care: "Earthing up, balanced fertigation, monitoring for thrips." },
      { stage: "Flowering & Fruit Set", days: "70–110 days", care: "Maintain consistent moisture; avoid moisture oscillation." },
      { stage: "Pod Ripening & Pickings", days: "110–180 days", care: "Periodic harvesting; sun dry on clean tarpaulins for dry chilli." }
    ],
    waterRequirements: "600–800 mm. Drip fertigation significantly improves capsaicin and pod weight.",
    commonPests: [
      { name: "Black Thrips (Thrips parvispinus)", symptom: "Severe flower drop, feeding scratches, leaf curling", control: "Sticky traps, spinetoram/spinosad rotation, botanical oils." },
      { name: "Yellow Mite (Polyphagotarsonemus latus)", symptom: "Downward curling of young leaves, bronze appearance", control: "Spiromesifen or wettable sulphur." }
    ],
    commonDiseases: [
      { name: "Anthracnose / Dieback (Colletotrichum)", symptom: "Circular sunken spots on ripe pods, dieback of twigs", control: "Azoxystrobin or Difenoconazole spray." },
      { name: "Chilli Leaf Curl Virus (ChiLCV)", symptom: "Upward cupping, stunted bushy leaves", control: "Rigorous vector control (whiteflies)." }
    ],
    harvestPeriod: "Green chillies picked after 75 days; Red ripe pods harvested in 4–5 pickings between Dec–March.",
    storageConsiderations: "Dry chillies are stored in commercial cold storages at 4–6°C and 65% RH to preserve color (ASTA units) and prevent aflatoxin.",
    marketInformation: "Asia's benchmark hub: Guntur Mirchi Yard (AP) and Byadagi (KA). Teja and Byadagi command premium global demand.",
    source: "ANGRAU & ICAR-Indian Institute of Spices Research"
  },
  "cotton": {
    id: "cotton",
    name: "Cotton (Kapas / పత్తి)",
    scientificName: "Gossypium hirsutum",
    category: "Commercial Fiber",
    growingSeason: "Kharif (June/July to Dec/Jan)",
    durationDays: "150–180 days",
    soilConsiderations: "Deep black clay soils (regur) with excellent water retention capacity.",
    growthStages: [
      { stage: "Germination & Square Formation", days: "0–45 days", care: "Gap filling within 10 days, weed eradication." },
      { stage: "Flowering & Boll Formation", days: "45–110 days", care: "Peak moisture & nutrient requirement. Spray 2% DAP or Potassium Nitrate." },
      { stage: "Boll Bursting & Picking", days: "110–180 days", care: "Dry weather required. Pick clean cotton free from trash and yellow bolls." }
    ],
    waterRequirements: "700–1000 mm. Rainfed across Deccan plateau, irrigated in Punjab/Haryana.",
    commonPests: [
      { name: "Pink Bollworm (Pectinophora gossypiella)", symptom: "Rosetted flowers, premature boll opening with stained lint", control: "Pheromone traps (8/acre), ETL-based PB-Rope or approved larvicides." }
    ],
    commonDiseases: [
      { name: "Bacterial Blight / Angular Leaf Spot", symptom: "Water-soaked angular leaf lesions", control: "Copper oxychloride + Streptocycline." }
    ],
    harvestPeriod: "October to January in 3–4 clean pickings.",
    storageConsiderations: "Store seed cotton in covered sheds with <8% moisture to prevent fiber discoloration and seed heating.",
    marketInformation: "Supported by Govt Minimum Support Price (MSP). Key mandis: Warangal (TS), Rajkot (GJ), Adilabad (TS).",
    source: "ICAR-Central Institute for Cotton Research (CICR)"
  },
  "rice": {
    id: "rice",
    name: "Rice / Paddy (Dhan / వరి)",
    scientificName: "Oryza sativa",
    category: "Staple Cereal",
    growingSeason: "Kharif (Sarva) and Rabi (Dalwa)",
    durationDays: "120–140 days",
    soilConsiderations: "Heavy clay or clay loam with impervious subsoil layer to hold water. pH 5.5–7.0.",
    growthStages: [
      { stage: "Nursery & Transplanting", days: "0–30 days", care: "20–25 day old seedlings, 2–3 seedlings per hill." },
      { stage: "Tillering & Panicle Initiation", days: "30–75 days", care: "Maintain 2–5 cm water layer, split nitrogen application." },
      { stage: "Grain Filling & Dough Stage", days: "75–110 days", care: "Critical irrigation; drain water 10 days prior to harvest." }
    ],
    waterRequirements: "1100–1400 mm. AWD (Alternate Wetting & Drying) reduces water usage by 25%.",
    commonPests: [
      { name: "Brown Plant Hopper (BPH)", symptom: "'Hopper burn' circular drying patches in dense canopies", control: "Formation of alleyways (every 2m), Pymetrozine or Triflumezopyrim." },
      { name: "Stem Borer", symptom: "Dead hearts in vegetative stage, White ears in reproductive stage", control: "Cartap hydrochloride or Chlorantraniliprole." }
    ],
    commonDiseases: [
      { name: "Blast (Pyricularia oryzae)", symptom: "Spindle-shaped eye spots on leaves, neck rot", control: "Tricyclazole 75 WP spray." },
      { name: "Sheath Blight", symptom: "Serpentine greenish grey lesions on leaf sheaths", control: "Hexaconazole or Validamycin." }
    ],
    harvestPeriod: "When 80–85% grains turn straw golden. Dry to 14% moisture before bagging.",
    storageConsiderations: "Paddy stored at <13% moisture in dry, rat-proof godowns or hermetic bags for up to 12 months.",
    marketInformation: "Protected by MSP. Key trading hubs: Miryalaguda (TS), Gudivada (AP), Amritsar (PB).",
    source: "ICAR-Indian Institute of Rice Research (IIRR), Hyderabad"
  }
};
