// spec.js: AURA BIO, pack pousse des cheveux 5 en 1 pour hommes, 49 DT. A 20 s kinetic promo.
// Every number is a beat at 160 BPM (0.375 s). Music and sounds: make_audio.py; pack picture: make_art.py.
// Prices and phone come from src/config.ts. No health claims (see CAMPAGNE.md).
import { Words, Picture, Fly, Hero, Logo } from './blocks.js';

export default {
  title: 'AURA BIO - Pack 5 en 1',
  bpm: 160, beats: 54, fps: 60,
  palette: { bg: '#071A33', paper: '#FBF4E8', accent: '#D9A441', hot: '#B8621B', ink: '#071A33' },
  hud: 'AURA BIO  ·  PACK 5 EN 1', hudOut: [51, 53],
  // the drop of the track is beat 8 (3.0 s); the music stops dead on the logo hit
  music: { file: 'audio/music.wav', offset: 0, stopBeat: 43, gain: -6 },
  sounds: { cash: -2 },
  cues: [[38, 'cash', 1]],

  scenes: [
    // the hook, then the drop
    [Words, 0, 8, { charge: true, shots: [
      { at: 1, style: 'punch3d', text: 'TES CHEVEUX', fx: 'punch' },
      { at: 2, style: 'slam', text: 'MÉRITENT', ground: 'accent' },
      { at: 3, style: 'stack', text: ['UN VRAI', 'RITUEL.'], ground: 'paper', in: 'whipX', fx: 'none' },
      { at: 5, style: 'split', text: ['VOICI', 'LE PACK.'], in: 'whipY', fx: 'punch', big: true },
      { at: 7, style: 'cut', text: '5 EN 1', color: 'accent', size: 620, rot: -5, fx: 'beat' },
    ] }],
    [Hero, 8, 16, { kicker: 'AURA BIO', title: '5 EN 1', sub: 'pack pousse des cheveux pour hommes', whipOut: [0, 1150, .13] }],
    // the five pieces: a cut-in on each product with its name
    [Picture, 16, 24, { src: 'art/pack.png', reveal: 'slash', focus: [.5, .6], tint: .35, weather: 'dust', y: 250,
      words: [[0.5, 'DERMA ROLLER', 'paper'], [2, 'HUILE DE ROMARIN', 'accent'], [3.5, 'APPLICATEUR', 'paper'], [5, 'SIDR ROYAL', 'accent'], [6.5, 'BROSSE MASSANTE', 'paper']],
      cutIns: [[0.5, 1.8, [.24, .8]], [2, 1.9, [.37, .6]], [3.5, 1.9, [.5, .62]], [5, 2.0, [.63, .7]], [6.5, 1.7, [.76, .78]]] }],
    // the routine, flown through
    [Fly, 24, 35, { words: [['ROULE.', 'paper'], ['APPLIQUE.', 'accent'], ['MASSE.', 'paper'], ['RÉPÈTE.', 'accent']] }],
    // the price
    [Words, 35, 43, { shots: [
      { at: 35, style: 'stack', text: ['VALEUR', '110 DT'], ground: 'paper', in: 'whipX', fx: 'beat' },
      { at: 37, style: 'cut', text: "AUJOURD'HUI", ground: 'accent', size: 360, rot: 3, fx: 'beat' },
      { at: 38, style: 'punch3d', text: '49 DT', fx: 'punch', big: true },
      { at: 40, style: 'cut', text: 'PAIEMENT', ground: 'paper', size: 420, fx: 'beat' },
      { at: 40.5, style: 'cut', text: 'À LA LIVRAISON.', color: 'accent', size: 300, rot: -3, fx: 'beat' },
      { at: 41.5, style: 'cut', text: 'COMMANDE', ground: 'accent', size: 440, rot: 4, fx: 'beat' },
      { at: 42, style: 'cut', text: 'MAINTENANT.', color: 'accent', size: 400, rot: -5, rgb: true, fx: 'beat' },
    ], exit: { type: 'flash', at: 42.5 } }],
    [Logo, 43, 54, { wordmark: 'AURA BIO', tagline: 'Pack pousse des cheveux 5 en 1 · 49 DT', small: 'COMMANDE : 50 500 051  ·  PAIEMENT À LA LIVRAISON' }],
  ],
  captions: [],
};
