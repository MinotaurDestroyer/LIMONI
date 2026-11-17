/**
 * js/config.js
 * Global constants, balancing parameters, weapon tiers, and Dusk region metadata.
 */
window.Lumen = window.Lumen || {};

Lumen.CONFIG = {
  WORLD_W: 2400,
  WORLD_H: 1800,
  STORAGE_KEY: 'lumen_firefly_highscore_v1',

  PLAYER: {
    MAX_HP: 5,
    MAX_SPEED: 355,
    ACCEL: 11.5,
    DASH_SPEED: 760,
    DASH_CD: 2.2,
    DASH_DURATION: 0.24,
    PULSE_RADIUS: 175,
    MAGNET_RADIUS: 195
  },

  BOSS: {
    BASE_HP: 2200,
    HP_PER_DUSK: 1100,
    PHASE_2_THRESHOLD: 0.65,
    PHASE_3_THRESHOLD: 0.30,
    ARMOR_SOFT_CAP: 28,
    ARMOR_EXCESS_MULT: 0.28,
    ARMOR_DECAY_PER_SEC: 460,
    GUARD_DURATION: 3.0,
    GUARD_DAMAGE_MULT: 0.35
  },

  DUSK_REGIONS: [
    'THE WHISPERING GLADE',
    'MOSSBOUND HOLLOW',
    'SILVERFERN CANOPY',
    'TWILIGHT SANCTUARY',
    'STARLIT MIRE',
    'EMERALD ABYSS',
    'MOONLIT THICKET',
    'THE ETERNAL DUSK'
  ],

  BOSS_VARIANTS: [
    {
      eyebrow: 'FINAL DUSK',
      title: 'The Umbral Moth',
      barName: 'THE UMBRAL MOTH',
      subtitle: 'The Heart of the Quiet Night'
    },
    {
      eyebrow: 'DEEPENING DUSK',
      title: 'The Velvet Sovereign',
      barName: 'THE VELVET SOVEREIGN',
      subtitle: 'Weaver of Violet Shadows'
    },
    {
      eyebrow: 'ECLIPSE DUSK',
      title: 'The Nocturne Empress',
      barName: 'THE NOCTURNE EMPRESS',
      subtitle: 'Keeper of the Starless Canopy'
    }
  ],

  WEAPON_TIERS: [
    { name: 'EMBER', rate: 0.145, dmg: 13 },
    { name: 'GLEAM', rate: 0.135, dmg: 11 },
    { name: 'RADIANCE', rate: 0.125, dmg: 10 },
    { name: 'SOLARIS', rate: 0.115, dmg: 9.5 },
    { name: 'ASTRAL', rate: 0.105, dmg: 9 }
  ]
};