import { NextRequest, NextResponse } from "next/server";
import { commonCodes } from "@/lib/Destinations";
import { commonAirports } from "@/lib/Destinations";
async function getAmadeusToken() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/flights/amadeus/token`
    );
    if (!response.ok) {
      throw new Error("Failed to get token");
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Token fetch error:", error);
    throw error;
  }
}

async function getIataCode(
  locationName: string,
  accessToken: string,
  isCity = true
): Promise<string> {
  try {
    const type = isCity ? "CITY" : "AIRPORT";
    const url = `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(
      locationName
    )}&subType=${type}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location data for ${locationName}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0].iataCode;
    } else {
      if (isCity) {
        return await getIataCode(locationName, accessToken, false);
      }
      throw new Error(`No IATA code found for ${locationName}`);
    }
  } catch (error) {
    console.error("IATA code fetch error:", error);



    const normalizedName = locationName.toLowerCase().trim();
    return (
      commonCodes[normalizedName] || locationName.toUpperCase().substring(0, 3)
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const adults = searchParams.get("adults") || "1";

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      {
        error: "Missing required parameters: origin, destination, departureDate",
      },
      { status: 400 }
    );
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(departureDate);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return NextResponse.json(
      {
        error: "Departure date cannot be in the past. Please select a future date.",
      },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAmadeusToken();

    let originCode, destinationCode;
    
    try {
      originCode = await getIataCode(origin, accessToken);
    } catch (error) {
      return NextResponse.json(
        {
          error: `Could not find airport code for origin: ${origin}. Please enter a valid city or airport code.`,
        },
        { status: 400 }
      );
    }
    
    try {
      destinationCode = await getIataCode(destination, accessToken);
    } catch (error) {
      return NextResponse.json(
        {
          error: `Could not find airport code for destination: ${destination}. Please enter a valid city or airport code.`,
        },
        { status: 400 }
      );
    }

    const flightOffersUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${departureDate}&adults=${adults}&max=10`;

    const flightResponse = await fetch(flightOffersUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!flightResponse.ok) {
      const errorData = await flightResponse.json();
      
      let errorMessage = "Failed to fetch flight offers";
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0].detail || errorMessage;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: flightResponse.status }
      );
    }

    const flightData = await flightResponse.json();
  
    if (!flightData.data || flightData.data.length === 0) {
      return NextResponse.json(
        {
          error: "No flights found for the selected route and date. Please try different search criteria.",
          flights: []
        },
        { status: 404 }
      );
    }
    const processedFlights = flightData.data.map((offer: any) => {
      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      const departureTime = new Date(firstSegment.departure.at);
      const arrivalTime = new Date(lastSegment.arrival.at);
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      return {
        id: offer.id,
        airline: firstSegment.carrierCode,
        airlineName: getAirlineName(firstSegment.carrierCode),
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        departure: {
          airport: firstSegment.departure.iataCode,
          airportName: getAirlineName(firstSegment.departure.iataCode),
          time: formatTime(firstSegment.departure.at),
          city: getCityName(firstSegment.departure.iataCode),
          date: formatDate(firstSegment.departure.at),
          datetime: firstSegment.departure.at
        },
        arrival: {
          airport: lastSegment.arrival.iataCode,
          airportName: getAirlineName(lastSegment.arrival.iataCode),
          time: formatTime(lastSegment.arrival.at),
          city: getCityName(lastSegment.arrival.iataCode),
          date: formatDate(lastSegment.arrival.at),
          datetime: lastSegment.arrival.at
        },
        duration: `${hours}h ${minutes}m`,
        durationMinutes: Math.floor(durationMs / (1000 * 60)),
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        seatsAvailable: Math.max(1, Math.floor(Math.random() * 10) + 1),
        stops: segments.length - 1,
        segments: segments.map((segment: any) => ({
          airline: segment.carrierCode,
          flightNumber: `${segment.carrierCode}${segment.number}`,
          departure: {
            airport: segment.departure.iataCode,
            time: formatTime(segment.departure.at),
            terminal: segment.departure.terminal
          },
          arrival: {
            airport: segment.arrival.iataCode,
            time: formatTime(segment.arrival.at),
            terminal: segment.arrival.terminal
          },
          duration: segment.duration
        }))
      };
    });

    return NextResponse.json({ 
      flights: processedFlights,
      meta: {
        origin: originCode,
        destination: destinationCode,
        departureDate,
        totalFlights: processedFlights.length
      }
    });

  } catch (error:any) {
    console.error("Amadeus flight search error:", error);
    
    return NextResponse.json(
      { 
        error: "Unable to search for flights at the moment. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


function getCityName(iataCode: string): string {
  const airport = commonAirports.find(a => a.iataCode === iataCode);
  return airport ? airport.city : iataCode;
}

function getAirlineName(code: string): string {
  const airlines: Record<string, string> = {
    'AI': 'Air India',
    '6E': 'IndiGo',
    'UK': 'Vistara',
    'SG': 'SpiceJet',
    'G8': 'Go First',
    'QP': 'Akasa Air',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
    'AA': 'American Airlines',
    'LH': 'Lufthansa',
    'BA': 'British Airways',
    'AF': 'Air France',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific'
  };
  return airlines[code] || code;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function generateMockFlights(
  origin: string,
  destination: string,
  date: string,
  passengers: number
) {
  const airlines = ["AI", "6E", "UK", "SG", "G8", "QP"];
  const airlineNames = [
    "Air India",
    "IndiGo",
    "Vistara",
    "SpiceJet",
    "Go First",
    "Akasa Air",
  ];
  const times = ["08:00", "10:30", "13:15", "16:45", "19:20", "22:00"];

  return times.map((time, index) => ({
    id: `FL${index + 100}`,
    airline: airlineNames[index % airlineNames.length],
    flightNumber: `${airlines[index % airlines.length]}${index + 100}`,
    departure: {
      airport: `${origin} Airport`,
      time: time,
      city: origin,
      date: date,
    },
    arrival: {
      airport: `${destination} Airport`,
      time: addTime(time, Math.floor(Math.random() * 4) + 2),
      city: destination,
      date: date,
    },
    duration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(
      Math.random() * 60
    )}m`,
    price: Math.round(3000 + Math.random() * 2000),
    seatsAvailable: Math.max(1, 10 - passengers),
    stops: Math.floor(Math.random() * 2),
  }));
}

function addTime(time: string, hoursToAdd: number): string {
  const [hours, minutes] = time.split(":").map(Number);
  let newHours = hours + hoursToAdd;
  if (newHours >= 24) newHours -= 24;
  return `${newHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
