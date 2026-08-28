import { Platform } from 'react-native';

const createShadow1 = (color?: string) =>
  Platform.select({
    web: {
      boxShadow: `0px 10px 30px ${color ? color : 'rgba(0, 0, 0, 0.15)'}`,
    },
    ios: {
      shadowColor: color ? color : '#000000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.15,
      shadowRadius: 15,
    },
    android: {
      elevation: 10,
    },
  });

const create1 = (color?: string) =>
  Platform.select({
    web: {
      boxShadow: `0px 0px 60px ${color ? color : 'rgba(8, 25, 29, 0.1)'}`,
    },
    ios: {
      shadowColor: color ? color : '#08191D',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 30,
    },
    android: {
      elevation: 8,
    },
  });

const create2 = (color?: string) =>
  Platform.select({
    web: {
      boxShadow: `0px 0px 40px ${color ? color : 'rgba(8, 25, 29, 0.1)'}`,
    },
    ios: {
      shadowColor: color ? color : '#08191D',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    },
    android: {
      elevation: 6,
    },
  });

export const shadows = {
  shadow1: Object.assign((color?: string) => createShadow1(color), createShadow1()),
  1: Object.assign((color?: string) => create1(color), create1()),
  2: Object.assign((color?: string) => create2(color), create2()),
} as const;

export const createShadow = (x: number, y: number, blur: number, spread: number, color: string) =>
  Platform.select({
    web: {
      boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`,
    },

    ios: {
      shadowColor: color,
      shadowOffset: {
        width: x,
        height: y,
      },
      shadowOpacity: 1,
      shadowRadius: blur / 2,
    },

    android: {
      shadowColor: color,
      elevation: Math.max(1, Math.round(blur / 4 + Math.max(y, 0) / 2)),
    },
  }) ?? {};
