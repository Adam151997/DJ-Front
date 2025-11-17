import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Contacts } from './pages/Contacts';
import { Accounts } from './pages/Accounts';
import { Opportunities } from './pages/Opportunities';
import { AIAgent } from './pages/AIAgent';
import { AIInsights } from './pages/AIInsights';
import { Tasks } from './pages/Tasks';
import { Cases } from './pages/Cases';
import { Invoices } from './pages/Invoices';
import { Events } from './pages/Events';
import { Users } from './pages/Users';
import { Teams } from './pages/Teams';
import { Settings } from './pages/Settings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        {/* Main CRM */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/opportunities" element={<Opportunities />} />

                        {/* AI Features */}
                        <Route path="/ai-insights" element={<AIInsights />} />
                        <Route path="/ai-agent" element={<AIAgent />} />

                        {/* Operations */}
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/cases" element={<Cases />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/events" element={<Events />} />

                        {/* Administration */}
                        <Route path="/users" element={<Users />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
