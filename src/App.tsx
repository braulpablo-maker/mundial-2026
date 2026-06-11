import React, { useState, useEffect } from 'react';
import { Calendar, Users, Award, RotateCcw, Plus, Minus, Star, ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-react';

const INITIAL_GROUPS = {
  A: { name: 'Grupo A', teams: ['MEX', 'SUD', 'COR', 'RCH'], teamNames: { MEX: 'México', SUD: 'Sudáfrica', COR: 'Corea del Sur', RCH: 'Rep. Checa' } },
  B: { name: 'Grupo B', teams: ['CAN', 'QAT', 'SUI', 'BYH'], teamNames: { CAN: 'Canadá', QAT: 'Qatar', SUI: 'Suiza', BYH: 'Bosnia y Herz.' } },
  C: { name: 'Grupo C', teams: ['BRA', 'MAR', 'HAI', 'ESC'], teamNames: { BRA: 'Brasil', MAR: 'Marruecos', HAI: 'Haití', ESC: 'Escocia' } },
  D: { name: 'Grupo D', teams: ['USA', 'PAR', 'AUS', 'TUR'], teamNames: { USA: 'Estados Unidos', PAR: 'Paraguay', AUS: 'Australia', TUR: 'Turquía' } },
  E: { name: 'Grupo E', teams: ['ALE', 'CUR', 'CMA', 'ECU'], teamNames: { ALE: 'Alemania', CUR: 'Curazao', CMA: 'Costa de Marfil', ECU: 'Ecuador' } },
  F: { name: 'Grupo F', teams: ['PBA', 'JAP', 'SUE', 'TUN'], teamNames: { PBA: 'Países Bajos', JAP: 'Japón', SUE: 'Suecia', TUN: 'Túnez' } },
  G: { name: 'Grupo G', teams: ['BEL', 'EGI', 'IRA', 'NZE'], teamNames: { BEL: 'Bélgica', EGI: 'Egipto', IRA: 'Irán', NZE: 'Nueva Zelanda' } },
  H: { name: 'Grupo H', teams: ['ESP', 'CAB', 'ARA', 'URU'], teamNames: { ESP: 'España', CAB: 'Cabo Verde', ARA: 'Arabia Saudita', URU: 'Uruguay' } },
  I: { name: 'Grupo I', teams: ['FRA', 'SEN', 'IRK', 'NOR'], teamNames: { FRA: 'Francia', SEN: 'Senegal', IRK: 'Irak', NOR: 'Noruega' } },
  J: { name: 'Grupo J', teams: ['ARG', 'AGL', 'AUT', 'JOR'], teamNames: { ARG: 'Argentina', AGL: 'Argelia', AUT: 'Austria', JOR: 'Jordania' } },
  K: { name: 'Grupo K', teams: ['POR', 'RDC', 'UZB', 'COL'], teamNames: { POR: 'Portugal', RDC: 'Rep. Dem. Congo', UZB: 'Uzbekistán', COL: 'Colombia' } },
  L: { name: 'Grupo L', teams: ['ING', 'CRO', 'GHA', 'PAN'], teamNames: { ING: 'Inglaterra', CRO: 'Croacia', GHA: 'Ghana', PAN: 'Panamá' } },
} as const;

type GroupId = keyof typeof INITIAL_GROUPS;

const OFFICIAL_MATCHES = [
  { id: 'a1', group: 'A', date: '11 JUNIO', time: '16:00', venue: 'Cd. de México', home: 'MEX', away: 'SUD' },
  { id: 'a2', group: 'A', date: '11 JUNIO', time: '23:00', venue: 'Guadalajara', home: 'COR', away: 'RCH' },
  { id: 'a3', group: 'A', date: '18 JUNIO', time: '13:00', venue: 'Atlanta', home: 'RCH', away: 'SUD' },
  { id: 'a4', group: 'A', date: '18 JUNIO', time: '22:00', venue: 'Guadalajara', home: 'MEX', away: 'COR' },
  { id: 'a5', group: 'A', date: '24 JUNIO', time: '22:00', venue: 'Cd. de México', home: 'RCH', away: 'MEX' },
  { id: 'a6', group: 'A', date: '24 JUNIO', time: '22:00', venue: 'Monterrey', home: 'SUD', away: 'COR' },
  { id: 'b1', group: 'B', date: '12 JUNIO', time: '16:00', venue: 'Toronto', home: 'CAN', away: 'BYH' },
  { id: 'b2', group: 'B', date: '13 JUNIO', time: '16:00', venue: 'San Francisco', home: 'QAT', away: 'SUI' },
  { id: 'b3', group: 'B', date: '18 JUNIO', time: '16:00', venue: 'Los Ángeles', home: 'SUI', away: 'BYH' },
  { id: 'b4', group: 'B', date: '18 JUNIO', time: '19:00', venue: 'Vancouver', home: 'CAN', away: 'QAT' },
  { id: 'b5', group: 'B', date: '24 JUNIO', time: '16:00', venue: 'Vancouver', home: 'SUI', away: 'CAN' },
  { id: 'b6', group: 'B', date: '24 JUNIO', time: '16:00', venue: 'Seattle', home: 'BYH', away: 'QAT' },
  { id: 'c1', group: 'C', date: '13 JUNIO', time: '19:00', venue: 'Nueva York/NJ', home: 'BRA', away: 'MAR' },
  { id: 'c2', group: 'C', date: '13 JUNIO', time: '22:00', venue: 'Boston', home: 'HAI', away: 'ESC' },
  { id: 'c3', group: 'C', date: '19 JUNIO', time: '19:00', venue: 'Boston', home: 'ESC', away: 'MAR' },
  { id: 'c4', group: 'C', date: '19 JUNIO', time: '21:30', venue: 'Filadelfia', home: 'BRA', away: 'HAI' },
  { id: 'c5', group: 'C', date: '24 JUNIO', time: '19:00', venue: 'Miami', home: 'ESC', away: 'BRA' },
  { id: 'c6', group: 'C', date: '24 JUNIO', time: '19:00', venue: 'Atlanta', home: 'MAR', away: 'HAI' },
  { id: 'd1', group: 'D', date: '12 JUNIO', time: '22:00', venue: 'Los Ángeles', home: 'USA', away: 'PAR' },
  { id: 'd2', group: 'D', date: '14 JUNIO', time: '01:00', venue: 'Vancouver', home: 'AUS', away: 'TUR' },
  { id: 'd3', group: 'D', date: '20 JUNIO', time: '00:00', venue: 'San Francisco', home: 'TUR', away: 'PAR' },
  { id: 'd4', group: 'D', date: '19 JUNIO', time: '16:00', venue: 'Seattle', home: 'USA', away: 'AUS' },
  { id: 'd5', group: 'D', date: '25 JUNIO', time: '23:00', venue: 'Los Ángeles', home: 'TUR', away: 'USA' },
  { id: 'd6', group: 'D', date: '25 JUNIO', time: '23:00', venue: 'San Francisco', home: 'PAR', away: 'AUS' },
  { id: 'e1', group: 'E', date: '14 JUNIO', time: '14:00', venue: 'Houston', home: 'ALE', away: 'CUR' },
  { id: 'e2', group: 'E', date: '14 JUNIO', time: '20:00', venue: 'Filadelfia', home: 'CMA', away: 'ECU' },
  { id: 'e3', group: 'E', date: '20 JUNIO', time: '17:00', venue: 'Toronto', home: 'ALE', away: 'CMA' },
  { id: 'e4', group: 'E', date: '20 JUNIO', time: '21:00', venue: 'Kansas City', home: 'ECU', away: 'CUR' },
  { id: 'e5', group: 'E', date: '25 JUNIO', time: '17:00', venue: 'Filadelfia', home: 'CUR', away: 'CMA' },
  { id: 'e6', group: 'E', date: '25 JUNIO', time: '17:00', venue: 'Nueva York/NJ', home: 'ECU', away: 'ALE' },
  { id: 'f1', group: 'F', date: '14 JUNIO', time: '17:00', venue: 'Dallas', home: 'PBA', away: 'JAP' },
  { id: 'f2', group: 'F', date: '14 JUNIO', time: '23:00', venue: 'Monterrey', home: 'SUE', away: 'TUN' },
  { id: 'f3', group: 'F', date: '20 JUNIO', time: '14:00', venue: 'Houston', home: 'PBA', away: 'SUE' },
  { id: 'f4', group: 'F', date: '21 JUNIO', time: '01:00', venue: 'Monterrey', home: 'TUN', away: 'JAP' },
  { id: 'f5', group: 'F', date: '25 JUNIO', time: '20:00', venue: 'Dallas', home: 'JAP', away: 'SUE' },
  { id: 'f6', group: 'F', date: '25 JUNIO', time: '20:00', venue: 'Kansas City', home: 'TUN', away: 'PBA' },
  { id: 'g1', group: 'G', date: '15 JUNIO', time: '16:00', venue: 'Seattle', home: 'BEL', away: 'EGI' },
  { id: 'g2', group: 'G', date: '15 JUNIO', time: '22:00', venue: 'Los Ángeles', home: 'IRA', away: 'NZE' },
  { id: 'g3', group: 'G', date: '21 JUNIO', time: '16:00', venue: 'Los Ángeles', home: 'BEL', away: 'IRA' },
  { id: 'g4', group: 'G', date: '21 JUNIO', time: '22:00', venue: 'Vancouver', home: 'NZE', away: 'EGI' },
  { id: 'g5', group: 'G', date: '27 JUNIO', time: '00:00', venue: 'Vancouver', home: 'NZE', away: 'BEL' },
  { id: 'g6', group: 'G', date: '27 JUNIO', time: '00:00', venue: 'Seattle', home: 'EGI', away: 'IRA' },
  { id: 'h1', group: 'H', date: '15 JUNIO', time: '13:00', venue: 'Atlanta', home: 'ESP', away: 'CAB' },
  { id: 'h2', group: 'H', date: '15 JUNIO', time: '19:00', venue: 'Miami', home: 'ARA', away: 'URU' },
  { id: 'h3', group: 'H', date: '21 JUNIO', time: '13:00', venue: 'Atlanta', home: 'ESP', away: 'ARA' },
  { id: 'h4', group: 'H', date: '21 JUNIO', time: '19:00', venue: 'Miami', home: 'URU', away: 'CAB' },
  { id: 'h5', group: 'H', date: '26 JUNIO', time: '21:00', venue: 'Guadalajara', home: 'URU', away: 'ESP' },
  { id: 'h6', group: 'H', date: '26 JUNIO', time: '21:00', venue: 'Houston', home: 'CAB', away: 'ARA' },
  { id: 'i1', group: 'I', date: '16 JUNIO', time: '16:00', venue: 'Nueva York/NJ', home: 'FRA', away: 'SEN' },
  { id: 'i2', group: 'I', date: '16 JUNIO', time: '19:00', venue: 'Boston', home: 'IRK', away: 'NOR' },
  { id: 'i3', group: 'I', date: '22 JUNIO', time: '18:00', venue: 'Filadelfia', home: 'FRA', away: 'IRK' },
  { id: 'i4', group: 'I', date: '22 JUNIO', time: '21:00', venue: 'Nueva York/NJ', home: 'NOR', away: 'SEN' },
  { id: 'i5', group: 'I', date: '26 JUNIO', time: '16:00', venue: 'Boston', home: 'NOR', away: 'FRA' },
  { id: 'i6', group: 'I', date: '26 JUNIO', time: '16:00', venue: 'Toronto', home: 'SEN', away: 'IRK' },
  { id: 'j1', group: 'J', date: '16 JUNIO', time: '22:00', venue: 'Kansas City', home: 'ARG', away: 'AGL' },
  { id: 'j2', group: 'J', date: '17 JUNIO', time: '01:00', venue: 'San Francisco', home: 'AUT', away: 'JOR' },
  { id: 'j3', group: 'J', date: '22 JUNIO', time: '14:00', venue: 'Dallas', home: 'ARG', away: 'AUT' },
  { id: 'j4', group: 'J', date: '23 JUNIO', time: '00:00', venue: 'San Francisco', home: 'JOR', away: 'AGL' },
  { id: 'j5', group: 'J', date: '27 JUNIO', time: '23:00', venue: 'Kansas City', home: 'AGL', away: 'AUT' },
  { id: 'j6', group: 'J', date: '27 JUNIO', time: '23:00', venue: 'Dallas', home: 'JOR', away: 'ARG' },
  { id: 'k1', group: 'K', date: '17 JUNIO', time: '14:00', venue: 'Houston', home: 'POR', away: 'RDC' },
  { id: 'k2', group: 'K', date: '17 JUNIO', time: '23:00', venue: 'Cd. de México', home: 'UZB', away: 'COL' },
  { id: 'k3', group: 'K', date: '23 JUNIO', time: '14:00', venue: 'Houston', home: 'POR', away: 'UZB' },
  { id: 'k4', group: 'K', date: '23 JUNIO', time: '23:00', venue: 'Guadalajara', home: 'COL', away: 'RDC' },
  { id: 'k5', group: 'K', date: '27 JUNIO', time: '20:30', venue: 'Miami', home: 'COL', away: 'POR' },
  { id: 'k6', group: 'K', date: '27 JUNIO', time: '20:30', venue: 'Atlanta', home: 'RDC', away: 'UZB' },
  { id: 'l1', group: 'L', date: '17 JUNIO', time: '17:00', venue: 'Dallas', home: 'ING', away: 'CRO' },
  { id: 'l2', group: 'L', date: '17 JUNIO', time: '20:00', venue: 'Toronto', home: 'GHA', away: 'PAN' },
  { id: 'l3', group: 'L', date: '23 JUNIO', time: '17:00', venue: 'Boston', home: 'ING', away: 'GHA' },
  { id: 'l4', group: 'L', date: '23 JUNIO', time: '20:00', venue: 'Toronto', home: 'PAN', away: 'CRO' },
  { id: 'l5', group: 'L', date: '27 JUNIO', time: '18:00', venue: 'Nueva York/NJ', home: 'PAN', away: 'ING' },
  { id: 'l6', group: 'L', date: '27 JUNIO', time: '18:00', venue: 'Filadelfia', home: 'CRO', away: 'GHA' },
];

const UNIQUE_DATES = ['11 JUNIO','12 JUNIO','13 JUNIO','14 JUNIO','15 JUNIO','16 JUNIO','17 JUNIO','18 JUNIO','19 JUNIO','20 JUNIO','21 JUNIO','22 JUNIO','23 JUNIO','24 JUNIO','25 JUNIO','26 JUNIO','27 JUNIO'];
const LS_SCORES = 'mundial2026_scores';
const LS_FAVS   = 'mundial2026_favs';

function loadLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export default function App() {
  const [activeTab, setActiveTab]     = useState('fixtures');
  const [viewMode,  setViewMode]      = useState('day');
  const [selectedDate,  setSelectedDate]  = useState('11 JUNIO');
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [scores,    setScores]    = useState<Record<string,{home:number|string,away:number|string}>>(() => loadLS(LS_SCORES, {}));
  const [favorites, setFavorites] = useState<string[]>(() => loadLS(LS_FAVS, ['ARG','MEX','COL','URU']));

  // Persist every change
  useEffect(() => { localStorage.setItem(LS_SCORES, JSON.stringify(scores)); flashSaved(); }, [scores]);
  useEffect(() => { localStorage.setItem(LS_FAVS,   JSON.stringify(favorites)); }, [favorites]);

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  const handleScoreChange = (id: string, field: 'home'|'away', value: number) => {
    setScores(prev => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(0, value) } }));
  };

  const toggleFavorite = (team: string) => {
    setFavorites(prev => prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]);
  };

  const simulateAll = () => {
    const r: typeof scores = {};
    OFFICIAL_MATCHES.forEach(m => { r[m.id] = { home: Math.floor(Math.random()*4), away: Math.floor(Math.random()*3) }; });
    setScores(r);
  };

  const handleReset = () => {
    setScores({});
    setFavorites(['ARG','MEX','COL','URU']);
    setShowResetConfirm(false);
  };

  const calculateGroupTable = (gId: GroupId) => {
    const group = INITIAL_GROUPS[gId];
    const table: Record<string,any> = {};
    group.teams.forEach(t => { table[t] = { team:t, name:(group.teamNames as any)[t], p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 }; });
    OFFICIAL_MATCHES.filter(m => m.group === gId).forEach(m => {
      const s = scores[m.id];
      if (!s || s.home==='' || s.away==='') return;
      const gh = +s.home, ga = +s.away;
      table[m.home].p++; table[m.away].p++;
      table[m.home].gf += gh; table[m.home].ga += ga;
      table[m.away].gf += ga; table[m.away].ga += gh;
      if (gh>ga) { table[m.home].w++; table[m.home].pts+=3; table[m.away].l++; }
      else if (gh<ga) { table[m.away].w++; table[m.away].pts+=3; table[m.home].l++; }
      else { table[m.home].d++; table[m.away].d++; table[m.home].pts++; table[m.away].pts++; }
    });
    return Object.values(table).map(t=>({...t, gd:t.gf-t.ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
  };

  const getAllThirds = () => {
    const thirds: any[] = [];
    (Object.keys(INITIAL_GROUPS) as GroupId[]).forEach(gId => {
      const s = calculateGroupTable(gId);
      if (s[2]) thirds.push({...s[2], group:gId});
    });
    return thirds.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf).slice(0,8);
  };

  const filteredMatches = OFFICIAL_MATCHES.filter(m => {
    if (viewMode==='day')   return m.date===selectedDate;
    if (viewMode==='group') return m.group===selectedGroup;
    return favorites.includes(m.home)||favorites.includes(m.away);
  });

  const tabBtn = (id:string, icon:React.ReactNode, label:string) => (
    <button onClick={()=>setActiveTab(id)}
      className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${activeTab===id?'text-emerald-400 bg-slate-900':'text-slate-500'}`}>
      {icon}<span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="max-w-md mx-auto bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans pb-28 shadow-2xl relative select-none">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 p-4 sticky top-0 z-40 border-b border-emerald-500/20 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold tracking-wider text-emerald-400">MUNDIAL 2026</h1>
            <p className="text-[11px] text-slate-400 font-medium">Libreta de Pronósticos ⚽</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <button onClick={simulateAll} className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-black text-xs px-2.5 py-1.5 rounded-lg transition-transform">
              Simular
            </button>
            <button onClick={()=>setShowResetConfirm(true)} className="bg-slate-900 border border-rose-500/20 hover:bg-slate-800 text-rose-400 p-2 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4"/>
            </button>
          </div>
        </div>
        {/* Estado guardado */}
        <div className="mt-2 flex items-center justify-between text-[10px] bg-slate-900/60 rounded-md px-2.5 py-1 border border-slate-800/80">
          <span className="text-slate-400 font-medium">Almacenamiento:</span>
          <span className={`font-bold flex items-center gap-1 transition-colors ${saved?'text-emerald-400':'text-slate-500'}`}>
            {saved ? <><Check className="w-3.5 h-3.5"/>Guardado</> : <><RefreshCw className="w-3 h-3"/>Local (este navegador)</>}
          </span>
        </div>
      </header>

      <main className="flex-1 p-3 overflow-y-auto">

        {/* ====== FIXTURES ====== */}
        {activeTab==='fixtures' && (
          <div>
            {/* Sub-menú */}
            <div className="flex bg-slate-900/40 p-1 rounded-xl mb-4 border border-slate-800">
              {(['day','group','favs'] as const).map((m,i)=>(
                <button key={m} onClick={()=>setViewMode(m)}
                  className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all ${viewMode===m?'bg-emerald-500 text-slate-950 shadow':'text-slate-400'}`}>
                  {['Por Día','Por Grupo','Favoritos ⭐'][i]}
                </button>
              ))}
            </div>

            {/* Selector de fecha */}
            {viewMode==='day' && (
              <div className="flex items-center gap-1 mb-4 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <button onClick={()=>{const i=UNIQUE_DATES.indexOf(selectedDate);if(i>0)setSelectedDate(UNIQUE_DATES[i-1]);}}
                  className="p-1.5 text-emerald-400 active:scale-95 transition-transform">
                  <ChevronLeft className="w-5 h-5"/>
                </button>
                <div className="flex-1 text-center font-black text-sm text-emerald-400 tracking-wider">{selectedDate}</div>
                <button onClick={()=>{const i=UNIQUE_DATES.indexOf(selectedDate);if(i<UNIQUE_DATES.length-1)setSelectedDate(UNIQUE_DATES[i+1]);}}
                  className="p-1.5 text-emerald-400 active:scale-95 transition-transform">
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            )}

            {/* Selector de grupo */}
            {viewMode==='group' && (
              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {Object.keys(INITIAL_GROUPS).map(g=>(
                  <button key={g} onClick={()=>setSelectedGroup(g)}
                    className={`py-1.5 font-bold text-xs rounded-md border transition-all ${selectedGroup===g?'bg-emerald-500 text-slate-950 border-emerald-400 scale-105':'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    {g}
                  </button>
                ))}
              </div>
            )}

            {/* Vacío favoritos */}
            {viewMode==='favs' && filteredMatches.length===0 && (
              <div className="text-center py-10 px-4 text-slate-500 text-xs bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                <Star className="w-8 h-8 text-slate-700 mx-auto mb-2"/>
                <p>No hay favoritos aún.</p>
                <p className="mt-1 text-[11px] text-slate-600">Tocá la ⭐ de cualquier equipo para seguirlo acá.</p>
              </div>
            )}

            {/* Lista de partidos */}
            <div className="space-y-3.5">
              {filteredMatches.map(match=>{
                const group = INITIAL_GROUPS[match.group as GroupId];
                const homeName = (group.teamNames as any)[match.home];
                const awayName = (group.teamNames as any)[match.away];
                const score = scores[match.id] || {home:'',away:''};
                return (
                  <div key={match.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
                    {/* Cabecera */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase mb-3 pb-2 border-b border-slate-800/60">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">Grupo {match.group}</span>
                      <span>{match.date} · {match.time} ARG</span>
                      <span className="text-slate-500 truncate max-w-[110px] text-right">{match.venue}</span>
                    </div>
                    {/* Tablero */}
                    <div className="grid grid-cols-12 items-center gap-1.5 my-2.5">
                      {/* Local */}
                      <div className="col-span-4 flex flex-col items-center text-center relative">
                        <button onClick={()=>toggleFavorite(match.home)} className="absolute -top-3 left-1 p-1 z-10">
                          <Star className={`w-4 h-4 ${favorites.includes(match.home)?'fill-amber-400 text-amber-400':'text-slate-700'}`}/>
                        </button>
                        <span className="font-black text-sm text-slate-200">{match.home}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-full">{homeName}</span>
                      </div>
                      {/* Score */}
                      <div className="col-span-4 bg-slate-950 border border-emerald-500/20 rounded-xl py-1.5 px-2 flex justify-center items-center gap-2.5">
                        <span className="text-2xl font-black text-emerald-400 min-w-[24px] text-center">
                          {score.home!==''&&score.home!==undefined?score.home:'-'}
                        </span>
                        <span className="text-xs font-bold text-slate-700">:</span>
                        <span className="text-2xl font-black text-emerald-400 min-w-[24px] text-center">
                          {score.away!==''&&score.away!==undefined?score.away:'-'}
                        </span>
                      </div>
                      {/* Visitante */}
                      <div className="col-span-4 flex flex-col items-center text-center relative">
                        <button onClick={()=>toggleFavorite(match.away)} className="absolute -top-3 right-1 p-1 z-10">
                          <Star className={`w-4 h-4 ${favorites.includes(match.away)?'fill-amber-400 text-amber-400':'text-slate-700'}`}/>
                        </button>
                        <span className="font-black text-sm text-slate-200">{match.away}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-full">{awayName}</span>
                      </div>
                    </div>
                    {/* Controles */}
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-2.5 border-t border-slate-800/40">
                      {(['home','away'] as const).map(field=>(
                        <div key={field} className="flex justify-between items-center bg-slate-950/60 py-1 px-1.5 rounded-xl border border-slate-800/80">
                          <button onClick={()=>handleScoreChange(match.id,field,(+score[field]||0)-1)}
                            className="w-8 h-8 rounded-lg bg-slate-800 active:bg-slate-700 flex items-center justify-center text-slate-300">
                            <Minus className="w-4 h-4"/>
                          </button>
                          <span className="text-[10px] font-extrabold text-slate-500">{field==='home'?'L':'V'}</span>
                          <button onClick={()=>handleScoreChange(match.id,field,(+score[field]||0)+1)}
                            className="w-8 h-8 rounded-lg bg-emerald-600 active:bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                            <Plus className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== TABLAS ====== */}
        {activeTab==='tables' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
              <h2 className="text-sm font-black text-emerald-400 tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4"/> POSICIONES — GRUPO {selectedGroup}
              </h2>
              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {Object.keys(INITIAL_GROUPS).map(g=>(
                  <button key={g} onClick={()=>setSelectedGroup(g)}
                    className={`py-1.5 text-center font-bold text-[11px] rounded-lg transition-all ${selectedGroup===g?'bg-emerald-500 text-slate-950 scale-105':'bg-slate-950 text-slate-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 font-bold uppercase text-[10px]">
                    <th className="py-2">Equipo</th>
                    <th className="py-2 text-center">PJ</th>
                    <th className="py-2 text-center">GF</th>
                    <th className="py-2 text-center">DG</th>
                    <th className="py-2 text-right text-emerald-400">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateGroupTable(selectedGroup as GroupId).map((row,idx)=>(
                    <tr key={row.team} className={`border-b border-slate-800/40 ${idx<2?'bg-emerald-950/10':''}`}>
                      <td className="py-2.5 font-bold flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-3">{idx+1}</span>
                        <span className="text-slate-200">{row.name}</span>
                      </td>
                      <td className="py-2.5 text-center text-slate-400">{row.p}</td>
                      <td className="py-2.5 text-center text-slate-400">{row.gf}</td>
                      <td className="py-2.5 text-center font-semibold text-slate-300">{row.gd>0?`+${row.gd}`:row.gd}</td>
                      <td className="py-2.5 text-right font-black text-emerald-400 text-sm">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== TERCEROS ====== */}
        {activeTab==='thirds' && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <h2 className="text-sm font-black text-emerald-400 tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4"/> MEJORES TERCEROS
            </h2>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Los 8 mejores terceros de los 12 grupos clasifican a la siguiente ronda.
            </p>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 font-bold uppercase text-[10px]">
                  <th className="py-2">Equipo</th>
                  <th className="py-2 text-center">PJ</th>
                  <th className="py-2 text-center">DG</th>
                  <th className="py-2 text-right text-emerald-400">Pts</th>
                </tr>
              </thead>
              <tbody>
                {getAllThirds().map((row,idx)=>(
                  <tr key={row.team} className="border-b border-slate-800/40 bg-teal-950/20">
                    <td className="py-2.5 font-bold">
                      <span className="text-[10px] text-slate-500 mr-2">{idx+1}</span>
                      <span className="text-slate-200">{row.name}</span>
                      <span className="text-[10px] text-emerald-500 ml-1">({row.group})</span>
                    </td>
                    <td className="py-2.5 text-center text-slate-400">{row.p}</td>
                    <td className="py-2.5 text-center text-slate-300 font-semibold">{row.gd>0?`+${row.gd}`:row.gd}</td>
                    <td className="py-2.5 text-right font-black text-emerald-400 text-sm">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* Modal reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto mb-3.5">
              <RotateCcw className="w-6 h-6"/>
            </div>
            <h3 className="text-sm font-black text-slate-100">¿Reiniciar todo?</h3>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">Se borrarán todos los marcadores y se reestablecerán los favoritos por defecto.</p>
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button onClick={()=>setShowResetConfirm(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs py-2 rounded-lg">Cancelar</button>
              <button onClick={handleReset} className="bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs py-2 rounded-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 border-t border-slate-900 p-2 flex justify-around items-center z-50 shadow-2xl backdrop-blur-md">
        {tabBtn('fixtures', <Calendar className="w-5 h-5"/>, 'Partidos')}
        {tabBtn('tables',   <Users    className="w-5 h-5"/>, 'Tablas')}
        {tabBtn('thirds',   <Award    className="w-5 h-5"/>, 'Terceros')}
      </nav>

    </div>
  );
}
