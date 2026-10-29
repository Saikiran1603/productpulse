import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import type { R } from '../../types'

export const Auth = () => useApp().user ? <Outlet /> : <Navigate to="/login" />
export const Guard = ({ roles, children }: R) => roles.includes(useApp().role) ? children : <Navigate to="/feedback" />
