'use client';

import dynamic from 'next/dynamic';
import { FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Dynamically import ALL react-leaflet components with NO SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then(mod => mod.Circle),
  { ssr: false }
);

// School location
const schoolLocation = [-0.417, 36.949];

// Nearby landmarks
const nearbyLandmarks = [
  { position: [-0.418, 36.95], name: 'Kiganjo Town Center', type: 'commercial' },
  { position: [-0.416, 36.951], name: 'Kiganjo Primary School', type: 'education' },
  { position: [-0.419, 36.948], name: 'Kiganjo Health Center', type: 'health' },
  { position: [-0.415, 36.947], name: 'Nyeri–Kiganjo Road', type: 'transport' },
  { position: [-0.42, 36.952], name: 'Kiganjo Market', type: 'market' },
];

// LegendItem component
function LegendItem({ color, border, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-3 h-3 rounded-full ${
          border ? 'border-2 border-blue-600' : color
        }`}
      ></span>
      <span>{label}</span>
    </div>
  );
}

function calculateDistance(coord1, coord2) {
  const R = 6371e3;
  const φ1 = (coord1[0] * Math.PI) / 180;
  const φ2 = (coord2[0] * Math.PI) / 180;
  const Δφ = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const Δλ = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getMarkerIcon(type) {
  switch (type) {
    case 'education':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
    case 'health':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
    case 'transport':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png';
    case 'commercial':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
    default:
      return 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
  }
}

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);

  // Load Leaflet only on client side
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Dynamically import Leaflet
      import('leaflet').then(leaflet => {
        // Fix Leaflet icon issues
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setL(leaflet);
      });
    }
  }, []);

  // Show loading state on server
  if (!isClient || !L) {
    return (
      <div className="relative h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Create custom icons for landmarks
  const createCustomIcon = (type) => {
    return new L.Icon({
      iconUrl: getMarkerIcon(type),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      {/* TOP LEGEND */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 px-4 py-3 flex flex-wrap gap-3 items-center text-xs">
          <span className="font-semibold text-gray-700">Map Legend:</span>
          <LegendItem color="bg-blue-600" label="School" />
          <LegendItem border label="150m Radius" />
          <LegendItem color="bg-green-500" label="Education" />
          <LegendItem color="bg-red-500" label="Health" />
          <LegendItem color="bg-yellow-500" label="Transport" />
        </div>
      </div>

      <MapContainer
        center={schoolLocation}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* School Marker */}
        <Marker position={schoolLocation}>
          <Popup>
            <div className="p-3 min-w-[240px]">
              <h3 className="font-bold text-gray-800 text-lg">
                🏫 Nyaribu Secondary School
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Kiganjo, Nyeri County
              </p>
              <a
                href="https://maps.google.com/?q=Nyaribu+Secondary+School,Kiganjo+Nyeri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <FiNavigation />
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Radius */}
        <Circle
          center={schoolLocation}
          radius={150}
          pathOptions={{
            color: '#2563eb',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '6,6',
          }}
        />

        {/* Nearby Landmarks */}
        {nearbyLandmarks.map((landmark, index) => (
          <Marker
            key={index}
            position={landmark.position}
            icon={createCustomIcon(landmark.type)}
          >
            <Popup>
              <div className="p-3">
                <h4 className="font-semibold text-gray-800">
                  {landmark.name}
                </h4>
                <p className="text-xs text-gray-500 capitalize">
                  {landmark.type}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Approx. distance:{' '}
                  {calculateDistance(schoolLocation, landmark.position)} m
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}