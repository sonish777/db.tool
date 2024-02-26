import { createContext, useReducer, useEffect, useContext } from 'react';
import { axiosInstance } from 'utils';

const AuthContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN_INITIALIZE':
            return { ...state, isInitialized: true, ...action.payload };
        case 'LOGIN_SUCCESS':
            return { ...state, isAuthenticated: true, ...action.payload };
        case 'LOGIN_FAILED':
            return { ...state, isAuthenticated: false, ...action.payload };

        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                isInitialized: false,
                user: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            'useAuthContext should be used inside the MaterialUIControllerProvider.'
        );
    }

    return context;
}

export function AuthContextProvider({ children }) {
    const initialState = {
        isAuthenticated: false,
        isInitialized: false,
        user: null,
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                if (!accessToken) {
                    return dispatch({
                        type: 'LOGIN_INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
                const response = await axiosInstance.get('/auth/profile');
                if (response.data.data) {
                    return dispatch({
                        type: 'LOGIN_INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user: response.data.data,
                        },
                    });
                }
            } catch (error) {
                window.localStorage.removeItem('accessToken');
                return dispatch({
                    type: 'LOGIN_INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (loginDto) => {
        try {
            const response = await axiosInstance.post(
                '/auth/connect',
                loginDto,
                {
                    headers: { Accept: 'application/json' },
                }
            );
            if (response.data) {
                const tokens = response.data.data;
                localStorage.setItem('accessToken', tokens.accessToken);
                const meResponse = await axiosInstance.get('/auth/profile', {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                if (meResponse.data.data) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: meResponse.data.data,
                        },
                    });
                    return {
                        status: 'success',
                        data: meResponse.data.data,
                    };
                }
            }
        } catch (error) {
            dispatch({
                type: 'LOGIN_FAILED',
                payload: {
                    user: null,
                },
            });
            return {
                status: 'error',
                data: error?.response?.data || 'Something went wrong',
            };
        }
    };

    const logout = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            await axiosInstance.post('/auth/logout', { accessToken });
            window.localStorage.removeItem('accessToken');
            dispatch({
                type: 'LOGOUT',
            });
        } catch (error) {
            dispatch({
                type: 'LOGOUT',
            });
        }
    };
    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
