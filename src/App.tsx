import { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, Award, Plus, Minus, Star, ChevronLeft, ChevronRight, RefreshCw, CloudLightning, Save, Trophy } from 'lucide-react';
import { ref, onValue, update } from 'firebase/database';
import { database } from './firebase';

// ═══════════════════════════════════════════
//  BANDERAS POR CÓDIGO
// ═══════════════════════════════════════════

const FLAGS: Record<string, string> = {
  MEX: 'mx', SUD: 'za', COR: 'kr', RCH: 'cz',
  CAN: 'ca', QAT: 'qa', SUI: 'ch', BYH: 'ba',
  BRA: 'br', MAR: 'ma', HAI: 'ht', ESC: 'gb-sct',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  ALE: 'de', CUR: 'cw', CMA: 'ci', ECU: 'ec',
  PBA: 'nl', JAP: 'jp', SUE: 'se', TUN: 'tn',
  BEL: 'be', EGI: 'eg', IRA: 'ir', NZE: 'nz',
  ESP: 'es', CAB: 'cv', ARA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRK: 'iq', NOR: 'no',
  ARG: 'ar', AGL: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', RDC: 'cd', UZB: 'uz', COL: 'co',
  ING: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
};

// ═══════════════════════════════════════════
//  DATOS FASE DE GRUPOS
// ═══════════════════════════════════════════

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

const UNIQUE_DATES = ['11 JUNIO','12 JUNIO','13 JUNIO','14 JUNIO','15 JUNIO','16 JUNIO','17 JUNIO','18 JUNIO','19 JUNIO','20 JUNIO','21 JUNIO','22 JUNIO','23 JUNIO','24 JUNIO','25 JUNIO','26 JUNIO','27 JUNIO','28 JUNIO','29 JUNIO','30 JUNIO','1 JULIO','2 JULIO','3 JULIO','4 JULIO','5 JULIO','6 JULIO','7 JULIO','9 JULIO','10 JULIO','11 JULIO','14 JULIO','15 JULIO','18 JULIO','19 JULIO'];
const LS_FAVS = 'mundial2026_favs';

// ═══════════════════════════════════════════
//  DATOS FASE ELIMINATORIA
// ═══════════════════════════════════════════

type KnockoutPhase = 'R32' | 'R16' | 'QF' | 'SF' | '3RD' | 'FINAL';

const PHASE_NAMES: Record<KnockoutPhase, string> = {
  R32: 'Dieciséisavos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semifinal', '3RD': '3° y 4°', FINAL: 'Final',
};

const KNOCKOUT_PHASES: KnockoutPhase[] = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];

interface KOMatch {
  id: string; num: number; phase: KnockoutPhase;
  date: string; time: string; venue: string;
  homeRef: string; awayRef: string;
}

