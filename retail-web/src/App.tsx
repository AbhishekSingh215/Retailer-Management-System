import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import AppLayout, { ProtectedRoute } from './components/layout/AppLayout';
import Dashboard from './features/dashboard/Dashboard';
import SalesEntry from './features/sales/SalesEntry';

function App() {
  return (
    <BrowserRouter>
      <div className="antialiased text-gray-900 dark:text-gray-100 min-h-screen bg-gray-50 dark:bg-[#050608] transition-colors duration-300">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside AppLayout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect to Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sales" element={<SalesEntry />} />
            {/* Future routes will go here: <Route path="inventory" element={<Inventory />} /> */}
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
