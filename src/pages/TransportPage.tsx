import React, { useState } from 'react';
import { 
  Bus, 
  Car, 
  Train, 
  Plane,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Star,
  Navigation,
  Phone,
  Shield,
  Zap
} from 'lucide-react';


const TransportPage: React.FC = () => {
  const [selectedTransport, setSelectedTransport] = useState('all');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const transportOptions = [
    {
      id: 1,
      type: 'bus',
      operator: 'Jharkhand State Transport',
      route: 'Ranchi to Netarhat',
      departure: '06:00 AM',
      arrival: '10:30 AM',
      duration: '4h 30m',
      price: '₹180',
      rating: 4.2,
      amenities: ['AC', 'Wi-Fi', 'Charging Point'],
      availability: 'Available',
      seats: 23
    },
    {
      id: 2,
      type: 'car',
      operator: 'Jharkhand Cab Service',
      route: 'Ranchi to Hundru Falls',
      departure: 'Flexible',
      arrival: 'Flexible',
      duration: '1h 45m',
      price: '₹1,200',
      rating: 4.6,
      amenities: ['AC', 'GPS', 'Driver'],
      availability: 'Available',
      seats: 4
    },
    {
      id: 3,
      type: 'train',
      operator: 'Indian Railways',
      route: 'Ranchi to Deoghar',
      departure: '05:30 AM',
      arrival: '11:15 AM',
      duration: '5h 45m',
      price: '₹95',
      rating: 4.0,
      amenities: ['Pantry Car', 'Charging Point'],
      availability: 'Available',
      seats: 47
    },
    {
      id: 4,
      type: 'bus',
      operator: 'Private Deluxe',
      route: 'Jamshedpur to Betla National Park',
      departure: '07:00 AM',
      arrival: '01:30 PM',
      duration: '6h 30m',
      price: '₹280',
      rating: 4.4,
      amenities: ['AC', 'Reclining Seats', 'Snacks'],
      availability: 'Available',
      seats: 12
    },
    {
      id: 5,
      type: 'car',
      operator: 'Premium Car Rental',
      route: 'Dhanbad to Patratu Valley',
      departure: 'Flexible',
      arrival: 'Flexible',
      duration: '2h 15m',
      price: '₹1,500',
      rating: 4.7,
      amenities: ['Luxury AC', 'GPS', 'Professional Driver'],
      availability: 'Available',
      seats: 4
    },
    {
      id: 6,
      type: 'plane',
      operator: 'Air India Express',
      route: 'Delhi to Ranchi',
      departure: '08:45 AM',
      arrival: '10:30 AM',
      duration: '1h 45m',
      price: '₹4,500',
      rating: 4.3,
      amenities: ['In-flight Meal', 'Entertainment'],
      availability: 'Available',
      seats: 8
    }
  ];

  const transportTypes = [
    { id: 'all', label: 'All Transport', icon: Navigation, color: 'emerald' },
    { id: 'bus', label: 'Bus', icon: Bus, color: 'blue' },
    { id: 'car', label: 'Car/Cab', icon: Car, color: 'green' },
    { id: 'train', label: 'Train', icon: Train, color: 'purple' },
    { id: 'plane', label: 'Flight', icon: Plane, color: 'orange' }
  ];

  const popularRoutes = [
    { from: 'Ranchi', to: 'Netarhat', price: '₹180', duration: '4h 30m' },
    { from: 'Jamshedpur', to: 'Deoghar', price: '₹220', duration: '5h 15m' },
    { from: 'Dhanbad', to: 'Betla National Park', price: '₹320', duration: '6h 45m' },
    { from: 'Ranchi', to: 'Hundru Falls', price: '₹150', duration: '2h 30m' }
  ];

  const filteredTransport = transportOptions.filter(option => {
    return selectedTransport === 'all' || option.type === selectedTransport;
  });

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-6 w-6" />;
      case 'car': return <Car className="h-6 w-6" />;
      case 'train': return <Train className="h-6 w-6" />;
      case 'plane': return <Plane className="h-6 w-6" />;
      default: return <Navigation className="h-6 w-6" />;
    }
  };

  const getTransportColor = (type: string) => {
    switch (type) {
      case 'bus': return 'bg-blue-100 text-blue-600';
      case 'car': return 'bg-green-100 text-green-600';
      case 'train': return 'bg-purple-100 text-purple-600';
      case 'plane': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transportation Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and book the best transportation options to explore Jharkhand's beautiful destinations
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Plan Your Journey</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter departure city"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Search Transport
              </button>
            </div>
          </div>

          {/* Transport Type Filters */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Filter by Transport Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {transportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTransport(type.id)}
                    className={`flex items-center justify-center p-4 rounded-lg border transition-all ${
                      selectedTransport === type.id
                        ? `bg-${type.color}-50 border-${type.color}-200 text-${type.color}-700`
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transport Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Transport Options ({filteredTransport.length})
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {filteredTransport.map((option) => (
                  <div key={option.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getTransportColor(option.type)}`}>
                          {getTransportIcon(option.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{option.operator}</h3>
                          <p className="text-gray-600">{option.route}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{option.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{option.price}</div>
                        <div className="text-sm text-gray-600">per person</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Duration</div>
                          <div className="text-sm">{option.duration}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Departure</div>
                          <div className="text-sm">{option.departure}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Arrival</div>
                          <div className="text-sm">{option.arrival}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Available</div>
                          <div className="text-sm">{option.seats} seats</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {option.amenities.map((amenity, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                          View Details
                        </button>
                        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Routes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Routes</h2>
              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">
                        {route.from} → {route.to}
                      </div>
                      <div className="text-sm text-gray-600">{route.duration}</div>
                    </div>
                    <div className="text-emerald-600 font-semibold">{route.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Safe & Secure</div>
                    <div className="text-sm text-gray-600">Verified operators and secure payments</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Instant Booking</div>
                    <div className="text-sm text-gray-600">Quick and easy reservation process</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">24/7 Support</div>
                    <div className="text-sm text-gray-600">Round-the-clock customer assistance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-5 w-5 text-emerald-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Call Support</div>
                    <div className="text-sm text-gray-600">+91 98765 43210</div>
                  </div>
                </button>
                
                <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Find Transport Hub</div>
                    <div className="text-sm text-gray-600">Locate nearest station</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-lg font-bold text-red-900">Emergency Contacts</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="font-semibold text-red-900">Police</div>
              <div className="text-red-700">100</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Ambulance</div>
              <div className="text-red-700">108</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Tourist Helpline</div>
              <div className="text-red-700">1363</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportPage;