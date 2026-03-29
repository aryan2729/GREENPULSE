export interface Park {
  id: string; name: string; lat: number; lng: number;
  area: string; zone: string;
  crowd: 'low' | 'medium' | 'high'; crowdPct: number;
  aqi: number; aqiLabel: string;
  comfortIndex: number; safetyScore: number;
  childFriendly: boolean; womenSafe: boolean; accessible: boolean;
  plants: string[]; amenities: string[];
  openTime: string; closeTime: string;
  description: string; image: string;
  rating: number; reviews: number; area_hectares: number;
  darkZones: boolean; nearbyParks: string[];
  crowdHistory: { time: string; value: number }[];
  aqiHistory: { time: string; value: number }[];
  weeklyVisits: { day: string; value: number }[];
}

export interface Plant {
  id: string; name: string; scientific: string;
  benefits: string; icon: string; funFact: string;
  category: string; co2_per_year_kg: number;
  medicinal: boolean; endemic: boolean;
}

export const parks: Park[] = [
  {
    id:'p1', name:'Lodhi Garden', lat:28.5932, lng:77.2196,
    area:'Lodhi Colony', zone:'South Delhi',
    crowd:'low', crowdPct:22, aqi:48, aqiLabel:'Good',
    comfortIndex:82, safetyScore:91,
    childFriendly:true, womenSafe:true, accessible:true,
    plants:['Bougainvillea','Ashoka Tree','Marigold','Neem','Banana Palm','Gulmohar'],
    amenities:['Parking','Restrooms','Water Points','Seating','Jogging Track','24x7 Security','First Aid'],
    openTime:'06:00', closeTime:'20:00',
    description:"One of Delhi's most iconic gardens spanning 90 acres with 15th-century Mughal tombs, over 50 species of birds, and 100+ tree species. A serene retreat in the heart of the city.",
    image:'🌳', rating:4.7, reviews:2340, area_hectares:36, darkZones:false, nearbyParks:['p5'],
    crowdHistory:[{time:'6am',value:15},{time:'8am',value:62},{time:'10am',value:45},{time:'12pm',value:28},{time:'2pm',value:18},{time:'4pm',value:35},{time:'6pm',value:71},{time:'8pm',value:30}],
    aqiHistory:[{time:'6am',value:42},{time:'8am',value:55},{time:'10am',value:48},{time:'12pm',value:52},{time:'2pm',value:58},{time:'4pm',value:50},{time:'6pm',value:45},{time:'8pm',value:48}],
    weeklyVisits:[{day:'Mon',value:1200},{day:'Tue',value:980},{day:'Wed',value:1100},{day:'Thu',value:1050},{day:'Fri',value:1400},{day:'Sat',value:2200},{day:'Sun',value:2100}],
  },
  {
    // Nehru Park (Chanakyapuri) — corrected coordinates
    id:'p2', name:'Nehru Park', lat:28.6023, lng:77.1869,
    area:'Chanakyapuri', zone:'Central Delhi',
    crowd:'medium', crowdPct:58, aqi:72, aqiLabel:'Moderate',
    comfortIndex:67, safetyScore:78,
    childFriendly:true, womenSafe:true, accessible:false,
    plants:['Gulmohar','Jamun','Peepal','Tulsi','Rose','Hibiscus'],
    amenities:['Parking','Restrooms','Canteen','Children Play Area','Security','Open Gym'],
    openTime:'05:00', closeTime:'21:00',
    description:'Large 80-acre garden popular for morning walks, cultural events, and family outings. Known for its well-maintained lawns and diverse tree cover.',
    image:'🌿', rating:4.3, reviews:1820, area_hectares:80, darkZones:false, nearbyParks:['p1'],
    crowdHistory:[{time:'6am',value:35},{time:'8am',value:75},{time:'10am',value:58},{time:'12pm',value:45},{time:'2pm',value:30},{time:'4pm',value:55},{time:'6pm',value:82},{time:'8pm',value:40}],
    aqiHistory:[{time:'6am',value:60},{time:'8am',value:75},{time:'10am',value:72},{time:'12pm',value:80},{time:'2pm',value:85},{time:'4pm',value:78},{time:'6pm',value:70},{time:'8pm',value:68}],
    weeklyVisits:[{day:'Mon',value:800},{day:'Tue',value:750},{day:'Wed',value:900},{day:'Thu',value:820},{day:'Fri',value:1100},{day:'Sat',value:1800},{day:'Sun',value:1700}],
  },
  {
    // Deer Park (Hauz Khas) — corrected coordinates
    id:'p3', name:'Deer Park', lat:28.5536, lng:77.1918,
    area:'Hauz Khas', zone:'South Delhi',
    crowd:'high', crowdPct:84, aqi:95, aqiLabel:'Unhealthy for Sensitive Groups',
    comfortIndex:51, safetyScore:72,
    childFriendly:true, womenSafe:false, accessible:false,
    plants:['Eucalyptus','Banyan','Mango','Coconut Palm','Bamboo'],
    amenities:['Parking','Restrooms','Deer Enclosure','Jogging Track','Rabbit Enclosure'],
    openTime:'05:30', closeTime:'20:00',
    description:'Famous for its deer and rabbit enclosure, adjacent to Hauz Khas lake. Popular with students and young visitors from the nearby village.',
    image:'🦌', rating:4.1, reviews:3100, area_hectares:50, darkZones:true, nearbyParks:['p5','p1'],
    crowdHistory:[{time:'6am',value:50},{time:'8am',value:88},{time:'10am',value:70},{time:'12pm',value:60},{time:'2pm',value:45},{time:'4pm',value:72},{time:'6pm',value:90},{time:'8pm',value:65}],
    aqiHistory:[{time:'6am',value:80},{time:'8am',value:98},{time:'10am',value:95},{time:'12pm',value:100},{time:'2pm',value:102},{time:'4pm',value:98},{time:'6pm',value:90},{time:'8pm',value:88}],
    weeklyVisits:[{day:'Mon',value:1500},{day:'Tue',value:1300},{day:'Wed',value:1600},{day:'Thu',value:1450},{day:'Fri',value:1900},{day:'Sat',value:3200},{day:'Sun',value:3100}],
  },
  {
    // Sanjay Lake (Trilokpuri/Mayur Vihar) — corrected coordinates
    id:'p4', name:'Sanjay Lake Park', lat:28.6137, lng:77.3089,
    area:'East Delhi', zone:'East Delhi',
    crowd:'low', crowdPct:18, aqi:62, aqiLabel:'Moderate',
    comfortIndex:74, safetyScore:68,
    childFriendly:false, womenSafe:false, accessible:true,
    plants:['Lotus','Water Hyacinth','Reed Grass','Papyrus','Willow'],
    amenities:['Boating','Restrooms','Seating','Bird Watching Deck'],
    openTime:'06:00', closeTime:'19:00',
    description:'A tranquil wetland park surrounding a 25-acre lake, ideal for bird watching with 80+ species recorded. Features boating and nature trails.',
    image:'🌊', rating:3.9, reviews:890, area_hectares:40, darkZones:true, nearbyParks:[],
    crowdHistory:[{time:'6am',value:20},{time:'8am',value:38},{time:'10am',value:25},{time:'12pm',value:18},{time:'2pm',value:12},{time:'4pm',value:22},{time:'6pm',value:40},{time:'8pm',value:15}],
    aqiHistory:[{time:'6am',value:55},{time:'8am',value:65},{time:'10am',value:62},{time:'12pm',value:68},{time:'2pm',value:70},{time:'4pm',value:65},{time:'6pm',value:60},{time:'8pm',value:58}],
    weeklyVisits:[{day:'Mon',value:300},{day:'Tue',value:280},{day:'Wed',value:320},{day:'Thu',value:290},{day:'Fri',value:400},{day:'Sat',value:750},{day:'Sun',value:720}],
  },
  {
    // Garden of Five Senses (Saket) — corrected coordinates
    id:'p5', name:'Garden of Five Senses', lat:28.5139, lng:77.1979,
    area:'Saiyad ul Ajaib', zone:'South Delhi',
    crowd:'medium', crowdPct:44, aqi:55, aqiLabel:'Good',
    comfortIndex:79, safetyScore:88,
    childFriendly:true, womenSafe:true, accessible:true,
    plants:['Jasmine','Lavender','Mint','Lemon Grass','Bamboo','Cactus','Butterfly Bush'],
    amenities:['Parking','Café','Art Installations','Amphitheater','24x7 Security','Water','Gift Shop'],
    openTime:'09:00', closeTime:'19:00',
    description:'Award-winning 20-acre themed garden designed to engage all five senses, with fragrant herb gardens, textured pathways, open-air amphitheater, and art installations.',
    image:'🌸', rating:4.5, reviews:2750, area_hectares:20, darkZones:false, nearbyParks:['p1','p3'],
    crowdHistory:[{time:'9am',value:25},{time:'10am',value:40},{time:'11am',value:52},{time:'12pm',value:58},{time:'2pm',value:45},{time:'4pm',value:60},{time:'6pm',value:50},{time:'7pm',value:30}],
    aqiHistory:[{time:'9am',value:48},{time:'10am',value:52},{time:'11am',value:55},{time:'12pm',value:58},{time:'2pm',value:60},{time:'4pm',value:55},{time:'6pm',value:50},{time:'7pm',value:48}],
    weeklyVisits:[{day:'Mon',value:600},{day:'Tue',value:550},{day:'Wed',value:700},{day:'Thu',value:650},{day:'Fri',value:900},{day:'Sat',value:1600},{day:'Sun',value:1550}],
  },
  {
    // Central Park (Rajouri Garden) — corrected coordinates
    id:'p6', name:'Central Park Rajouri', lat:28.6418, lng:77.1159,
    area:'Rajouri Garden', zone:'West Delhi',
    crowd:'low', crowdPct:31, aqi:88, aqiLabel:'Moderate',
    comfortIndex:63, safetyScore:76,
    childFriendly:true, womenSafe:true, accessible:false,
    plants:['Arjun Tree','Silk Cotton','Drumstick','Hibiscus','Marigold'],
    amenities:['Parking','Outdoor Gym','Children Play Area','Security','Seating'],
    openTime:'05:30', closeTime:'20:30',
    description:"Well-maintained community park with modern outdoor fitness equipment, dedicated children's play zones, and a central fountain. Hub for morning fitness groups.",
    image:'🌱', rating:4.0, reviews:1200, area_hectares:15, darkZones:false, nearbyParks:[],
    crowdHistory:[{time:'6am',value:40},{time:'8am',value:65},{time:'10am',value:35},{time:'12pm',value:20},{time:'2pm',value:15},{time:'4pm',value:38},{time:'6pm',value:68},{time:'8pm',value:45}],
    aqiHistory:[{time:'6am',value:78},{time:'8am',value:90},{time:'10am',value:88},{time:'12pm',value:92},{time:'2pm',value:95},{time:'4pm',value:90},{time:'6pm',value:85},{time:'8pm',value:82}],
    weeklyVisits:[{day:'Mon',value:500},{day:'Tue',value:480},{day:'Wed',value:520},{day:'Thu',value:490},{day:'Fri',value:650},{day:'Sat',value:1100},{day:'Sun',value:1050}],
  },
];

