import type { PokerHand, ComparisonResult } from '../types';

const API_BASE = '/api';

export async function generateNewHand(): Promise<PokerHand> {
  const response = await fetch(`${API_BASE}/hand`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to generate hand');
  return response.json();
}

export async function getAllHands(): Promise<PokerHand[]> {
  const response = await fetch(`${API_BASE}/hender`);
  if (!response.ok) throw new Error('Failed to fetch hands');
  return response.json();
}

export async function compareHands(ids: number[]): Promise<ComparisonResult> {
  const response = await fetch(`${API_BASE}/sammenlign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ider: ids })
  });
  if (!response.ok) throw new Error('Failed to compare hands');
  return response.json();
}