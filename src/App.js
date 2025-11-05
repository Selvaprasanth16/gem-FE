import './App.css';
import { Routes, Route } from "react-router-dom";
import Landing from './components/landing';
import SellLandForm from './components/SellLandForm';
import BuyLand from './components/BuyLand';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sell" element={<SellLandForm />} />
        <Route path="/buy" element={<BuyLand />} />
      </Routes>
    </>
  );
}

export default App;
