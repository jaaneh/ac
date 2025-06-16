import type { PokerHand, ComparisonResult } from '../types';

const API_BASE = '/api';

export async function generateNewHand(): Promise<PokerHand> {
  const response = await fetch(`${API_BASE}/new`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to generate hand');
  return response.json();
}

export async function getAllHands(): Promise<PokerHand[]> {
  const response = await fetch(`${API_BASE}/all`);
  if (!response.ok) throw new Error('Failed to fetch hands');
  return response.json();
}

export async function compareHands(ids: number[]): Promise<ComparisonResult> {
  const response = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  if (!response.ok) throw new Error('Failed to compare hands');
  return response.json();
}