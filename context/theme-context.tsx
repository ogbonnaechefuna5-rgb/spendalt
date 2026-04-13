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
      textColor: isDark ? '#FFFFFF' : '#1A0F3C',
      subTextColor: isDark ? '#8E8E93' : '#6B5FA0',
      borderColor: isDark ? '#ffffff12' : '#7C3AED18',
      dividerColor: isDark ? '#ffffff0A' : '#7C3AED10',
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
