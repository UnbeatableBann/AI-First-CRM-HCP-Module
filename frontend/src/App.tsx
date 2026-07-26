import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogInteraction from './pages/LogInteraction';
import InteractionHomePage from './pages/InteractionHomePage';
import HCPHistoryPage from './pages/HCPHistoryPage';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<InteractionHomePage />} />
          <Route path="/interactions/:id" element={<LogInteraction />} />
          <Route path="/hcps/:hcp_id/interactions" element={<HCPHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
