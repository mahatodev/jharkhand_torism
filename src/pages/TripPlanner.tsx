// src/pages/TripPlanner.tsx
import React, { useState } from "react";
import {
  Calendar,
  Navigation,
  Loader2,
  Clock,
  MapPin,
  TreePine,
  Mountain,
  Camera,
  Star,
  Info,
} from "lucide-react";
import { jharkhandSpots, clusters } from "../data/spots"; // ✅ Import data

// Define interface for a day's plan
interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  places: string[];
  tips?: string;
}

const TripPlanner: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<number>(5);
  const [generatedItinerary, setGeneratedItinerary] = useState<DayPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateItinerary = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 700));

    const itinerary: DayPlan[] = [];
    const used = new Set<number>();

    // Day 1: Arrival Ranchi-centered
    itinerary.push({
      day: 1,
      title: "Arrival & Ranchi Exploration",
      activities: [
        "🛬 Arrive in Ranchi (airport/rail connectivity)",
        "🏨 Check-in & freshen up",
        "🌅 Evening at Ranchi Lake - stroll & sunset",
        "🍲 Try local Jharkhand cuisine"
      ],
      places: ["Ranchi Lake"],
      tips: "Book accommodation near Ranchi Lake for easy access to city attractions."
    });

    let currentDay = 2;
    // simple strategy: prioritize Ranchi waterfalls in first two days, then expand to clusters
    while (currentDay < selectedDays) {
      let dayPlan: DayPlan | null = null;

      if (currentDay <= 3) {
        // Ranchi waterfalls / nearby
        const ranchiWaterfalls = jharkhandSpots.filter(s => s.city === "Ranchi" && s.type.includes("waterfall") && !used.has(s.id));
        if (ranchiWaterfalls.length > 0) {
          const pick = ranchiWaterfalls[Math.floor(Math.random() * ranchiWaterfalls.length)];
          used.add(pick.id);
          dayPlan = {
            day: currentDay,
            title: "Waterfall Adventure Day",
            activities: [
              `🌊 Early morning trip to ${pick.name}`,
              `📸 Photography and nature walk at ${pick.name}`,
              "🍱 Picnic lunch",
              "🏞️ Return by evening"
            ],
            places: [pick.name],
            tips: `Best during ${pick.bestTime}. Carry trekking shoes and water.`
          };
        }
      }

      if (!dayPlan && selectedDays >= 5 && currentDay <= Math.ceil(selectedDays * 0.6)) {
        // Latehar cluster (Netarhat/Betla)
        const latehar = clusters["Latehar"] || jharkhandSpots.filter(s => s.city === "Latehar");
        const avail = latehar.filter(s => !used.has(s.id));
        if (avail.length > 0) {
          const pick = avail.find(p => p.name === "Netarhat") || avail[0];
          used.add(pick.id);
          dayPlan = {
            day: currentDay,
            title: pick.name === "Netarhat" ? "Netarhat - Queen of Chotanagpur" : "Wildlife / Hill Day",
            activities: [
              `🚌 Travel to ${pick.city} - ${pick.name}`,
              ...pick.activities.map(a => `✨ ${a}`),
              "🌙 Evening rest & stargazing"
            ],
            places: [pick.name],
            tips: `Best time: ${pick.bestTime}. Book stay in advance if during peak season.`
          };
        }
      }

      if (!dayPlan && selectedDays >= 7 && currentDay <= Math.ceil(selectedDays * 0.8)) {
        // Deoghar or Jamshedpur cluster
        const choice = Math.random() > 0.5 ? "Deoghar" : "Jamshedpur";
        const clusterSpots = clusters[choice] || jharkhandSpots.filter(s => s.city === choice);
        const avail = clusterSpots.filter(s => !used.has(s.id));
        if (avail.length > 0) {
          const pick = avail[0];
          used.add(pick.id);
          dayPlan = {
            day: currentDay,
            title: choice === "Deoghar" ? "Pilgrimage & Culture" : "City & Nature",
            activities: [
              `🚗 Travel to ${pick.city}`,
              ...pick.activities.map(a => `🎯 ${a}`),
              "🛍️ Explore local markets"
            ],
            places: [pick.name],
            tips: pick.description
          };
        }
      }

      // fallback: pick any unused interesting spot
      if (!dayPlan) {
        const avail = jharkhandSpots.filter(s => !used.has(s.id));
        if (avail.length > 0) {
          const pick = avail[Math.floor(Math.random() * avail.length)];
          used.add(pick.id);
          dayPlan = {
            day: currentDay,
            title: "Hidden Gems & Local Culture",
            activities: [
              `🗺️ Explore ${pick.name} in ${pick.city}`,
              ...pick.activities.map(a => `🌟 ${a}`),
              "🎁 Interact with local community & crafts"
            ],
            places: [pick.name],
            tips: `${pick.description} Best time: ${pick.bestTime}`
          };
        }
      }

      if (dayPlan) itinerary.push(dayPlan);
      currentDay++;
    }

    // Last day: Departure
    itinerary.push({
      day: selectedDays,
      title: "Departure & Fond Memories",
      activities: [
        "🌅 Final breakfast and hotel check-out",
        "🛍️ Last-minute shopping for handicrafts",
        "🚗 Travel to Ranchi airport/railway station",
        "✈️ Departure"
      ],
      places: [],
      tips: "Keep buffer time for travel to airport/station."
    });

    setGeneratedItinerary(itinerary);
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TreePine className="w-10 h-10 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Jharkhand Trip Planner</h1>
            <Mountain className="w-10 h-10 text-green-600 ml-3" />
          </div>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-green-700">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>55+ Destinations</span>
            </div>
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-1" />
              <span>Smart Planning</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Local Insights</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-green-600" />
                How many days are you planning to visit Jharkhand?
              </label>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="w-full px-6 py-4 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg bg-white shadow-sm hover:shadow-md"
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? "Day" : "Days"}{" "}
                    {day <= 3 ? " (Ranchi Focus)" : day <= 6 ? " (Ranchi + Waterfalls)" : day <= 10 ? " (Multi-City Tour)" : " (Complete Jharkhand)"}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateItinerary}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white py-5 px-8 rounded-xl font-bold text-xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Creating Your Perfect Journey...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-6 h-6" />
                  <span>Generate My Jharkhand Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Itinerary */}
        {generatedItinerary.length > 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center">
                <TreePine className="w-8 h-8 text-green-600 mr-3" />
                Your {selectedDays}-Day Jharkhand Adventure
                <Mountain className="w-8 h-8 text-green-600 ml-3" />
              </h2>
              <p className="text-gray-600 text-lg">
                Carefully crafted journey through the "Land of Forests"
              </p>
            </div>

            <div className="grid gap-6">
              {generatedItinerary.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-8 border-green-500">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold mr-4">
                            Day {day.day}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">{day.title}</h3>
                        </div>
                        {day.places.length > 0 && (
                          <div className="flex items-center text-green-600 mb-3">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span className="font-semibold text-lg">{day.places.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        Daily Activities
                      </h4>
                      <div className="grid gap-3">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors duration-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                            <span className="text-gray-700 leading-relaxed text-base">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {day.tips && (
                     <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex items-start">
                           <div className="flex-shrink-0 pt-0.5">
                             <Info className="w-5 h-5 text-blue-500" />
                           </div>
                           <div className="ml-3">
                              <p className="text-sm font-semibold text-blue-800">Pro Tip</p>
                             <p className="text-sm text-blue-700 mt-1">{day.tips}</p>
                           </div>
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
              <h3 className="text-2xl font-bold mb-4">🎉 Your Jharkhand Adventure Awaits!</h3>
              <p className="text-green-100 text-lg mb-4">
                You're all set for an amazing {selectedDays}-day journey through the beautiful "Land of Forests"
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Multiple Destinations</span>
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  <span>Photo Opportunities</span>
                </div>
                <div className="flex items-center">
                  <TreePine className="w-4 h-4 mr-1" />
                  <span>Nature & Culture</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;