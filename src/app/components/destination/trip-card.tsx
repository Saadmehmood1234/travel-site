
import { FiCalendar, FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function TripCard({ trip }: { trip: any }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-48 md:h-56 object-cover"
        />
        {trip.isCommunityTrip && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Community Trip
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{trip.title}</h3>
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
            <FiStar className="text-yellow-500 mr-1" />
            <span className="font-medium">{trip.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({trip.reviews})</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{trip.subtitle}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-gray-700">
            <FiCalendar className="mr-2" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FiUsers className="mr-2" />
            <span>{trip.groupSize}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Upcoming Dates:</div>
          <div className="flex flex-wrap gap-2">
            {trip.dates.map((date: string, index: number) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {date}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Highlights:</div>
          <div className="flex flex-wrap gap-2">
            {trip.highlights.map((highlight: string, index: number) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                {highlight}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div>
            <span className="text-gray-500 text-sm">Starting from</span>
            <div className="text-2xl font-bold">{trip.price}</div>
          </div>
          <Link href={`/destinations/${trip.id}`}>
          <button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
            View Details
          </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}