export const plants: Plant[] = [
  { id:'pl1', name:'Neem', scientific:'Azadirachta indica', benefits:'Natural air purifier, antibacterial, reduces PM2.5 by up to 40%', icon:'🌿', funFact:'A single Neem tree absorbs 16kg of CO₂/year and purifies air in a 100m radius!', category:'Tree', co2_per_year_kg:16, medicinal:true, endemic:false },
  { id:'pl2', name:'Bougainvillea', scientific:'Bougainvillea spectabilis', benefits:'Reduces noise pollution by 10dB, drought-resistant, minimal water needs', icon:'🌸', funFact:"What look like petals are actually coloured bracts — the real flower is tiny and white inside!", category:'Shrub', co2_per_year_kg:4, medicinal:false, endemic:false },
  { id:'pl3', name:'Ashoka Tree', scientific:'Saraca asoca', benefits:'Dense canopy reduces urban heat, excellent air purifier, sacred in Indian culture', icon:'🌳', funFact:'Mentioned in Ramayana — Sita took shelter under an Ashoka tree in Lanka.', category:'Tree', co2_per_year_kg:12, medicinal:true, endemic:true },
  { id:'pl4', name:'Tulsi', scientific:'Ocimum tenuiflorum', benefits:'Releases oxygen 24 hours/day, powerful antibacterial, repels mosquitoes', icon:'🌱', funFact:'Tulsi is one of the few plants that releases oxygen even at night!', category:'Herb', co2_per_year_kg:1, medicinal:true, endemic:true },
  { id:'pl5', name:'Gulmohar', scientific:'Delonix regia', benefits:'Wide canopy reduces urban heat island, supports 100+ insect species', icon:'🌺', funFact:'Blazing orange-red flowers signal Delhi summer — they bloom for just 3 spectacular weeks.', category:'Tree', co2_per_year_kg:18, medicinal:false, endemic:false },
  { id:'pl6', name:'Bamboo', scientific:'Bambusoideae', benefits:'Fastest growing plant on Earth, sequesters 35% more CO₂ than equivalent trees', icon:'🎋', funFact:'Some bamboo species grow up to 91cm (3 feet!) per day — you can literally watch it grow.', category:'Grass', co2_per_year_kg:12, medicinal:false, endemic:false },
  { id:'pl7', name:'Peepal', scientific:'Ficus religiosa', benefits:'Releases oxygen round the clock, massive CO₂ absorption, hosts 50+ bird species', icon:'🍃', funFact:'The Peepal tree under which Buddha attained enlightenment is called the Bodhi Tree.', category:'Tree', co2_per_year_kg:22, medicinal:true, endemic:true },
  { id:'pl8', name:'Jasmine', scientific:'Jasminum officinale', benefits:'Natural stress reducer, fragrance proven to lower anxiety by 30%', icon:'⚪', funFact:'Jasmine fragrance has been scientifically shown to have calming effects comparable to mild sedatives!', category:'Shrub', co2_per_year_kg:2, medicinal:true, endemic:false },
  { id:'pl9', name:'Banyan', scientific:'Ficus benghalensis', benefits:'National tree of India, single tree can cover 2+ acres, cools area by 5°C', icon:'🌲', funFact:"The Great Banyan in Kolkata is 250+ years old and covers 1.5 hectares — bigger than a football stadium!", category:'Tree', co2_per_year_kg:25, medicinal:true, endemic:true },
  { id:'pl10', name:'Lotus', scientific:'Nelumbo nucifera', benefits:'National flower, purifies water naturally, removes heavy metals from ponds', icon:'🪷', funFact:'Lotus seeds can remain viable for over 1,300 years — the oldest germinated seed was 1,300 years old!', category:'Aquatic', co2_per_year_kg:3, medicinal:true, endemic:false },
];

