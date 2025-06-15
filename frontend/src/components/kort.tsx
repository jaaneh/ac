import { formaterKort } from '../utils/kort-formaterer';

interface KortProps {
  kort: string;
}

export function Kort({ kort }: KortProps) {
  const { display, isRed } = formaterKort(kort);

  return (
    <span className={`bg-white border-2 border-gray-800 p-2 min-w-12 text-center font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
      {display}
    </span>
  );
}