import { Card } from './card';
import type { PokerHand } from '../types';

interface ShowHandProps {
  hand: PokerHand;
}

export function ShowHand({ hand }: ShowHandProps) {
  return (
    <div className="bg-white text-black p-5 my-4 shadow-lg border border-gray-300">
      <p>Hand #{hand.id}</p>
      <div className="flex gap-2 font-mono text-2xl my-2">
        {hand.card.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <p>
        <span className="font-semibold">{hand.description}</span>
        {' '}(Ranking: {hand.ranking}/10)
      </p>
    </div>
  );
}