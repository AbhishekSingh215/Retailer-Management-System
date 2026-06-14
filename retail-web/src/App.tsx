import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import AppLayout, { ProtectedRoute } from './components/layout/AppLayout';
import Dashboard from './features/dashboard/Dashboard';
import SalesEntry from './features/sales/SalesEntry';
import HsnMaster from './features/masters/HsnMaster';
import TaxMaster from './features/masters/TaxMaster';
import CustomerMaster from './features/masters/CustomerMaster';
import Launchpad from './features/dashboard/Launchpad';
import NotFound from './features/error/NotFound';

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
            <Route path="launchpad" element={<Launchpad />} />
            
            {/* Implemented Features */}
            <Route path="sales" element={<SalesEntry />} />
            <Route path="hsn-master" element={<HsnMaster />} />
            <Route path="tax-master" element={<TaxMaster />} />
            <Route path="customer-master" element={<CustomerMaster />} />

            {/* Wildcard 404 Fallback inside shell */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
