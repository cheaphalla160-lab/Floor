import { HidingSpot, LeaderboardEntry } from '../types/game';

export const HIDING_SPOTS: HidingSpot[] = [
  // Third Floor Spots (3F - Mini Cinema & Film Lounge)
  {
    id: 'spot_3f_cinema_screen',
    name: 'Cinema Screen',
    chineseName: '电影银幕旁',
    floor: 'third_floor',
    x: 26,
    y: 28,
    roomName: 'Mini Cinema (3F)',
    description: 'Next to the animated cartoon screening screen',
  },
  {
    id: 'spot_3f_cinema_seats',
    name: 'Red Cinema Seats',
    chineseName: '电影院红色座椅',
    floor: 'third_floor',
    x: 43,
    y: 38,
    roomName: 'Mini Cinema (3F)',
    description: 'Tucked between the comfy cinema armchairs',
  },
  {
    id: 'spot_3f_projector',
    name: 'Vintage Film Projector',
    chineseName: '老式电影放映机旁',
    floor: 'third_floor',
    x: 55,
    y: 26,
    roomName: 'Projection Nook (3F)',
    description: 'Resting beside the glowing projector lens',
  },
  {
    id: 'spot_3f_reading_lounge',
    name: 'Storybook Bookshelf',
    chineseName: '儿童阅览书架',
    floor: 'third_floor',
    x: 74,
    y: 30,
    roomName: 'Film Studio Lounge (3F)',
    description: 'Peeking from behind the storybooks and art easel',
  },
  {
    id: 'spot_3f_window_table',
    name: 'Sunlit Window Desk',
    chineseName: '阳光窗台工作台',
    floor: 'third_floor',
    x: 87,
    y: 38,
    roomName: 'Film Studio Lounge (3F)',
    description: 'Sitting right beside the bright second-floor window',
  },

  // Second Floor Spots (2F - Theatre Stage & Dressing Room)
  {
    id: 'spot_2f_stage_curtain',
    name: 'Velvet Stage Curtain',
    chineseName: '舞台天鹅绒幕布',
    floor: 'second_floor',
    x: 23,
    y: 65,
    roomName: 'School Stage (2F)',
    description: 'Half hidden behind the grand red theatre curtain',
  },
  {
    id: 'spot_2f_stage_center',
    name: 'Stage Floor Spotlight',
    chineseName: '舞台表演区中央',
    floor: 'second_floor',
    x: 38,
    y: 72,
    roomName: 'School Stage (2F)',
    description: 'Right in the center spotlight of the puppet stage',
  },
  {
    id: 'spot_2f_staircase',
    name: 'Wooden Stair Landing',
    chineseName: '楼梯木扶手旁',
    floor: 'second_floor',
    x: 55,
    y: 69,
    roomName: 'Hallway Stairs (2F)',
    description: 'Resting on the wooden steps between floors',
  },
  {
    id: 'spot_2f_dressing_mirror',
    name: 'Backstage Vanity Mirror',
    chineseName: '后台化妆镜台',
    floor: 'second_floor',
    x: 69,
    y: 68,
    roomName: 'Dressing Room (2F)',
    description: 'Under the warm glowing lightbulbs of the dressing mirror',
  },
  {
    id: 'spot_2f_wardrobe_rack',
    name: 'Costume Wardrobe Rack',
    chineseName: '戏剧服装展示架',
    floor: 'second_floor',
    x: 87,
    y: 73,
    roomName: 'Dressing Room (2F)',
    description: 'Hanging happily among the colorful hats and character costumes',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'rank_1',
    studentName: 'Emma (艾玛)',
    groupName: 'Star Team (红星组)',
    score: 1850,
    itemsFound: 14,
    starsEarned: 42,
    accuracy: 98,
    date: 'Today',
  },
  {
    id: 'rank_2',
    studentName: 'Leo (利奥)',
    groupName: 'Hero Team (小英雄组)',
    score: 1620,
    itemsFound: 12,
    starsEarned: 35,
    accuracy: 95,
    date: 'Today',
  },
  {
    id: 'rank_3',
    studentName: 'Lucas (卢卡斯)',
    groupName: 'Sunshine Team (阳光组)',
    score: 1400,
    itemsFound: 10,
    starsEarned: 29,
    accuracy: 92,
    date: 'Today',
  },
  {
    id: 'rank_4',
    studentName: 'Mia (米娅)',
    groupName: 'Rainbow Team (彩虹组)',
    score: 1250,
    itemsFound: 9,
    starsEarned: 26,
    accuracy: 90,
    date: 'Today',
  },
  {
    id: 'rank_5',
    studentName: 'Amy (艾米)',
    groupName: 'Star Team (红星组)',
    score: 1100,
    itemsFound: 8,
    starsEarned: 24,
    accuracy: 88,
    date: 'Today',
  },
];

export interface FlashcardItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  chinese: string;
  exampleSentence: string;
  exampleTranslation: string;
  teacherTips: string;
  image: string;
}

export const VOCABULARY_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'vocab_costume',
    word: 'costume',
    ipa: '/ˈkɒstjuːm/ 或 /ˈkɑːstuːm/',
    partOfSpeech: 'noun (名词)',
    chinese: '戏服；服装；化装服',
    exampleSentence: 'The magic costume is on the second floor.',
    exampleTranslation: '神奇的戏服在二楼。',
    teacherTips: '【助记妙招】拆分记忆：cost (花费) + ume，在舞台上表演穿的精美服装。注意与 custom (习俗) 区分发音！',
    image: '/src/assets/images/magic_costume_icon_1793024736027.jpg',
  },
  {
    id: 'vocab_film',
    word: 'film',
    ipa: '/fɪlm/',
    partOfSpeech: 'noun (名词)',
    chinese: '胶卷；底片；电影',
    exampleSentence: 'The camera film is on the third floor.',
    exampleTranslation: '照相机胶卷在三楼。',
    teacherTips: '【助记妙招】口型要自然收圆 /l/ 音。在英式英语中，看电影常说 "watch a film"，美式常用 "movie"。',
    image: '/src/assets/images/cinema_film_roll_1793024736452.jpg',
  },
  {
    id: 'vocab_second_floor',
    word: 'second floor',
    ipa: '/ˈsekənd flɔː(r)/',
    partOfSpeech: 'phrase (词组)',
    chinese: '二楼 (第二层)',
    exampleSentence: 'Look! The actor’s costume is on the second floor.',
    exampleTranslation: '看！演员的戏服在二楼。',
    teacherTips: '【语法要点】表达“在几楼”必须用介词 on：“on the second floor”。二楼通常是戏剧舞台 (stage) 和更衣室 (dressing room)。',
    image: '/src/assets/images/theatre_floors_building_1793024735865.jpg',
  },
  {
    id: 'vocab_third_floor',
    word: 'third floor',
    ipa: '/θɜːd flɔː(r)/',
    partOfSpeech: 'phrase (词组)',
    chinese: '三楼 (第三层)',
    exampleSentence: 'The exciting film is playing on the third floor.',
    exampleTranslation: '精彩的电影正在三楼放映。',
    teacherTips: '【发音关键】third 开头是咬舌音 /θ/，舌尖轻触上齿龈。注意数字 3 (three) 变序数词是 third！',
    image: '/src/assets/images/theatre_floors_building_1793024735865.jpg',
  },
];
