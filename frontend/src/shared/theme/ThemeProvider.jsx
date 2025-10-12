import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ThemeModeContext = createContext(undefined);

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('tm_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('tm_theme_mode', mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#2563eb' : '#60a5fa' },
      secondary: { main: mode === 'light' ? '#0ea5e9' : '#38bdf8' },
      background: {
        default: mode === 'light' ? '#f7f7fb' : '#0b1020',
        paper: mode === 'light' ? '#ffffff' : '#10162d'
      }
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'Apple Color Emoji',
        'Segoe UI Emoji'
      ].join(',')
    },
    components: {
      MuiButton: { defaultProps: { variant: 'contained' } },
      MuiCard: { styleOverrides: { root: { borderRadius: 14 } } },
      MuiAppBar: { styleOverrides: { root: { backdropFilter: 'saturate(180%) blur(8px)' } } },
      MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } }
    }
  }), [mode]);

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within AppThemeProvider');
  return ctx;
}
