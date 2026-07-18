import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogInteraction from './pages/LogInteraction';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LogInteraction />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
