import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

const Layout = () => {
  const location     = useLocation();
  const isAdminRoute = location.pathname === '/owner';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navigation />}
      <main className="flex-1">
        <Routes>
          <Route path="/"                   element={<Home />}              />
          <Route path="/menu"               element={<Menu />}              />
          <Route path="/checkout"           element={<Checkout />}          />
          {/* FIXED: was /order-confirmation/:orderNumber — Stripe returns query params not a path param */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/owner"              element={<Admin />}             />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <CartProvider>
      <Layout />
    </CartProvider>
  </Router>
);

export default App;