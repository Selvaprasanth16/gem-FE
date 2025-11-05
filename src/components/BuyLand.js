import React, { useState } from "react";
import "../style/BuyLand.css";
import { Search, SlidersHorizontal, ChevronDown, Image as ImageIcon, Building2, Home, Trees, Globe2 } from "lucide-react";
import Navbar from "./Navbar";

const landTypes = [
  { key: "all", label: "All Types", desc: "Show all available properties", icon: Globe2 },
  { key: "coconut", label: "Coconut Land", desc: "Agricultural coconut plantation", icon: Trees },
  { key: "empty", label: "Empty Land", desc: "Vacant land ready for development", icon: ImageIcon },
  { key: "commercial", label: "Commercial Land", desc: "Business and commercial use", icon: Building2 },
  { key: "house", label: "House", desc: "Residential property with structure", icon: Home },
];

const BuyLand = () => {
  const [activeType, setActiveType] = useState("all");

  return (
    <>
      <Navbar />
      <div className="buy-container">
      <header className="buy-hero">
        <h1 className="buy-title">Find Your Perfect Land</h1>
        <p className="buy-subtitle">
          Discover the best land deals from verified sellers across South India
        </p>
      </header>

      <section className="type-section">
        <h3 className="section-heading">Select Land Type</h3>
        <div className="type-grid">
          {landTypes.map(({ key, label, desc, icon: Icon }) => (
            <button
              key={key}
              className={`type-card ${activeType === key ? "active" : ""}`}
              onClick={() => setActiveType(key)}
            >
              <div className="type-icon">
                <Icon size={28} />
              </div>
              <div className="type-text">
                <strong>{label}</strong>
                <small>{desc}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="filters">
        <div className="search">
          <Search className="search-icon" size={18} />
          <input placeholder="Search by location or land type..." />
          <button className="ghost">
            <SlidersHorizontal size={16} />
          </button>
        </div>
        <div className="sort">
          <span>Sort by:</span>
          <button className="dropdown">
            Price: Low to High <ChevronDown size={16} />
          </button>
        </div>
      </section>

      <section className="results-placeholder">
        <div className="empty">
          <p>No listings yet. Use the controls above to refine your search.</p>
        </div>
      </section>
      </div>
    </>
  );
};

export default BuyLand;
