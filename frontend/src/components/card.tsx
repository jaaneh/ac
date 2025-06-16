import { formatCard } from '../utils/card-formatting';

interface CardProps {
  card: string;
}

export function Card({ card }: CardProps) {
  const { display, isRed } = formatCard(card);

  return (
    <span className={`bg-white border-2 border-gray-800 p-2 min-w-12 text-center font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
      {display}
    </span>
  );
}