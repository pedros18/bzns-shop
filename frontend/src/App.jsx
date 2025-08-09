import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 flex flex-col">
      <NavBar />
      {/* Full width content area */}
      <main className="w-full px-4 md:px-6 py-6 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
