export function formaterKort(kort: string): { display: string; isRed: boolean } {
  const farge = kort.slice(-1);
  const verdi = kort.slice(0, -1);
  const isRed = farge === 'r' || farge === 'h';

  const fargeSymbol: Record<string, string> = {
    'h': '♥', 'r': '♦', 's': '♠', 'k': '♣'
  };

  const verdiDisplay = verdi === 't' ? '10' : verdi.toUpperCase();

  return {
    display: `${verdiDisplay}${fargeSymbol[farge] || ''}`,
    isRed
  };
}