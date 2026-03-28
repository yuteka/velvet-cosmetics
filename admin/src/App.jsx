import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Payments from './pages/Payments';
import PaymentDetail from './pages/PaymentDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';

function AdminApp() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080604' }}>
      <div className="w-10 h-10 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="flex h-screen text-white overflow-hidden" style={{ background: '#080604' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: '#080604' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Products */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<Products />} />
            <Route path="/products/edit/:slug" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />

            {/* Orders */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            {/* Payments */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:id" element={<PaymentDetail />} />

            {/* Customers */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />

            <Route path="/coupons" element={<Coupons />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </BrowserRouter>
  );
}