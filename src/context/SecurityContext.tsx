import { createContext } from 'react'

export interface ISecurityContext {
    isAuthenticated: () => boolean
    loggedInUser: string | undefined
    userRoles: string[]
    hasRole: (role: string) => boolean
    hasAnyRole: (roles: string[]) => boolean
    login: () => void
    logout: () => void
}

export default createContext<ISecurityContext>({
    isAuthenticated: () => false,
    loggedInUser: undefined,
    userRoles: [],
    hasRole: () => false,
    hasAnyRole: () => false,
    login: () => {},
    logout: () => {},
})
