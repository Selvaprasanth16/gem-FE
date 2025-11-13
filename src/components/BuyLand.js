import React, { useEffect, useMemo, useState } from "react";
import "../style/BuyLand.css";
import { Search, Image as ImageIcon, Building2, Home, Trees, Globe2 } from "lucide-react";
import Navbar from "./Navbar";
import { publicApiCall } from "../services/api";
import { Link } from "react-router-dom";

// Map UI options to backend property_type choices
const landTypes = [
  { key: "all", label: "All Types", desc: "Show all available properties", icon: Globe2, api: null },
  { key: "farm", label: "Coconut Land", desc: "Agricultural coconut plantation", icon: Trees, api: "farm" },
  { key: "land", label: "Empty Land", desc: "Vacant land ready for development", icon: ImageIcon, api: "land" },
  { key: "commercial", label: "Commercial Land", desc: "Business and commercial use", icon: Building2, api: "commercial" },
  { key: "residential", label: "House", desc: "Residential property with structure", icon: Home, api: "residential" },
];

const BuyLand = () => {
  const [activeType, setActiveType] = useState("all");
  const [lands, setLands] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatINR = (val) => {
    const num = Number(val);
    if (!Number.isFinite(num)) return "Contact for price";
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
    } catch {
      return `₹${num.toLocaleString("en-IN")}`;
    }
  };

  // Debounce search input (title/location)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    const apiType = landTypes.find((t) => t.key === activeType)?.api;
    if (apiType) params.set("property_type", apiType);
    if (debouncedSearch) params.set("search", debouncedSearch);
    return params.toString();
  }, [activeType, debouncedSearch]);

  // Fetch lands when filters change
  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = queryParams
          ? `/user/enquiries/available-lands?${queryParams}`
          : "/user/enquiries/available-lands";
        const res = await publicApiCall(endpoint, { method: "GET" });
        setLands(res.lands || res.data?.lands || []);
      } catch (e) {
        setError("Failed to load lands");
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, [queryParams]);

  return (
    <>
      <Navbar />
      <div className="buy-container">
      <header className="buy-hero">
        <h1 className="buy-title">{(landTypes.find(t=>t.key===activeType)?.label === 'All Types') ? 'Browse Properties' : landTypes.find(t=>t.key===activeType)?.label}</h1>
        <p className="buy-subtitle">
          Discover the best land deals from verified sellers across South India
        </p>
      </header>

      <section className="type-section">
        <h3 className="section-heading">Select Land Type</h3>
        {/* Mobile dropdown */}
        <div className="type-select-mobile">
          <select
            value={activeType}
            onChange={(e)=>setActiveType(e.target.value)}
          >
            {landTypes.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
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

      {/* Filters section: only search */}
      <section className="filters-section">
        <div className="buy-search" aria-label="Search properties">
          <Search className="buy-search-icon" size={18} />
          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search by name or location..."
          />
        </div>
      </section>

      {/* Results */}
      <section className="results-grid">
        <div className="results-meta">
          {!loading && !error && (<span>{lands.length} properties found</span>)}
        </div>
        {loading && (
          <div className="empty"><p>Loading lands…</p></div>
        )}
        {!loading && error && (
          <div className="empty"><p>{error}</p></div>
        )}
        {!loading && !error && lands.length === 0 && (
          <div className="empty"><p>No matching lands found.</p></div>
        )}
        {!loading && !error && lands.length > 0 && (
          <div className="cards">
            {lands.map((l)=> (
              <div key={l.id} className="land-card">
                <div className="land-image">
                  {l.images_urls && l.images_urls.length>0 ? (
                    <img src={l.images_urls[0]} alt={l.title} />
                  ) : (
                    <div className="image-fallback"><ImageIcon size={28}/></div>
                  )}
                </div>
                <div className="land-body">
                  <h4 className="land-title">{l.title}</h4>
                  <div className="land-meta">
                    <span className="loc">{l.location}</span>
                    {l.size ? <span className="size">{l.size} sqft</span> : null}
                  </div>
                  <div className="land-footer">
                    <div className="price">{formatINR(l.price)}</div>
                    <Link to={`/land/${l.id}`} className="view-btn">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </>
  );
};

export default BuyLand;
