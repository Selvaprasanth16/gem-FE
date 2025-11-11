import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import './LandMap.css';

const LandMap = ({ latitude, longitude, title, address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Check if leaflet is available
    if (!window.L) {
      console.error('Leaflet library not loaded');
      return;
    }

    // Only initialize if we have valid coordinates
    if (!latitude || !longitude) {
      return;
    }

    // Initialize map if not already initialized
    if (!mapInstanceRef.current && mapRef.current) {
      try {
        // Create map instance
        const map = window.L.map(mapRef.current).setView([latitude, longitude], 13);

        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Add marker
        const marker = window.L.marker([latitude, longitude]).addTo(map);
        
        // Add popup with land details
        if (title) {
          marker.bindPopup(`<b>${title}</b><br>${address || ''}`).openPopup();
        }

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  // If no coordinates, show placeholder
  if (!latitude || !longitude) {
    return (
      <div className="map-placeholder">
        <MapPin size={48} />
        <p>Location coordinates not available</p>
        <p className="map-placeholder-subtitle">
          {address || 'No address provided'}
        </p>
      </div>
    );
  }

  return (
    <div className="land-map-container">
      <div ref={mapRef} className="land-map" />
      <div className="map-info">
        <MapPin size={16} />
        <span>{address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}</span>
      </div>
    </div>
  );
};

export default LandMap;
