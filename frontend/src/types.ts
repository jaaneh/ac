export interface PokerHand {
  id: number;
  card: string[];
  description: string;
  ranking: number;
  created_at: string;
}

export interface ComparisonResult {
  description: string;
  winner: PokerHand;
  hands: PokerHand[];
}