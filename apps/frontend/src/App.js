import { useState, useEffect } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav';

// Material Dashboard 2 React themes
import themeRTL from 'assets/theme/theme-rtl';

// Material Dashboard 2 React Dark Mode themes
import themeDarkRTL from 'assets/theme-dark/theme-rtl';

// Material Dashboard 2 React routes
import routes from 'routes';

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav } from 'context';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';
import { useAuthContext } from 'context/auth';

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const { isAuthenticated } = useAuthContext();
    const {
        miniSidenav,
        layout,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const { pathname } = useLocation();

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    // // Setting page scroll to 0 when changing the route
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                if (route.isPrivate && !isAuthenticated) {
                    return (
                        <Route
                            exact
                            path={route.route}
                            element={<Navigate to="/authentication/connect" />}
                            key={route.key}
                        />
                    );
                }
                if (!route.isPrivate && isAuthenticated) {
                    return (
                        <Route
                            exact
                            path={route.route}
                            element={<Navigate to="/dashboard" />}
                            key={route.key}
                        />
                    );
                }
                return (
                    <Route
                        exact
                        path={route.route}
                        element={route.component}
                        key={route.key}
                    />
                );
            }

            return null;
        });

    return (
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === 'dashboard' && (
                <>
                    <Sidenav
                        color={sidenavColor}
                        brand={
                            (transparentSidenav && !darkMode) || whiteSidenav
                                ? brandDark
                                : brandWhite
                        }
                        brandName="Database Tool"
                        routes={routes}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                </>
            )}
            <Routes>
                {getRoutes(routes)}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </ThemeProvider>
    );
}
