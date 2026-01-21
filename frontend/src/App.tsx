import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Overview } from './pages/Overview'
import { Incidents } from './pages/Incidents'
import { Workbooks } from './pages/Workbooks'
import { Hunting } from './pages/Hunting'
import { Notebooks } from './pages/Notebooks'
import { EntityBehavior } from './pages/EntityBehavior'
import { ThreatIntelligence } from './pages/ThreatIntelligence'
import { MitreAttack } from './pages/MitreAttack'
import { ContentHub } from './pages/ContentHub'
import { Logs } from './pages/Logs'
import { DataConnectors } from './pages/DataConnectors'
import { Analytics } from './pages/Analytics'
import { Watchlists } from './pages/Watchlists'
import { Automation } from './pages/Automation'
import { Settings } from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="workbooks" element={<Workbooks />} />
        <Route path="hunting" element={<Hunting />} />
        <Route path="notebooks" element={<Notebooks />} />
        <Route path="entity-behavior" element={<EntityBehavior />} />
        <Route path="threat-intelligence" element={<ThreatIntelligence />} />
        <Route path="mitre-attck" element={<MitreAttack />} />
        <Route path="content-hub" element={<ContentHub />} />
        <Route path="logs" element={<Logs />} />
        <Route path="data-connectors" element={<DataConnectors />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="watchlists" element={<Watchlists />} />
        <Route path="automation" element={<Automation />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
