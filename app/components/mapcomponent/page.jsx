'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Nyaribu Secondary School location in Kiganjo, Nyeri
const schoolLocation = [-0.417, 36.949]; // Approximate coordinates for Kiganjo, Nyeri

// Nearby landmarks coordinates (approximate for Kiganjo, Nyeri)
const nearbyLandmarks = [
  { position: [-0.418, 36.950], name: "Kiganjo Town Center", type: "commercial" },
  { position: [-0.416, 36.951], name: "Kiganjo Primary School", type: "education" },
  { position: [-0.419, 36.948], name: "Kiganjo Health Center", type: "health" },
  { position: [-0.415, 36.947], name: "Nyeri-Kiganjo Road", type: "transport" },
  { position: [-0.420, 36.952], name: "Kiganjo Market", type: "market" }
];

export default function MapComponent() {
  return (
    <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      <MapContainer
        center={schoolLocation}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* School location marker */}
        <Marker position={schoolLocation}>
          <Popup>
            <div className="p-3 min-w-[250px]">
              <h3 className="font-bold text-gray-800 text-lg">🏫 Nyaribu Secondary School</h3>
              <p className="text-sm text-gray-600 mb-2">Kiganjo, Nyeri County</p>
              
              <div className="space-y-2 text-sm text-gray-700 mb-3">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 mt-0.5">📍</div>
                  <div>
                    <p className="font-medium">Public Day School</p>
                    <p className="text-xs text-gray-500">400+ Students | 8-4-4 Curriculum</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-0.5">🎯</div>
                  <div>
                    <p className="font-medium">Our Motto</p>
                    <p className="text-xs text-gray-500 italic">"Soaring for Excellence"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="text-purple-600 mt-0.5">📞</div>
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-xs text-gray-500">+254720123456</p>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://maps.google.com/?q=Nyaribu+Secondary+School,Kiganjo+Nyeri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiNavigation className="text-sm" />
                Get Directions on Google Maps
              </a>
            </div>
          </Popup>
        </Marker>

        {/* School area circle */}
        <Circle
          center={schoolLocation}
          radius={150}
          pathOptions={{
            fillColor: '#1e3c72',
            fillOpacity: 0.1,
            color: '#1e3c72',
            opacity: 0.3,
            weight: 2,
            dashArray: '5, 5'
          }}
        />

        {/* Nearby landmarks */}
        {nearbyLandmarks.map((landmark, index) => (
          <Marker 
            key={index} 
            position={landmark.position}
            icon={new L.Icon({
              iconUrl: getMarkerIcon(landmark.type),
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    landmark.type === 'commercial' ? 'bg-blue-100' :
                    landmark.type === 'education' ? 'bg-green-100' :
                    landmark.type === 'health' ? 'bg-red-100' :
                    landmark.type === 'transport' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {landmark.type === 'commercial' ? '🏪' :
                     landmark.type === 'education' ? '📚' :
                     landmark.type === 'health' ? '🏥' :
                     landmark.type === 'transport' ? '🚗' :
                     '🛒'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{landmark.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{landmark.type}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Located near Nyaribu Secondary School</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Approx. distance: {calculateDistance(schoolLocation, landmark.position)} meters
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200 z-[1000] max-w-[200px]">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Map Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-xs text-gray-600">Nyaribu Secondary School</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-full"></div>
            <span className="text-xs text-gray-600">School Area (150m radius)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Transport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Health</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate approximate distance
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1[0] * Math.PI/180;
  const φ2 = coord2[0] * Math.PI/180;
  const Δφ = (coord2[0]-coord1[0]) * Math.PI/180;
  const Δλ = (coord2[1]-coord1[1]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c);
}

// Helper function to get marker icon based on type
function getMarkerIcon(type) {
  switch(type) {
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