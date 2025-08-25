import {ReactNode, useEffect, useState} from 'react'
import SecurityContext from './SecurityContext'
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth'
import {isExpired} from 'react-jwt'
import Keycloak from 'keycloak-js'

interface IWithChildren {
    children: ReactNode
}

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
}

const keycloak: Keycloak = new Keycloak(keycloakConfig)

export default function SecurityContextProvider({children}: IWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined)
    const [userRoles, setUserRoles] = useState<string[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: 'login-required',
                    checkLoginIframe: false, // Disable iframe check to avoid CSP issues
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
                })
                
                if (authenticated) {
                    console.log('Keycloak initialized successfully')
                    addAccessTokenToAuthHeader(keycloak.token)
                    setLoggedInUser(keycloak.idTokenParsed?.given_name)
                    
                    // Extract user roles from the token
                    if (keycloak.idTokenParsed?.realm_access?.roles) {
                        setUserRoles(keycloak.idTokenParsed.realm_access.roles)
                        console.log('User roles:', keycloak.idTokenParsed.realm_access.roles)
                    }
                }
                setIsInitialized(true)
            } catch (error) {
                console.error('Failed to initialize Keycloak:', error)
                setIsInitialized(true)
            }
        }

        initKeycloak()
    }, [])

    keycloak.onAuthSuccess = () => {
        console.log('Auth success')
        console.log('Token parsed:', keycloak.idTokenParsed)
        console.log('Access token parsed:', keycloak.tokenParsed)
        
        if (keycloak.idTokenParsed) {
            console.log('Full ID token structure:', JSON.stringify(keycloak.idTokenParsed, null, 2))
        }
        
        if (keycloak.tokenParsed) {
            console.log('Full access token structure:', JSON.stringify(keycloak.tokenParsed, null, 2))
        }
        
        addAccessTokenToAuthHeader(keycloak.token)
        setLoggedInUser(keycloak.idTokenParsed?.given_name)
        
        // Try to get roles from multiple possible locations
        let roles: string[] = []
        
        // Check ID token first
        if (keycloak.idTokenParsed?.realm_access?.roles) {
            roles = keycloak.idTokenParsed.realm_access.roles
            console.log('Found roles in ID token realm_access:', roles)
        } 
        // Check access token
        else if (keycloak.tokenParsed?.realm_access?.roles) {
            roles = keycloak.tokenParsed.realm_access.roles
            console.log('Found roles in access token realm_access:', roles)
        }
        // Check resource access
        else if (keycloak.idTokenParsed?.resource_access && keycloak.clientId && keycloak.idTokenParsed.resource_access[keycloak.clientId]?.roles) {
            roles = keycloak.idTokenParsed.resource_access[keycloak.clientId].roles
            console.log('Found roles in resource_access:', roles)
        }
        // Check access token resource access
        else if (keycloak.tokenParsed?.resource_access && keycloak.clientId && keycloak.tokenParsed.resource_access[keycloak.clientId]?.roles) {
            roles = keycloak.tokenParsed.resource_access[keycloak.clientId].roles
            console.log('Found roles in access token resource_access:', roles)
        }
        else {
            console.warn('No roles found in any expected location')
            console.log('Available ID token properties:', Object.keys(keycloak.idTokenParsed || {}))
            console.log('Available access token properties:', Object.keys(keycloak.tokenParsed || {}))
        }
        
        if (roles.length > 0) {
            const normalizedRoles = roles.map(role => role.toUpperCase())
            setUserRoles(normalizedRoles)
        } else {
            setUserRoles([])
        }
    }

    keycloak.onAuthLogout = () => {
        console.log('Auth logout')
        removeAccessTokenFromAuthHeader()
        setUserRoles([])
        setLoggedInUser(undefined)
    }

    keycloak.onAuthError = (error) => {
        console.error('Auth error:', error)
        removeAccessTokenFromAuthHeader()
        setUserRoles([])
        setLoggedInUser(undefined)
    }

    keycloak.onTokenExpired = () => {
        console.log('Token expired, refreshing...')
        keycloak.updateToken(-1).then(function (refreshed) {
            if (refreshed) {
                addAccessTokenToAuthHeader(keycloak.token)
                setLoggedInUser(keycloak.idTokenParsed?.given_name)
                
                if (keycloak.idTokenParsed?.realm_access?.roles) {
                    setUserRoles(keycloak.idTokenParsed.realm_access.roles)
                }
            }
        }).catch(function () {
            console.error('Failed to refresh token')
            keycloak.login()
        })
    }

    function login() {
        keycloak.login()
    }

    function logout() {
        const logoutOptions = {redirectUri: import.meta.env.VITE_REACT_APP_URL}
        keycloak.logout(logoutOptions)
    }

    function isAuthenticated() {
        if (keycloak.token) return !isExpired(keycloak.token)
        else return false
    }

    function hasRole(role: string) {
        return userRoles.includes(role)
    }

    function hasAnyRole(roles: string[]) {
        return roles.some(role => userRoles.includes(role))
    }

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Initializing...</div>
            </div>
        )
    }

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated,
                loggedInUser,
                userRoles,
                hasRole,
                hasAnyRole,
                login,
                logout,
            }}
        >
            {children}
        </SecurityContext.Provider>
    )
}

