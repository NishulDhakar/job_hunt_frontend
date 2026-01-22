import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { JobFeed } from '@/pages/JobFeed'
import { Applications } from '@/pages/Applications'
import { BestMatches } from '@/pages/BestMatches'
import { AIChat } from '@/pages/AIChat'
import { Profile } from '@/pages/Profile'
import { Dashboard } from '@/pages/Dashboard'
import { Bookmarked } from '@/pages/Bookmarked'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobFeed />} />
          <Route path="/bookmarked" element={<Bookmarked />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/matches" element={<BestMatches />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
