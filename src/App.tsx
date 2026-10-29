import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Auth, Guard } from './components/routing/guards'
import { Shell } from './components/layout/Shell'
import { MGR } from './constants'
import { Login } from './pages/auth/Login'
import { Workspaces } from './pages/workspaces/Workspaces'
import { Dashboard } from './pages/dashboard/Dashboard'
import { FeedbackList } from './pages/feedback/FeedbackList'
import { FeedbackForm } from './pages/feedback/FeedbackForm'
import { FeedbackDetail } from './pages/feedback/FeedbackDetail'
import { Categories } from './pages/categories/Categories'
import { Roadmap } from './pages/roadmap/Roadmap'
import { Releases } from './pages/releases/Releases'
import { Team } from './pages/team/Team'
import { Subscription } from './pages/subscription/Subscription'
import { Settings } from './pages/settings/Settings'
import { PublicRoadmap } from './pages/public/PublicRoadmap'

export default function App() {
  return <AppProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/public/:id" element={<PublicRoadmap />} />
    <Route element={<Auth />}>
      <Route path="/workspaces" element={<Workspaces />} />
      <Route element={<Shell />}>
        <Route path="/dashboard" element={<Guard roles={MGR}><Dashboard /></Guard>} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/feedback/new" element={<FeedbackForm />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
        <Route path="/feedback/:id/edit" element={<FeedbackForm />} />
        <Route path="/roadmap" element={<Guard roles={MGR}><Roadmap /></Guard>} />
        <Route path="/categories" element={<Guard roles={MGR}><Categories /></Guard>} />
        <Route path="/releases" element={<Guard roles={MGR}><Releases /></Guard>} />
        <Route path="/team" element={<Guard roles={['owner', 'admin']}><Team /></Guard>} />
        <Route path="/plan" element={<Guard roles={['owner']}><Subscription /></Guard>} />
        <Route path="/settings" element={<Guard roles={['owner']}><Settings /></Guard>} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes></AppProvider>
}