export const challenges = [
  { id:'c1', title:'Park Explorer', desc:'Visit 3 different parks this week', pts:150, icon:'🗺️', progress:1, total:3, category:'explore' },
  { id:'c2', title:'Eco Walker', desc:'Walk 5km across parks this month', pts:200, icon:'👣', progress:3.2, total:5, category:'fitness' },
  { id:'c3', title:'Nature Spotter', desc:'Identify 5 plant species via QR scan', pts:100, icon:'🔍', progress:2, total:5, category:'nature' },
  { id:'c4', title:'Community Hero', desc:'Report 2 park issues this week', pts:120, icon:'🛡️', progress:0, total:2, category:'community' },
  { id:'c5', title:'Early Bird', desc:'Visit a park before 7am on 3 days', pts:180, icon:'🌅', progress:1, total:3, category:'fitness' },
  { id:'c6', title:'Photo Naturalist', desc:'Submit 3 photos of wildlife or plants', pts:90, icon:'📸', progress:0, total:3, category:'nature' },
  { id:'c7', title:'Green Champion', desc:'Earn 500 points in a single week', pts:250, icon:'🏆', progress:340, total:500, category:'special' },
];

export const leaderboard = [
  { rank:1, alias:'EcoCitizen_4821', pts:2840, badge:'🏆', level:'Forest Guardian', parksVisited:6 },
  { rank:2, alias:'GreenUser_7732', pts:2610, badge:'🥈', level:'Forest Guardian', parksVisited:5 },
  { rank:3, alias:'NatureWalker_19', pts:2455, badge:'🥉', level:'Tree', parksVisited:5 },
  { rank:4, alias:'ParkHero_5523', pts:2100, badge:'🌿', level:'Tree', parksVisited:4 },
  { rank:5, alias:'DelhiGreen_88', pts:1950, badge:'🌿', level:'Tree', parksVisited:4 },
  { rank:6, alias:'EcoGuard_3310', pts:1820, badge:'🌿', level:'Sapling', parksVisited:3 },
  { rank:7, alias:'TreeLover_671', pts:1740, badge:'🌿', level:'Sapling', parksVisited:3 },
  { rank:8, alias:'ForestFriend_22', pts:1580, badge:'🌿', level:'Sapling', parksVisited:2 },
  { rank:9, alias:'GreenPulse_99', pts:1320, badge:'🌿', level:'Seedling', parksVisited:2 },
  { rank:10, alias:'ParkLover_451', pts:1100, badge:'🌿', level:'Seedling', parksVisited:1 },
];

