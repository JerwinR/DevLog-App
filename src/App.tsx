import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogProvider } from '@/context/LogContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import EntryForm from '@/components/EntryForm';
import Search from '@/pages/Search';
import Stats from '@/pages/Stats';
import SecurityWrapper from '@/components/SecurityWrapper';

function App() {
  return (
    <SecurityWrapper>
      <LogProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<EntryForm />} />
              <Route path="/search" element={<Search />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Layout>
        </Router>
      </LogProvider>
    </SecurityWrapper>
  );
}

export default App;