const KNOCKOUT_MATCHES: KOMatch[] = [
  // ── DIECISÉISAVOS DE FINAL (R32) ──
  { id:'ko73', num:73, phase:'R32', date:'28 JUNIO', time:'16:00', venue:'Los Ángeles',    homeRef:'2A',  awayRef:'2B' },
  { id:'ko74', num:74, phase:'R32', date:'29 JUNIO', time:'14:00', venue:'Monterrey',      homeRef:'1C',  awayRef:'2F' },
  { id:'ko75', num:75, phase:'R32', date:'29 JUNIO', time:'17:30', venue:'Boston',          homeRef:'1E',  awayRef:'3_ABCDF' },
  { id:'ko76', num:76, phase:'R32', date:'29 JUNIO', time:'22:00', venue:'Houston',         homeRef:'1F',  awayRef:'2C' },
  { id:'ko77', num:77, phase:'R32', date:'30 JUNIO', time:'18:00', venue:'Nueva York/NJ',   homeRef:'2E',  awayRef:'2I' },
  { id:'ko78', num:78, phase:'R32', date:'30 JUNIO', time:'14:00', venue:'Filadelfia',      homeRef:'1I',  awayRef:'3_CDFGH' },
  { id:'ko79', num:79, phase:'R32', date:'30 JUNIO', time:'22:00', venue:'Cd. de México',   homeRef:'1A',  awayRef:'3_CEFHI' },
  { id:'ko80', num:80, phase:'R32', date:'1 JULIO',  time:'13:00', venue:'Atlanta',         homeRef:'1L',  awayRef:'3_EHIJK' },
  { id:'ko81', num:81, phase:'R32', date:'1 JULIO',  time:'21:00', venue:'San Francisco',   homeRef:'1G',  awayRef:'3_AEHIJ' },
  { id:'ko82', num:82, phase:'R32', date:'1 JULIO',  time:'17:00', venue:'Seattle',         homeRef:'1D',  awayRef:'3_BEFIJ' },
  { id:'ko83', num:83, phase:'R32', date:'2 JULIO',  time:'16:00', venue:'Los Ángeles',     homeRef:'1H',  awayRef:'2J' },
  { id:'ko84', num:84, phase:'R32', date:'2 JULIO',  time:'20:00', venue:'Toronto',         homeRef:'2K',  awayRef:'2L' },
  { id:'ko85', num:85, phase:'R32', date:'2 JULIO',  time:'00:00', venue:'Vancouver',       homeRef:'1B',  awayRef:'3_EFGIJ' },
  { id:'ko86', num:86, phase:'R32', date:'3 JULIO',  time:'15:00', venue:'Dallas',          homeRef:'2D',  awayRef:'2G' },
  { id:'ko87', num:87, phase:'R32', date:'3 JULIO',  time:'19:00', venue:'Miami',           homeRef:'1J',  awayRef:'2H' },
  { id:'ko88', num:88, phase:'R32', date:'3 JULIO',  time:'22:30', venue:'Kansas City',     homeRef:'1K',  awayRef:'3_DEIJL' },
  // ── OCTAVOS DE FINAL (R16) ──
  { id:'ko89', num:89, phase:'R16', date:'4 JULIO',  time:'14:00', venue:'Houston',         homeRef:'W73', awayRef:'W75' },
  { id:'ko90', num:90, phase:'R16', date:'4 JULIO',  time:'18:00', venue:'Filadelfia',      homeRef:'W74', awayRef:'W77' },
  { id:'ko91', num:91, phase:'R16', date:'5 JULIO',  time:'17:00', venue:'Nueva York/NJ',   homeRef:'W76', awayRef:'W78' },
  { id:'ko92', num:92, phase:'R16', date:'5 JULIO',  time:'21:00', venue:'Cd. de México',   homeRef:'W79', awayRef:'W80' },
  { id:'ko93', num:93, phase:'R16', date:'6 JULIO',  time:'16:00', venue:'Dallas',          homeRef:'W83', awayRef:'W84' },
  { id:'ko94', num:94, phase:'R16', date:'6 JULIO',  time:'21:00', venue:'Seattle',         homeRef:'W81', awayRef:'W82' },
  { id:'ko95', num:95, phase:'R16', date:'7 JULIO',  time:'13:00', venue:'Atlanta',         homeRef:'W86', awayRef:'W88' },
  { id:'ko96', num:96, phase:'R16', date:'7 JULIO',  time:'17:00', venue:'Vancouver',       homeRef:'W85', awayRef:'W87' },
  // ── CUARTOS DE FINAL (QF) ──
  { id:'ko97',  num:97,  phase:'QF', date:'9 JULIO',  time:'17:00', venue:'Boston',         homeRef:'W89', awayRef:'W90' },
  { id:'ko98',  num:98,  phase:'QF', date:'10 JULIO', time:'18:00', venue:'Los Ángeles',    homeRef:'W93', awayRef:'W94' },
  { id:'ko99',  num:99,  phase:'QF', date:'11 JULIO', time:'18:00', venue:'Miami',          homeRef:'W91', awayRef:'W92' },
  { id:'ko100', num:100, phase:'QF', date:'11 JULIO', time:'21:00', venue:'Kansas City',    homeRef:'W95', awayRef:'W96' },
  // ── SEMIFINALES (SF) ──
  { id:'ko101', num:101, phase:'SF', date:'14 JULIO', time:'16:00', venue:'Dallas',         homeRef:'W97',  awayRef:'W98' },
  { id:'ko102', num:102, phase:'SF', date:'15 JULIO', time:'16:00', venue:'Atlanta',        homeRef:'W99',  awayRef:'W100' },
  // ── 3° Y 4° PUESTO ──
  { id:'ko103', num:103, phase:'3RD',  date:'18 JULIO', time:'18:00', venue:'Miami',        homeRef:'L101', awayRef:'L102' },
  // ── FINAL ──
  { id:'ko104', num:104, phase:'FINAL', date:'19 JULIO', time:'16:00', venue:'Nueva York/NJ', homeRef:'W101', awayRef:'W102' },
];

