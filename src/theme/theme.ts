// import { createTheme } from '@mui/material/styles';
//
// export const theme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#4ade80', // Bright green like in the image
//       light: '#86efac',
//       dark: '#22c55e',
//     },
//     secondary: {
//       main: '#3b82f6', // Bright blue
//       light: '#93c5fd',
//       dark: '#2563eb',
//     },
//     success: {
//       main: '#10b981', // Emerald green
//       light: '#34d399',
//       dark: '#059669',
//     },
//     warning: {
//       main: '#f59e0b', // Amber
//       light: '#fbbf24',
//       dark: '#d97706',
//     },
//     error: {
//       main: '#ef4444', // Red
//       light: '#f87171',
//       dark: '#dc2626',
//     },
//     info: {
//       main: '#06b6d4', // Cyan
//       light: '#22d3ee',
//       dark: '#0891b2',
//     },
//     background: {
//       default: '#0f0f23', // Deep dark blue-black like the image
//       paper: '#1a1a2e',   // Slightly lighter dark blue
//       secondary: '#16213e', // Dark blue for cards
//     },
//     text: {
//       primary: '#ffffff',   // Pure white text
//       secondary: '#e2e8f0', // Light grey text
//       disabled: '#94a3b8',  // Muted text
//     },
//     divider: '#334155',     // Dark blue-grey dividers
//     action: {
//       hover: '#1e293b',     // Hover state
//       selected: '#334155',   // Selected state
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 700,
//       fontSize: '2.5rem',
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontWeight: 600,
//       fontSize: '2rem',
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontWeight: 600,
//       fontSize: '1.75rem',
//       lineHeight: 1.4,
//     },
//     h4: {
//       fontWeight: 500,
//       fontSize: '1.5rem',
//       lineHeight: 1.4,
//     },
//     h5: {
//       fontWeight: 500,
//       fontSize: '1.25rem',
//       lineHeight: 1.4,
//     },
//     h6: {
//       fontWeight: 500,
//       fontSize: '1.125rem',
//       lineHeight: 1.4,
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//     },
//     body2: {
//       fontSize: '0.875rem',
//       lineHeight: 1.6,
//     },
//   },
//   shape: {
//     borderRadius: 12, // Rounded corners like the image
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#1a1a2e',
//           border: '1px solid #334155',
//           borderRadius: 12,
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//           transition: 'all 0.2s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-2px)',
//             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//             borderColor: '#4ade80',
//           },
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#1a1a2e',
//           borderBottom: '1px solid #334155',
//           boxShadow: 'none',
//         },
//       },
//     },
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: '#0f0f23',
//           borderRight: '1px solid #334155',
//           boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: 'none',
//           fontWeight: 600,
//           padding: '10px 20px',
//           transition: 'all 0.2s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-1px)',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           },
//         },
//         contained: {
//           boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//           '&:hover': {
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           },
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 6,
//           fontWeight: 500,
//         },
//       },
//     },
//     MuiLinearProgress: {
//       styleOverrides: {
//         root: {
//           borderRadius: 4,
//           height: 8,
//         },
//         bar: {
//           borderRadius: 4,
//         },
//       },
//     },
//   },
// });


// theme.ts
import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    colorSchemes: {
        dark: true,
        light: true,
    },
    palette: {
        mode: "dark",
        primary: {
            main: "hsl(210, 100%, 60%)",  // Bright blue
            light: "hsl(210, 100%, 70%)",
            dark: "hsl(210, 100%, 50%)",
            contrastText: "hsl(222, 15%, 8%)",
        },
        secondary: {
            main: "hsl(45, 90%, 60%)",   // Orange (warnings/accent)
            light: "hsl(45, 100%, 70%)",
            dark: "hsl(45, 80%, 50%)",
            contrastText: "hsl(222, 15%, 8%)",
        },
        success: {
            main: "hsl(120, 60%, 50%)",  // Industrial green
            light: "hsl(120, 70%, 60%)",
            dark: "hsl(120, 60%, 40%)",
        },
        warning: {
            main: "hsl(45, 90%, 60%)",
            light: "hsl(45, 100%, 70%)",
            dark: "hsl(45, 80%, 50%)",
        },
        error: {
            main: "hsl(0, 70%, 60%)",    // Destructive red
            light: "hsl(0, 80%, 70%)",
            dark: "hsl(0, 65%, 50%)",
        },
        info: {
            main: "hsl(210, 80%, 60%)",  // Lighter blue for info
            light: "hsl(210, 85%, 70%)",
            dark: "hsl(210, 70%, 50%)",
        },
        background: {
            default: "hsl(222, 15%, 8%)",   // Deep industrial background
            paper: "hsl(222, 15%, 10%)",    // Cards / surfaces
        },
        text: {
            primary: "hsl(210, 15%, 92%)",   // Light foreground text
            secondary: "hsl(210, 10%, 60%)", // Muted text
            disabled: "hsl(210, 10%, 40%)",  // Disabled text
        },
        divider: "hsl(222, 15%, 18%)",     // Subtle border color
        action: {
            hover: "hsl(222, 15%, 15%)",
            selected: "hsl(222, 15%, 18%)",
        },
    },
    typography: {
        fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        h1: {fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2},
        h2: {fontWeight: 600, fontSize: "2rem", lineHeight: 1.3},
        h3: {fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.4},
        h4: {fontWeight: 500, fontSize: "1.5rem", lineHeight: 1.4},
        h5: {fontWeight: 500, fontSize: "1.25rem", lineHeight: 1.4},
        h6: {fontWeight: 500, fontSize: "1.125rem", lineHeight: 1.4},
        body1: {fontSize: "1rem", lineHeight: 1.6},
        body2: {fontSize: "0.875rem", lineHeight: 1.6},
    },
    shape: {
        borderRadius: 8, // matches industrial theme (slightly less rounded than your previous 12)
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "hsl(222, 15%, 10%)",
                    border: "1px solid hsl(222, 15%, 18%)",
                    borderRadius: 8,
                    boxShadow:
                        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        borderColor: "hsl(210, 100%, 60%)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "hsl(222, 15%, 10%)",
                    borderBottom: "1px solid hsl(222, 15%, 18%)",
                    boxShadow: "none",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "hsl(222, 20%, 6%)", // darker than background
                    borderRight: "1px solid hsl(222, 15%, 15%)",
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "10px 20px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                },
                contained: {
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    height: 8,
                },
                bar: {
                    borderRadius: 4,
                },
            },
        },
    },
});
