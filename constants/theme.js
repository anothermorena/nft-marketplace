//1. app colors
//=============
export const COLORS = {
    primary: "#001F2D",
    secondaryDark: "#4D626C",
    brand: '#6D28D9',
    green: '#10B981',
    white: "#ffffff",
    gray: "#74858C",
    tertiary: '#1F2937',
    secondaryLight: '#E5E7EB',
    darkLight: '#9CA3AF',
    red: '#EF4444',
    lightGreen: 'rgba(16, 185, 129, 0.1)',
  };
  
  
//2. app sizes
//============
export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
  };
  
//3. app fonts
//============
  export const FONTS = {
    bold: "InterBold",
    semiBold: "InterSemiBold",
    medium: "InterMedium",
    regular: "InterRegular",
    light: "InterLight",
  };

//4. app shadows
//=============
export const SHADOWS = {
  light: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  
    elevation: 14,
  },
};