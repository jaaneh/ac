export function formatCard(card: string): { display: string; isRed: boolean } {
  const color = card.slice(-1);
  const value = card.slice(0, -1);
  const isRed = color === 'r' || color === 'h';

  const colorSymbol: Record<string, string> = {
    'h': '♥', 'r': '♦', 's': '♠', 'k': '♣'
  };

  const valueDisplay = value === 't' ? '10' : value.toUpperCase();

  return {
    display: `${valueDisplay}${colorSymbol[color] || ''}`,
    isRed
  };
}