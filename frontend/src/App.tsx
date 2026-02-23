import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudyPage } from './pages/StudyPage';
import { PracticalCasePage } from './pages/PracticalCasePage';
import { OfficialExamPage } from './pages/OfficialExamPage';
import { TestPage } from './pages/TestPage';
import { Settings } from './pages/Settings';
import ClinicPage from './pages/ClinicPage';
import PremiumPreview from './pages/PremiumPreview';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/caso-practico" element={<PracticalCasePage />} />
              <Route path="/exame-oficial" element={<OfficialExamPage />} />
              <Route path="/clinica" element={<ClinicPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/premium-preview" element={<PremiumPreview />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