export const communityPosts = [
  { id:'post1', alias:'NatureWalker_19', park:'Lodhi Garden', type:'photo', content:'Spotted a kingfisher at the pond this morning! 🐦 Best 6am decision ever.', likes:42, time:'2h ago', verified:false },
  { id:'post2', alias:'EcoCitizen_4821', park:'Garden of Five Senses', type:'tip', content:'The jasmine walk between gates 2 and 3 is absolutely breathtaking right now. Go after 4pm for the fragrance!', likes:89, time:'4h ago', verified:false },
  { id:'post3', alias:'Anonymous User', park:'Deer Park', type:'report', content:'Broken bench near south entrance — someone could trip. Reported to admin.', likes:15, time:'6h ago', verified:true },
  { id:'post4', alias:'GreenUser_7732', park:'Nehru Park', type:'event', content:'Morning yoga group meets every day at 7am near the central fountain. All welcome! Bring a mat.', likes:67, time:'1d ago', verified:false },
  { id:'post5', alias:'ParkHero_5523', park:'Central Park Rajouri', type:'tip', content:'The outdoor gym equipment was just serviced — cables are new and everything works perfectly now!', likes:33, time:'1d ago', verified:false },
];

export const adminStats = {
  totalVisits:14820, activeParks:6, reportsToday:12,
  avgAqi:70, safetyAlerts:3, totalUsers:8420, avgComfort:69,
  parkScores:[
    {park:'Lodhi Garden',score:91,visits:3200},
    {park:'Garden of 5 Senses',score:88,visits:1550},
    {park:'Nehru Park',score:78,visits:1700},
    {park:'Central Park',score:76,visits:1050},
    {park:'Deer Park',score:72,visits:3100},
    {park:'Sanjay Lake',score:68,visits:720},
  ],
  visitTrend:[
    {day:'Mon',visits:2100},{day:'Tue',visits:1800},{day:'Wed',visits:2400},
    {day:'Thu',visits:2200},{day:'Fri',visits:2800},{day:'Sat',visits:3400},{day:'Sun',visits:3200},
  ],
  aqiTrend:[
    {day:'Mon',aqi:68},{day:'Tue',aqi:72},{day:'Wed',aqi:65},
    {day:'Thu',aqi:75},{day:'Fri',aqi:80},{day:'Sat',aqi:70},{day:'Sun',aqi:67},
  ],
  aiSuggestions:[
    {park:'Deer Park',type:'safety',priority:'high',msg:'Install 4 additional solar lights in north zone — dark spots detected after 6:30pm via CCTV analysis',impact:'High'},
    {park:'Sanjay Lake',type:'safety',priority:'high',msg:'Low crowd density on south path after sunset — increase security patrol from 2h to 30min intervals',impact:'High'},
    {park:'Nehru Park',type:'infra',priority:'medium',msg:'Add 8 benches in Zone B — peak usage with zero seating detected for 3h daily',impact:'Medium'},
    {park:'Central Park',type:'environment',priority:'low',msg:'Water usage inefficient in Zone C — soil sensors show over-irrigation by 40%',impact:'Low'},
    {park:'Deer Park',type:'environment',priority:'medium',msg:'AQI consistently above 90 near vehicle entrance. Plant 20 Neem trees along boundary wall.',impact:'Medium'},
  ],
  hourlyAqi:[
    {h:'12am',v:52},{h:'2am',v:48},{h:'4am',v:45},{h:'6am',v:58},{h:'8am',v:72},
    {h:'10am',v:68},{h:'12pm',v:74},{h:'2pm',v:78},{h:'4pm',v:75},{h:'6pm',v:70},
    {h:'8pm',v:65},{h:'10pm',v:58},
  ],
};
