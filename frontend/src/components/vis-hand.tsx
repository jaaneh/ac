import { Kort } from './kort';
import type { PokerHand } from '../types';

interface VisHandProps {
  hand: PokerHand;
}

export function VisHand({ hand }: VisHandProps) {
  return (
    <div className="bg-white text-black p-5 my-4 shadow-lg border border-gray-300">
      <p>Hånd #{hand.id}</p>
      <div className="flex gap-2 font-mono text-2xl my-2">
        {hand.kort.map((kort, index) => (
          <Kort key={index} kort={kort} />
        ))}
      </div>
      <p>
        <span className="font-semibold">{hand.beskrivelse}</span>
        {' '}(Rangering: {hand.rangering}/10)
      </p>
    </div>
  );
}