import React, { createContext, useContext, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './modules/app/App';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

function AppWithTheme() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#6200ea',
                  light: '#9d46ff',
                  dark: '#0a00b6',
                },
                secondary: {
                  main: '#03dac6',
                  light: '#66fff9',
                  dark: '#00a896',
                },
                background: {
                  default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  paper: 'rgba(255, 255, 255, 0.9)',
                },
                text: {
                  primary: '#212121',
                  secondary: '#757575',
                },
              }
            : {
                primary: {
                  main: '#bb86fc',
                  light: '#e2b8ff',
                  dark: '#8858c8',
                },
                secondary: {
                  main: '#03dac6',
                  light: '#66fff9',
                  dark: '#00a896',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#b0b0b0',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 500 },
          h5: { fontWeight: 500 },
          h6: { fontWeight: 500 },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.23)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.18)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRight: '1px solid rgba(255,255,255,0.2)',
              },
            },
          },
        },
      }),
    [mode],
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      }
    }
  });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithTheme />
  </React.StrictMode>
);
