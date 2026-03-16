import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';

const Layout = () => {
  const location     = useLocation();
  const isAdminRoute = location.pathname === '/owner';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navigation />}
      <main className="flex-1">
        <Routes>
          <Route path="/"                   element={<Home />}              />
          <Route path="/menu"               element={<Menu />}              />
          <Route path="/checkout"           element={<Checkout />}          />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/track" element={<TrackOrder />} />
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