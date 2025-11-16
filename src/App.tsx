import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AIChatProvider } from './contexts/AIChatContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { AIChatSidebar } from './components/AIChatSidebar';
import { AIFloatingButton } from './components/AIFloatingButton';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetail } from './pages/LeadDetail';
import { Contacts } from './pages/Contacts';
import { ContactDetail } from './pages/ContactDetail';
import { Deals } from './pages/Deals';
import { DealDetail } from './pages/DealDetail';
import { PipelineSettings } from './pages/PipelineSettings';
import { CustomFieldsSettings } from './pages/CustomFieldsSettings';
import { BusinessTemplates } from './pages/BusinessTemplates';
import { AIInsights } from './pages/AIInsights';
import { Workflows } from './pages/Workflows';
import { EmailCampaigns } from './pages/EmailCampaigns';
import { EmailTemplates } from './pages/EmailTemplates';
import { EmailProviders } from './pages/EmailProviders';
import { Plugins } from './pages/Plugins';
import { PluginOAuthCallback } from './pages/PluginOAuthCallback';
import { Segments } from './pages/Segments';
import { DripCampaigns } from './pages/DripCampaigns';
import { EmailAnalytics } from './pages/EmailAnalytics';
import { ThemeSettings } from './pages/ThemeSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AIChatProvider>
              <Router>
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/leads" element={<Leads />} />
                      <Route path="/leads/:id" element={<LeadDetail />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/contacts/:id" element={<ContactDetail />} />
                      <Route path="/deals" element={<Deals />} />
                      <Route path="/deals/:id" element={<DealDetail />} />

                      {/* Automation Routes */}
                      <Route path="/ai-insights" element={<AIInsights />} />
                      <Route path="/workflows" element={<Workflows />} />
                      <Route path="/email-campaigns" element={<EmailCampaigns />} />
                      <Route path="/email-templates" element={<EmailTemplates />} />
                      <Route path="/email-providers" element={<EmailProviders />} />

                      {/* Enhanced Email Campaign Routes */}
                      <Route path="/segments" element={<Segments />} />
                      <Route path="/drip-campaigns" element={<DripCampaigns />} />
                      <Route path="/email-analytics" element={<EmailAnalytics />} />

                      {/* Plugin Integration Routes */}
                      <Route path="/plugins" element={<Plugins />} />
                      <Route path="/plugins/oauth-callback" element={<PluginOAuthCallback />} />

                      {/* Settings Routes */}
                      <Route path="/settings/templates" element={<BusinessTemplates />} />
                      <Route path="/settings/pipeline" element={<PipelineSettings />} />
                      <Route path="/settings/custom-fields" element={<CustomFieldsSettings />} />
                      <Route path="/settings/theme" element={<ThemeSettings />} />
                    </Routes>
                  </Layout>

                  {/* Global AI Chat Components */}
                  <AIChatSidebar />
                  <AIFloatingButton />
                </ProtectedRoute>
              </Router>
            </AIChatProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;