export interface PokerHand {
  id: number;
  kort: string[];
  beskrivelse: string;
  rangering: number;
  opprettet: string;
}

export interface ComparisonResult {
  beskrivelse: string;
  vinner: PokerHand;
  hender: PokerHand[];
}