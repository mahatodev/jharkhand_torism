import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Camera,
  TreePine,
  Mountain,
  Waves,
  Building,
  Filter,
  Search
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Jharkhand's center coordinates
  const jharkhandCenter: [number, number] = [23.6102, 85.2799];

  const destinations = [
    {
      id: 1,
      name: 'Netarhat',
      category: 'hill_station',
      position: [23.4667, 84.2667] as [number, number],
      rating: 4.8,
      description: 'Queen of Chotanagpur - Beautiful hill station with sunrise viewpoints',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Sunrise Point', 'Sunset Point', 'Magnolia Point'],
      bestTime: 'October - March'
    },
    {
      id: 2,
      name: 'Hundru Falls',
      category: 'waterfall',
      position: [23.4333, 85.5667] as [number, number],
      rating: 4.6,
      description: 'Magnificent 98-meter waterfall on the Subarnarekha River',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Main Falls', 'Trekking Trails', 'Photography Spots'],
      bestTime: 'July - February'
    },
    {
      id: 3,
      name: 'Betla National Park',
      category: 'wildlife',
      position: [23.8833, 84.1833] as [number, number],
      rating: 4.5,
      description: 'Famous wildlife sanctuary with tigers, elephants and diverse flora',
      image: 'https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Tiger Safari', 'Palamau Fort', 'Watch Towers'],
      bestTime: 'November - April'
    },
    {
      id: 4,
      name: 'Deoghar',
      category: 'temple',
      position: [24.4833, 86.7000] as [number, number],
      rating: 4.7,
      description: 'Sacred city with the famous Baidyanath Jyotirlinga temple',
      image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Baidyanath Temple', 'Nandan Pahar', 'Tapovan'],
      bestTime: 'October - March'
    },
    {
      id: 5,
      name: 'Patratu Valley',
      category: 'valley',
      position: [23.6167, 84.9500] as [number, number],
      rating: 4.4,
      description: 'Scenic valley with beautiful landscapes and peaceful environment',
      image: 'https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Valley Viewpoint', 'Nature Trails', 'Photography'],
      bestTime: 'October - April'
    },
    {
      id: 6,
      name: 'Jonha Falls',
      category: 'waterfall',
      position: [23.3500, 85.4167] as [number, number],
      rating: 4.3,
      description: 'Beautiful waterfall also known as Gautamdhara Falls',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
      attractions: ['Main Falls', 'Temple', 'Trekking'],
      bestTime: 'July - March'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Places', icon: MapPin, color: 'emerald' },
    { id: 'hill_station', label: 'Hill Stations', icon: Mountain, color: 'blue' },
    { id: 'waterfall', label: 'Waterfalls', icon: Waves, color: 'cyan' },
    { id: 'wildlife', label: 'Wildlife', icon: TreePine, color: 'green' },
    { id: 'temple', label: 'Temples', icon: Building, color: 'orange' },
    { id: 'valley', label: 'Valleys', icon: Mountain, color: 'purple' }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Jharkhand
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the hidden gems and breathtaking destinations across the state with our interactive map
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-6 border-t pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center p-4 rounded-lg border transition-all ${
                        selectedCategory === category.id
                          ? `bg-${category.color}-50 border-${category.color}-200 text-${category.color}-700`
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-96 md:h-[600px]">
                <MapContainer
                  center={jharkhandCenter}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {filteredDestinations.map((destination) => (
                    <Marker key={destination.id} position={destination.position}>
                      <Popup className="custom-popup">
                        <div className="p-2 min-w-[250px]">
                          <img 
                            src={destination.image} 
                            alt={destination.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-bold text-lg mb-2">{destination.name}</h3>
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Best Time:</p>
                              <p className="text-xs text-gray-600">{destination.bestTime}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Attractions:</p>
                              <p className="text-xs text-gray-600">{destination.attractions.join(', ')}</p>
                            </div>
                          </div>
                          <button className="mt-3 w-full bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                            Get Directions
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Destinations List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Popular Destinations ({filteredDestinations.length})
              </h2>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredDestinations.map((destination) => (
                  <div key={destination.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{destination.name}</h3>
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{destination.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
                        <div className="mt-2 flex space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View Details
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                            <Navigation className="h-3 w-3 mr-1" />
                            Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Navigation className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Plan Route</p>
                    <p className="text-sm text-gray-600">Create custom travel route</p>
                  </div>
                </button>
                <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Photo Spots</p>
                    <p className="text-sm text-gray-600">Find best photography locations</p>
                  </div>
                </button>
                <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Nearby Services</p>
                    <p className="text-sm text-gray-600">Hotels, restaurants, guides</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Map Legend</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 text-${category.color}-600`} />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;