import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Contacts } from './pages/Contacts';
import { Deals } from './pages/Deals';
import { PipelineSettings } from './pages/PipelineSettings';
import { CustomFieldsSettings } from './pages/CustomFieldsSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/settings/pipeline" element={<PipelineSettings />} />
                <Route path="/settings/custom-fields" element={<CustomFieldsSettings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;