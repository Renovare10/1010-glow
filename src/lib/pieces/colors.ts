/**
 * Centralized color schemes for the 1010-Glow game.
 * Supports multiple themes for scalability.
 */
export interface ColorMap {
  [key: string]: string;
}

export interface Theme {
  name: string;
  colors: ColorMap;
}

export const themes: Theme[] = [
  {
    name: 'dark',
    colors: {
      square: '#88c0d0', // Frost Blue
      L: '#4c566a', // Pine Green
      L_90: '#4c566a',
      L_180: '#4c566a',
      L_270: '#4c566a',
      smallL: '#b48ead', // Aurora Purple
      smallL_90: '#b48ead',
      smallL_180: '#b48ead',
      smallL_270: '#b48ead',
      bar5_h: '#bf616a', // Aurora Red
      bar5_v: '#bf616a',
      bar4_h: '#ebcb8b', // Snow Yellow
      bar4_v: '#ebcb8b',
      bar3_h: '#8fbcbb', // Frost Cyan
      bar3_v: '#8fbcbb',
      bar2_h: '#d08770', // Aurora Orange
      bar2_v: '#d08770',
      single: '#e5e9f0', // Polar White
      cube3: '#81a1c1' // Frost Teal
    }
  }
];

// Default theme
export const colorMap: ColorMap = themes.find(theme => theme.name === 'dark')!.colors;