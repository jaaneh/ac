import { useState, useEffect } from 'react';
import { VisHand } from './components/vis-hand';
import { Kort } from './components/kort'
import { generateNewHand, getAllHands, compareHands } from './utils/api';
import type { PokerHand, ComparisonResult } from './types';

function App() {
  const [currentHand, setCurrentHand] = useState<PokerHand | null>(null);
  const [allHands, setAllHands] = useState<PokerHand[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [handIds, setHandIds] = useState('');
  const [uiState, setUiState] = useState({ loading: false, error: null as string | null });

  useEffect(() => {
    loadAllHands();
  }, []);

  const loadAllHands = async () => {
    try {
      const hands = await getAllHands();
      setAllHands(hands);
    } catch (err) {
      setUiState(prev => ({ ...prev, error: 'Feil ved henting av hender: ' + (err as Error).message }));
    }
  };

  const handleGenerateHand = async () => {
    if (uiState.loading) return;
    setUiState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const hand = await generateNewHand();
      setCurrentHand(hand);
      setAllHands(prevHands => [hand, ...prevHands]);
    } catch (err) {
      setUiState(prev => ({ ...prev, error: 'Feil ved generering av hånd: ' + (err as Error).message }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCompareHands = async () => {
    setUiState(prev => ({ ...prev, error: null }));
    const ids = handIds
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (ids.length < 2) {
      setUiState(prev => ({ ...prev, error: 'Du må oppgi minst 2 hånd-IDer' }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    try {
      const result = await compareHands(ids);
      setComparisonResult(result);
    } catch (err) {
      setUiState(prev => ({ ...prev, error: 'Feil ved sammenligning: ' + (err as Error).message }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="font-sans max-w-6xl mx-auto p-5">
        <div className="min-h-[calc(100vh-2.5rem)] bg-gray-800 p-8 shadow-2xl border border-gray-700">
          <h1 className="text-center mb-8 text-yellow-400 text-3xl font-bold">
            Poker Hånd Analysator
          </h1>

          {uiState.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {uiState.error}
            </div>
          )}

          <div className="bg-white text-black p-5 my-4 shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Generer Ny Hånd</h2>
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none px-6 py-3 cursor-pointer text-base mx-2 my-2 transition-transform hover:scale-105 disabled:opacity-50"
              onClick={handleGenerateHand}
              disabled={uiState.loading}
            >
              {uiState.loading ? 'Deler ut...' : 'Del ut kort'}
            </button>

            {currentHand && (
              <div id="current-hand">
                <h3 className="text-lg font-semibold mt-4">Hånd #{currentHand.id}</h3>
                <div className="flex gap-2 font-mono text-2xl my-2">
                  {currentHand.kort.map((kort, index) => (
                    <Kort key={index} kort={kort} />
                  ))}
                </div>
                <p className="font-semibold">{currentHand.beskrivelse}</p>
                <p>Rangering: {currentHand.rangering}/10</p>
              </div>
            )}
          </div>

          <div className="bg-white text-black p-5 my-4 shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Sammenlign Hender</h2>
            <p>Skriv inn hånd-ID-er (kommaseparert), f.eks: 1,2,3</p>
            <input
              type="text"
              value={handIds}
              onChange={(e) => setHandIds(e.target.value)}
              placeholder="Hånd ID-er"
              className="p-2 border border-gray-300 m-1 text-black"
            />
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none px-6 py-3 cursor-pointer text-base mx-2 my-2 transition-transform hover:scale-105 disabled:opacity-50"
              onClick={handleCompareHands}
              disabled={uiState.loading}
            >
              {uiState.loading ? 'Sammenligner...' : 'Sammenlign'}
            </button>

            {comparisonResult && (
              <div className="bg-yellow-100 border-2 border-yellow-400 p-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">Resultat: {comparisonResult.beskrivelse} (Hånd #{comparisonResult.vinner.id})</h3>
                <h4 className="font-semibold mb-2">Vinnende hånd:</h4>
                <div className="flex gap-2 font-mono text-2xl my-2">
                  {comparisonResult.vinner.kort.map((kort, index) => (
                    <Kort key={index} kort={kort} />
                  ))}
                </div>
                <p className="font-semibold">{comparisonResult.vinner.beskrivelse}</p>

                <h4 className="font-semibold mt-4 mb-2">Alle hender:</h4>
                {comparisonResult.hender.map((hånd) => (
                  <div key={hånd.id} className="my-2 p-2 bg-gray-100 border border-gray-300">
                    <div className="flex gap-2 font-mono text-2xl my-2">
                      {hånd.kort.map((kort, index) => (
                        <Kort key={index} kort={kort} />
                      ))}
                    </div>
                    <p>Hånd #{hånd.id}: {hånd.beskrivelse}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white text-black p-5 my-4 shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Tidligere Hender</h2>
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none px-6 py-3 cursor-pointer text-base mx-2 my-2 transition-transform hover:scale-105 disabled:opacity-50"
              onClick={loadAllHands}
              disabled={uiState.loading}
            >
              {uiState.loading ? 'Henter...' : 'Vis alle hender'}
            </button>
            <div className="max-h-[32rem] overflow-y-auto">
              {allHands.map((hand) => (
                <VisHand key={hand.id} hand={hand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