// ═══════════════════════════════════════════
//  FUNCIONES DE CÁLCULO / RESOLUCIÓN
// ═══════════════════════════════════════════

interface TeamRow { team: string; name: string; p: number; w: number; d: number; l: number; gf: number; ga: number; gd: number; pts: number; }
interface ResolvedTeam { code: string; name: string; }

function calcGroupTable(gId: GroupId, scores: Record<string, any>): TeamRow[] {
  const group = INITIAL_GROUPS[gId];
  const table: Record<string, any> = {};
  group.teams.forEach(t => {
    table[t] = { team: t, name: (group.teamNames as any)[t], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  });
  OFFICIAL_MATCHES.filter(m => m.group === gId).forEach(m => {
    const s = scores[m.id];
    if (!s || s.home === '' || s.away === '' || s.home === undefined || s.away === undefined) return;
    const gh = +s.home, ga = +s.away;
    table[m.home].p++; table[m.away].p++;
    table[m.home].gf += gh; table[m.home].ga += ga;
    table[m.away].gf += ga; table[m.away].ga += gh;
    if (gh > ga) { table[m.home].w++; table[m.home].pts += 3; table[m.away].l++; }
    else if (gh < ga) { table[m.away].w++; table[m.away].pts += 3; table[m.home].l++; }
    else { table[m.home].d++; table[m.away].d++; table[m.home].pts++; table[m.away].pts++; }
  });
  return Object.values(table).map((t: any) => ({ ...t, gd: t.gf - t.ga })).sort((a: any, b: any) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

function refLabel(r: string): string {
  if (r.startsWith('3_')) return `3° ${r.substring(2).split('').join('/')}`;
  if (r.startsWith('W')) return `G${r.substring(1)}`;
  if (r.startsWith('L')) return `P${r.substring(1)}`;
  return `${r[0]}° ${r.substring(1)}`;
}

type KOResolution = Record<string, { home: ResolvedTeam | null; away: ResolvedTeam | null }>;

function resolveAllKnockout(scores: Record<string, any>): KOResolution {
  const result: KOResolution = {};
  const groupTables: Record<string, TeamRow[]> = {};
  (Object.keys(INITIAL_GROUPS) as GroupId[]).forEach(gId => {
    groupTables[gId] = calcGroupTable(gId, scores);
  });
  const getGroupTeam = (ref: string): ResolvedTeam | null => {
    const pos = parseInt(ref[0]) - 1;
    const gId = ref.substring(1) as GroupId;
    const table = groupTables[gId];
    if (!table || !table[pos]) return null;
    if (table[pos].p === 0) return null;
    return { code: table[pos].team, name: table[pos].name };
  };
  const allThirds: (TeamRow & { group: string })[] = [];
  (Object.keys(INITIAL_GROUPS) as GroupId[]).forEach(gId => {
    const t = groupTables[gId];
    if (t[2] && t[2].p > 0) allThirds.push({ ...t[2], group: gId });
  });
  allThirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const qualifyingThirds = allThirds.slice(0, 8);
  const qualifyingGroupSet = new Set(qualifyingThirds.map(t => t.group));
  const thirdAllocation: Record<string, ResolvedTeam> = {};
  const assignedGroups = new Set<string>();
  const thirdMatches = KNOCKOUT_MATCHES.filter(m => m.phase === 'R32' && m.awayRef.startsWith('3_')).sort((a, b) => a.num - b.num);
  for (const match of thirdMatches) {
    const possibleGroups = match.awayRef.substring(2).split('');
    const available = qualifyingThirds.filter(t =>
      possibleGroups.includes(t.group) && qualifyingGroupSet.has(t.group) && !assignedGroups.has(t.group)
    );
    if (available.length > 0) {
      thirdAllocation[match.id] = { code: available[0].team, name: available[0].name };
      assignedGroups.add(available[0].group);
    }
  }
  const getWinnerOrLoser = (matchId: string, wantWinner: boolean): ResolvedTeam | null => {
    const score = scores[matchId];
    if (!score || score.home === '' || score.away === '' || score.home === undefined || score.away === undefined) return null;
    const h = +score.home, a = +score.away;
    if (h === a) return null;
    const side = (h > a) === wantWinner ? 'home' : 'away';
    return result[matchId]?.[side] || null;
  };
  const phaseOrder: KnockoutPhase[] = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];
  for (const phase of phaseOrder) {
    const matches = KNOCKOUT_MATCHES.filter(m => m.phase === phase);
    for (const match of matches) {
      const resolveRef = (r: string): ResolvedTeam | null => {
        if (r.startsWith('W')) return getWinnerOrLoser(`ko${r.substring(1)}`, true);
        if (r.startsWith('L')) return getWinnerOrLoser(`ko${r.substring(1)}`, false);
        if (r.startsWith('3_')) return thirdAllocation[match.id] || null;
        return getGroupTeam(r);
      };
      result[match.id] = { home: resolveRef(match.homeRef), away: resolveRef(match.awayRef) };
    }
  }
  return result;
}

// ═══════════════════════════════════════════
//  LOCAL STORAGE
// ═══════════════════════════════════════════

function loadLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

// ═══════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab]         = useState('fixtures');
  const [viewMode,  setViewMode]          = useState('day');
  const [selectedDate, setSelectedDate]   = useState(() => {
    const MONTH_NAMES_ES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
    const now = new Date();
    const todayStr = `${now.getDate()} ${MONTH_NAMES_ES[now.getMonth()]}`;
    return UNIQUE_DATES.includes(todayStr) ? todayStr : '11 JUNIO';
  });
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [koPhase, setKoPhase]             = useState<KnockoutPhase>('R32');
  const [status, setStatus]               = useState<'connecting'|'connected'|'error'>('connecting');

  const [globalScores, setGlobalScores]   = useState<Record<string,{home:number|string,away:number|string}>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string,{home:number|string,away:number|string}>>({});
  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;
  const currentScores = { ...globalScores, ...unsavedChanges };

  const [favorites, setFavorites] = useState<string[]>(() => loadLS(LS_FAVS, ['ARG','MEX','COL','URU']));
  useEffect(() => { localStorage.setItem(LS_FAVS, JSON.stringify(favorites)); }, [favorites]);

  // Firebase sync
  useEffect(() => {
    const scoresRef = ref(database, 'global/scores');
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      setGlobalScores(data || {});
      setStatus('connected');
    }, () => setStatus('error'));
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleScoreChange = (id: string, field: 'home'|'away', action: 'increment' | 'decrement') => {
    const existing = currentScores[id] || { home: '', away: '' };
    const currentVal = existing[field];
    let newVal: number | string = '';
    if (action === 'increment') {
      newVal = (currentVal === '' || currentVal === undefined) ? 0 : +currentVal + 1;
    } else if (action === 'decrement') {
      if (currentVal === '' || currentVal === undefined || +currentVal === 0) { newVal = ''; }
      else { newVal = +currentVal - 1; }
    }
    setUnsavedChanges(prev => ({ ...prev, [id]: { ...existing, [field]: newVal } }));
  };

  const handleSave = () => {
    if (!hasUnsavedChanges) return;
    const updates: Record<string, any> = {};
    for (const [id, match] of Object.entries(unsavedChanges)) {
      updates[`global/scores/${id}`] = match;
    }
    update(ref(database), updates).then(() => setUnsavedChanges({})).catch(err => console.error("Save error:", err));
  };

  const handleDiscard = () => setUnsavedChanges({});

  const toggleFavorite = (team: string) => {
    setFavorites(prev => prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]);
  };

  // Computed
  const calculateGroupTable = (gId: GroupId) => calcGroupTable(gId, currentScores);

  const getAllThirds = () => {
    const thirds: any[] = [];
    (Object.keys(INITIAL_GROUPS) as GroupId[]).forEach(gId => {
      const s = calculateGroupTable(gId);
      if (s[2]) thirds.push({...s[2], group: gId});
    });
    return thirds.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).slice(0,8);
  };

  const knockoutResolution = useMemo(() => resolveAllKnockout(currentScores), [currentScores]);

  const filteredMatches = OFFICIAL_MATCHES.filter(m => {
    if (viewMode === 'day')   return m.date === selectedDate;
    if (viewMode === 'group') return m.group === selectedGroup;
    return favorites.includes(m.home) || favorites.includes(m.away);
  });

  const koMatchesForPhase = KNOCKOUT_MATCHES.filter(m => m.phase === koPhase).sort((a,b) => a.num - b.num);
  const koMatchesForDay   = KNOCKOUT_MATCHES.filter(m => m.date === selectedDate).sort((a,b) => a.num - b.num);

  // ── Render helpers ──

  const tabBtn = (id: string, icon: React.ReactNode, label: string) => (
    <button onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${activeTab === id ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
      {icon}<span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );

  // ── Score controls reutilizables ──
  const renderScoreControls = (matchId: string) => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
        {(['home', 'away'] as const).map(field => (
          <div key={field} className="flex justify-between items-center bg-gray-50 py-1 px-1.5 rounded-xl border border-gray-200">
            <button onClick={() => handleScoreChange(matchId, field, 'decrement')}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 active:bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
              <Minus className="w-4 h-4"/>
            </button>
            <span className="text-xs font-extrabold text-gray-400">{field === 'home' ? 'L' : 'V'}</span>
            <button onClick={() => handleScoreChange(matchId, field, 'increment')}
              className="w-8 h-8 rounded-lg bg-blue-500 active:bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
              <Plus className="w-4 h-4"/>
            </button>
          </div>
        ))}
      </div>
    );
  };

  // ── Render de tarjeta para partido eliminatorio ──
  const renderKnockoutCard = (match: KOMatch) => {
    const resolved = knockoutResolution[match.id] || { home: null, away: null };
    const score = currentScores[match.id] || { home: '', away: '' };
    const isEdited = unsavedChanges.hasOwnProperty(match.id);

    const renderTeamSlot = (team: ResolvedTeam | null, refStr: string, side: 'home' | 'away') => {
      const isFav = team ? favorites.includes(team.code) : false;
      const flag = team ? FLAGS[team.code] : null;
      return (
        <div className="col-span-4 flex flex-col items-center text-center relative">
          {team && (
            <button onClick={() => toggleFavorite(team.code)}
              className={`absolute -top-3 ${side === 'home' ? 'left-1' : 'right-1'} p-1 z-10`}>
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>
            </button>
          )}
          {flag ? (
            <img src={`https://flagcdn.com/w40/${flag}.png`} alt={team?.code} className="h-6 mb-1 rounded-sm shadow-sm object-contain" />
          ) : (
            <div className="h-6 mb-1 flex items-center justify-center text-gray-300 text-xl">🏳️</div>
          )}
          <span className={`font-black text-sm tracking-tight ${team ? 'text-gray-700' : 'text-gray-400'}`}>
            {team ? team.code : refLabel(refStr)}
          </span>
          <span className={`text-xs truncate max-w-full ${team ? 'text-gray-500' : 'text-gray-400 italic'}`}>
            {team ? team.name : 'Por definir'}
          </span>
        </div>
      );
    };

    const phaseBadgeColor: Record<KnockoutPhase, string> = {
      R32: 'text-sky-600 bg-sky-50',
      R16: 'text-violet-600 bg-violet-50',
      QF:  'text-amber-600 bg-amber-50',
      SF:  'text-rose-600 bg-rose-50',
      '3RD': 'text-orange-600 bg-orange-50',
      FINAL: 'text-yellow-700 bg-yellow-50',
    };

    return (
      <div key={match.id} className={`bg-white border-2 ${isEdited ? 'border-blue-400 shadow-blue-100 shadow-lg' : 'border-gray-100'} rounded-2xl p-4 shadow-sm transition-all`}>
        {/* Header */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase mb-3 pb-2 border-b border-gray-100">
          <span className={`px-2 py-0.5 rounded-lg font-black ${phaseBadgeColor[match.phase]}`}>
            M{match.num}
          </span>
          <span className="text-gray-500">{match.date} · {match.time} ARG</span>
          <span className="text-gray-400 truncate max-w-[100px] text-right">{match.venue}</span>
        </div>
        {/* Scoreboard */}
        <div className="grid grid-cols-12 items-center gap-1.5 my-2.5">
          {renderTeamSlot(resolved.home, match.homeRef, 'home')}
          <div className="col-span-4 bg-gray-50 border-2 border-blue-100 rounded-xl py-2 px-2 flex justify-center items-center gap-2">
            <span className="text-2xl font-black text-blue-600 min-w-[24px] text-center">
              {score.home !== '' && score.home !== undefined ? score.home : '-'}
            </span>
            <span className="text-base font-bold text-gray-300">:</span>
            <span className="text-2xl font-black text-blue-600 min-w-[24px] text-center">
              {score.away !== '' && score.away !== undefined ? score.away : '-'}
            </span>
          </div>
          {renderTeamSlot(resolved.away, match.awayRef, 'away')}
        </div>
        {/* Controls */}
        {renderScoreControls(match.id)}
      </div>
    );
  };

  // ═══════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════

  return (
    <div className="max-w-md mx-auto bg-gray-50 text-gray-800 min-h-screen flex flex-col font-sans pb-28 shadow-2xl relative select-none">

      {/* ── HEADER ── */}
      <header className="bg-white p-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-800">MUNDIAL 2026</h1>
              <p className="text-[11px] text-gray-400 font-medium">By Capol!</p>
            </div>
          </div>
          {hasUnsavedChanges && (
            <div className="flex gap-1.5 items-center">
              <button onClick={handleDiscard} className="text-rose-500 font-bold text-xs px-2 py-1.5 uppercase hover:bg-rose-50 rounded-lg transition-colors">
                Descartar
              </button>
              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-black text-xs uppercase px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md transition-all">
                <Save className="w-3.5 h-3.5"/> Guardar
              </button>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
          <span className="text-gray-400 font-medium">Estado Nube Global:</span>
          <span className={`font-bold flex items-center gap-1 transition-colors ${status==='connected'?'text-blue-500':status==='connecting'?'text-blue-400':'text-rose-500'}`}>
            {status === 'connected' ? <><CloudLightning className="w-3.5 h-3.5"/>Conectado (En vivo)</> :
             status === 'connecting' ? <><RefreshCw className="w-3 h-3 animate-spin"/>Conectando...</> :
             'Error de conexión'}
          </span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 p-3 overflow-y-auto">

        {/* ══════ FIXTURES (Fase de Grupos) ══════ */}
        {activeTab === 'fixtures' && (
          <div>
            <div className="flex bg-white p-1 rounded-xl mb-4 border border-gray-100 shadow-sm">
              {(['day','group','favs'] as const).map((m,i) => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`flex-1 py-2 text-center font-bold text-sm rounded-lg transition-all ${viewMode===m?'bg-blue-500 text-white shadow-md':'text-gray-400'}`}>
                  {['Por Día','Por Grupo','Favoritos ⭐'][i]}
                </button>
              ))}
            </div>

            {viewMode === 'day' && (
              <div className="flex items-center gap-1 mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <button onClick={() => { const i = UNIQUE_DATES.indexOf(selectedDate); if (i > 0) setSelectedDate(UNIQUE_DATES[i-1]); }}
                  className="p-1.5 text-blue-500 active:scale-95 transition-transform rounded-lg hover:bg-blue-50">
                  <ChevronLeft className="w-5 h-5"/>
                </button>
                <div className="flex-1 text-center font-black text-base text-blue-600 tracking-wider">{selectedDate}</div>
                <button onClick={() => { const i = UNIQUE_DATES.indexOf(selectedDate); if (i < UNIQUE_DATES.length-1) setSelectedDate(UNIQUE_DATES[i+1]); }}
                  className="p-1.5 text-blue-500 active:scale-95 transition-transform rounded-lg hover:bg-blue-50">
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            )}

            {viewMode === 'group' && (
              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {Object.keys(INITIAL_GROUPS).map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)}
                    className={`py-1.5 font-bold text-sm rounded-xl border-2 transition-all ${selectedGroup===g?'bg-blue-500 text-white border-blue-400 shadow-md scale-105':'bg-white text-gray-500 border-gray-100 shadow-sm'}`}>
                    {g}
                  </button>
                ))}
              </div>
            )}

            {viewMode === 'favs' && filteredMatches.length === 0 && (
              <div className="text-center py-10 px-4 text-gray-400 text-sm bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                <Star className="w-8 h-8 text-gray-200 mx-auto mb-2"/>
                <p>No hay favoritos aún.</p>
                <p className="mt-1 text-[11px] text-gray-400">Tocá la ⭐ de cualquier equipo para seguirlo acá.</p>
              </div>
            )}

            <div className="space-y-3">
              {viewMode === 'day' && koMatchesForDay.length > 0
                ? koMatchesForDay.map(renderKnockoutCard)
                : filteredMatches.map(match => {
                const group = INITIAL_GROUPS[match.group as GroupId];
                const homeName = (group.teamNames as any)[match.home];
                const awayName = (group.teamNames as any)[match.away];
                const score = currentScores[match.id] || {home:'',away:''};
                const isEdited = unsavedChanges.hasOwnProperty(match.id);
                const homeFlag = FLAGS[match.home];
                const awayFlag = FLAGS[match.away];
                return (
                  <div key={match.id} className={`bg-white border-2 ${isEdited ? 'border-blue-400 shadow-blue-100 shadow-lg' : 'border-gray-100'} rounded-2xl p-4 shadow-sm transition-all`}>
                    {/* Header del partido */}
                    <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase mb-3 pb-2 border-b border-gray-100">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black">Grupo {match.group}</span>
                      <span>{match.date} · {match.time} ARG</span>
                      <span className="text-gray-400 truncate max-w-[90px] text-right">{match.venue}</span>
                    </div>
                    {/* Equipos + Score */}
                    <div className="grid grid-cols-12 items-center gap-1.5 my-2.5">
                      {/* Local */}
                      <div className="col-span-4 flex flex-col items-center text-center relative">
                        <button onClick={() => toggleFavorite(match.home)} className="absolute -top-3 left-1 p-1 z-10">
                          <Star className={`w-4 h-4 ${favorites.includes(match.home)?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>
                        </button>
                        {homeFlag ? <img src={`https://flagcdn.com/w40/${homeFlag}.png`} alt={match.home} className="h-6 mb-1 rounded-sm shadow-sm object-contain" /> : <div className="h-6 mb-1 text-xl">🏳️</div>}
                        <span className="font-black text-sm text-gray-700">{match.home}</span>
                        <span className="text-xs text-gray-400 truncate max-w-full">{homeName}</span>
                      </div>
                      {/* Marcador */}
                      <div className="col-span-4 bg-gray-50 border-2 border-blue-100 rounded-xl py-2 px-2 flex justify-center items-center gap-2">
                        <span className="text-2xl font-black text-blue-600 min-w-[24px] text-center">
                          {score.home !== '' && score.home !== undefined ? score.home : '-'}
                        </span>
                        <span className="text-base font-bold text-gray-300">:</span>
                        <span className="text-2xl font-black text-blue-600 min-w-[24px] text-center">
                          {score.away !== '' && score.away !== undefined ? score.away : '-'}
                        </span>
                      </div>
                      {/* Visitante */}
                      <div className="col-span-4 flex flex-col items-center text-center relative">
                        <button onClick={() => toggleFavorite(match.away)} className="absolute -top-3 right-1 p-1 z-10">
                          <Star className={`w-4 h-4 ${favorites.includes(match.away)?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>
                        </button>
                        {awayFlag ? <img src={`https://flagcdn.com/w40/${awayFlag}.png`} alt={match.away} className="h-6 mb-1 rounded-sm shadow-sm object-contain" /> : <div className="h-6 mb-1 text-xl">🏳️</div>}
                        <span className="font-black text-sm text-gray-700">{match.away}</span>
                        <span className="text-xs text-gray-400 truncate max-w-full">{awayName}</span>
                      </div>
                    </div>
                    {renderScoreControls(match.id)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════ TABLAS ══════ */}
        {activeTab === 'tables' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
              <h2 className="text-base font-black text-gray-800 tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500"/> POSICIONES — GRUPO {selectedGroup}
              </h2>
              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {Object.keys(INITIAL_GROUPS).map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)}
                    className={`py-1.5 text-center font-bold text-[11px] rounded-xl border-2 transition-all ${selectedGroup===g?'bg-blue-500 text-white border-blue-400 scale-105 shadow-md':'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-bold uppercase text-xs">
                    <th className="py-2">Equipo</th><th className="py-2 text-center">PJ</th>
                    <th className="py-2 text-center">GF</th><th className="py-2 text-center">DG</th>
                    <th className="py-2 text-right text-blue-600">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateGroupTable(selectedGroup as GroupId).map((row, idx) => (
                    <tr key={row.team} className={`border-b border-gray-100 ${idx < 2 ? 'bg-blue-50/60' : ''}`}>
                      <td className="py-2.5 font-bold flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-3">{idx+1}</span>
                        {FLAGS[row.team] ? <img src={`https://flagcdn.com/w20/${FLAGS[row.team]}.png`} alt={row.team} className="w-5 rounded-[2px] shadow-sm object-contain" /> : <span className="text-lg leading-none">🏳️</span>}
                        <span className="text-gray-700">{row.name}</span>
                      </td>
                      <td className="py-2.5 text-center text-gray-500">{row.p}</td>
                      <td className="py-2.5 text-center text-gray-500">{row.gf}</td>
                      <td className="py-2.5 text-center font-semibold text-gray-600">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="py-2.5 text-right font-black text-blue-600 text-base">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════ TERCEROS ══════ */}
        {activeTab === 'thirds' && (
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <h2 className="text-base font-black text-gray-800 tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500"/> MEJORES TERCEROS
            </h2>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
              Los 8 mejores terceros de los 12 grupos clasifican a Dieciséisavos.
            </p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 font-bold uppercase text-xs">
                  <th className="py-2">Equipo</th><th className="py-2 text-center">PJ</th>
                  <th className="py-2 text-center">DG</th><th className="py-2 text-right text-blue-600">Pts</th>
                </tr>
              </thead>
              <tbody>
                {getAllThirds().map((row, idx) => (
                  <tr key={row.team} className="border-b border-gray-100">
                    <td className="py-2.5 font-bold flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-3">{idx+1}</span>
                      {FLAGS[row.team] ? <img src={`https://flagcdn.com/w20/${FLAGS[row.team]}.png`} alt={row.team} className="w-5 rounded-[2px] shadow-sm object-contain" /> : <span className="text-lg leading-none">🏳️</span>}
                      <span className="text-gray-700">{row.name}</span>
                      <span className="text-xs text-blue-500 ml-0.5">({row.group})</span>
                    </td>
                    <td className="py-2.5 text-center text-gray-500">{row.p}</td>
                    <td className="py-2.5 text-center text-gray-600 font-semibold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td className="py-2.5 text-right font-black text-blue-600 text-base">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════ ELIMINATORIAS ══════ */}
        {activeTab === 'knockout' && (
          <div>
            {/* Sub-pestañas por fase */}
            <div className="flex bg-white p-1 rounded-xl mb-4 border border-gray-100 shadow-sm overflow-x-auto gap-0.5">
              {KNOCKOUT_PHASES.map(phase => (
                <button key={phase} onClick={() => setKoPhase(phase)}
                  className={`flex-shrink-0 py-2 px-3 text-center font-bold text-[11px] rounded-lg transition-all whitespace-nowrap ${
                    koPhase === phase ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400'
                  }`}>
                  {PHASE_NAMES[phase]}
                </button>
              ))}
            </div>

            {/* Título de la fase */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-600"/>
              </div>
              <h2 className="text-base font-black text-gray-800 tracking-wider uppercase">
                {PHASE_NAMES[koPhase]}
              </h2>
              <span className="text-xs text-gray-400 font-bold ml-auto">
                {koMatchesForPhase.length} {koMatchesForPhase.length === 1 ? 'partido' : 'partidos'}
              </span>
            </div>

            {/* Info de la fase */}
            {koPhase === 'R32' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-[11px] text-blue-600 leading-relaxed">
                <p>Los 2 primeros de cada grupo + los 8 mejores terceros avanzan. Los equipos se resuelven automáticamente según tus predicciones de la fase de grupos.</p>
              </div>
            )}
            {koPhase === 'FINAL' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-[11px] text-amber-600 leading-relaxed text-center font-black">
                🏆 LA GRAN FINAL 🏆
              </div>
            )}

            {/* Lista de partidos */}
            <div className="space-y-3">
              {koMatchesForPhase.map(renderKnockoutCard)}
            </div>
          </div>
        )}

      </main>

      {/* ── NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-2 flex justify-around items-center z-50 shadow-lg">
        {tabBtn('fixtures', <Calendar className="w-5 h-5"/>, 'Grupos')}
        {tabBtn('tables',   <Users    className="w-5 h-5"/>, 'Tablas')}
        {tabBtn('thirds',   <Award    className="w-5 h-5"/>, 'Terceros')}
        {tabBtn('knockout', <Trophy   className="w-5 h-5"/>, 'Eliminatorias')}
      </nav>

    </div>
  );
}
