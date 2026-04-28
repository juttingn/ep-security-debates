import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Corpus from './pages/Corpus'
import TopicModel from './pages/TopicModel'
import SecurityFrames from './pages/SecurityFrames'
import Explorer from './pages/Explorer'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<Home />} />
            <Route path="/corpus"    element={<Corpus />} />
            <Route path="/topics"    element={<TopicModel />} />
            <Route path="/security"  element={<SecurityFrames />} />
            <Route path="/explorer"  element={<Explorer />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
