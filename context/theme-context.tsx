import { createContext, useContext, useState, ReactNode } from 'react';
import { Brand, BrandLight } from '@/constants/theme';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof Brand;
  textColor: string;
  subTextColor: string;
  borderColor: string;
  dividerColor: string;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? Brand : BrandLight;

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme: () => setIsDark(v => !v),
      theme,
      textColor: isDark ? '#fff' : '#0D1F17',
      subTextColor: isDark ? '#ffffff60' : '#4a6b5a',
      borderColor: isDark ? '#ffffff10' : '#00000010',
      dividerColor: isDark ? '#ffffff08' : '#00000008',
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
