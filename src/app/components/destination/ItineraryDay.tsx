
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

export default function ItineraryDay({ day }: { day: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden">
      <button 
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-left">
          <div className="font-semibold">Day {day.day}: {day.title}</div>
          <div className="text-sm text-gray-500 mt-1">{day.highlights.join(' • ')}</div>
        </div>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white">
          <p className="text-gray-700 mb-4">{day.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Highlights</h4>
              <ul className="space-y-2">
                {day.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Details</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-500 w-24">Meals:</span>
                  <span>{day.meals.join(', ')}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Stay:</span>
                  <span>{day.accommodation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}