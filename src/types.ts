export interface ProblemData {
  intro: string;
  expectedAnswer: string;
  unit: string;
  explanation: string;
  type: string;
  isGolden: boolean;
  mathData: (string | { type: string; num: string; den: string })[];
  hintsType: string;
  visualData?: any;
}

export interface CurrentProblem {
  data: ProblemData;
  solved: boolean;
  timestamp?: number;
}

export interface Album {
  id: string;
  name: string;
  reward: number;
  pieces: number;
  cols: number;
  emoji: string;
  color: string;
  bgClass: string;
  bgMask: string;
  borderColor: string;
}

export interface AlbumState {
  piecesOwned: number[];
  completed: boolean;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
  effect: 'shield' | 'double' | 'chest_common' | 'chest_rare' | 'chest_legendary' | 'ticket_pack';
}

export interface PetBuff {
  id: string;
  name: string;
  emoji: string;
  buffType: string;
  value: number;
  desc: string;
  price: number;
  bg: string;
  border: string;
}

export interface MarketEvent {
  id: string;
  name: string;
  desc: string;
  icon: string;
  duration: number;
  effect: string;
}

export interface ShopBanner {
  id: string;
  title: string;
  desc: string;
  bg: string;
  icon: string;
}

export interface Trophy {
  id: string;
  name: string;
  desc: string;
  icon: string;
  req: (stats: any, coins: number, score: number, coinsSpent: number) => boolean;
}

export interface Quest {
  id: string;
  type: string;
  target: number;
  current: number;
  rewardTickets: number;
  done: boolean;
  claimed: boolean;
  desc: string;
  icon: string;
}

export interface Stats {
  solved: number;
  failedAttempts: number;
  totalGenerations: number;
  boostsTriggered: number;
  maxStreak: number;
  distractions: number;
  goldenWins: number;
  legendaryWins: number;
  supernovas: number;
  exerciseTimes: { n: number; time: number }[];
  ticketsByTopic?: Record<string, number>;
}

export interface UserState {
  setupCompleted?: boolean;
  role?: 'student' | 'teacher' | 'secretary' | 'admin';
  grade?: '3ro' | '4to' | '5to';
  name: string;
  avatar: string;
  coins: number;
  tickets: number;
  progress: number;
  courseProgress?: Record<string, number>;
  classroom?: string;
}
