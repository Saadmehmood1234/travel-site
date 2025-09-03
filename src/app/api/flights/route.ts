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

function processItinerary(itinerary: any, originCode: string, destinationCode: string) {
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  
  const departureTime = new Date(firstSegment.departure.at);
  const arrivalTime = new Date(lastSegment.arrival.at);
  const durationMs = arrivalTime.getTime() - departureTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    airline: firstSegment.carrierCode,
    flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
    departure: {
      airport: firstSegment.departure.iataCode,
      time: formatTime(firstSegment.departure.at),
      city: getCityName(firstSegment.departure.iataCode),
      date: formatDate(firstSegment.departure.at),
      datetime: firstSegment.departure.at
    },
    arrival: {
      airport: lastSegment.arrival.iataCode,
      time: formatTime(lastSegment.arrival.at),
      city: getCityName(lastSegment.arrival.iataCode),
      date: formatDate(lastSegment.arrival.at),
      datetime: lastSegment.arrival.at
    },
    duration: `${hours}h ${minutes}m`,
    durationMinutes: Math.floor(durationMs / (1000 * 60)),
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
}

async function searchFlights(accessToken: string, originCode: string, destinationCode: string, date: string, adults: string) {
  const flightOffersUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${date}&adults=${adults}&max=10`;

  const flightResponse = await fetch(flightOffersUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!flightResponse.ok) {
    const errorData = await flightResponse.json();
    throw new Error(errorData.errors?.[0]?.detail || "Failed to fetch flight offers");
  }

  const flightData = await flightResponse.json();
  return flightData.data || [];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const tripType = searchParams.get("tripType") || "oneWay";
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

  if (tripType === 'roundTrip' && returnDate) {
    const returnDateObj = new Date(returnDate);
    returnDateObj.setHours(0, 0, 0, 0);
    if (returnDateObj < selectedDate) {
      return NextResponse.json(
        {
          error: "Return date cannot be before departure date.",
        },
        { status: 400 }
      );
    }
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

    // Search for outbound flights (origin → destination)
    const outboundFlights = await searchFlights(accessToken, originCode, destinationCode, departureDate, adults);

    if (outboundFlights.length === 0) {
      return NextResponse.json(
        {
          error: "No flights found for the selected route and date. Please try different search criteria.",
          flights: []
        },
        { status: 404 }
      );
    }

    let returnFlights = [];
    
    // If round trip, search for return flights (destination → origin)
    if (tripType === 'roundTrip' && returnDate) {
      try {
        returnFlights = await searchFlights(accessToken, destinationCode, originCode, returnDate, adults);
      } catch (error) {
        console.error("Error fetching return flights:", error);
        // Continue with outbound flights only, but mark as round trip search
      }
    }

    // Process the flights
    const processedFlights = outboundFlights.map((outboundOffer: any, index: number) => {
      const outboundItinerary = outboundOffer.itineraries[0];
      const outboundFlight = processItinerary(outboundItinerary, originCode, destinationCode);

      // For round trip, try to find a matching return flight
      let returnFlight = null;
      if (tripType === 'roundTrip' && returnFlights.length > 0) {
        // Use the same index if available, or first available return flight
        const returnOffer = returnFlights[index] || returnFlights[0];
        if (returnOffer) {
          const returnItinerary = returnOffer.itineraries[0];
          returnFlight = processItinerary(returnItinerary, destinationCode, originCode);
          
          // Update price to include both flights
          const totalPrice = parseFloat(outboundOffer.price.total) + parseFloat(returnOffer.price.total);
          outboundOffer.price.total = totalPrice.toString();
        }
      }

      return {
        id: outboundOffer.id,
        airline: outboundFlight.airline,
        airlineName: getAirlineName(outboundFlight.airline),
        flightNumber: outboundFlight.flightNumber,
        departure: {
          airport: outboundFlight.departure.airport,
          airportName: getAirlineName(outboundFlight.departure.airport),
          time: outboundFlight.departure.time,
          city: outboundFlight.departure.city,
          date: outboundFlight.departure.date,
          datetime: outboundFlight.departure.datetime
        },
        arrival: {
          airport: outboundFlight.arrival.airport,
          airportName: getAirlineName(outboundFlight.arrival.airport),
          time: outboundFlight.arrival.time,
          city: outboundFlight.arrival.city,
          date: outboundFlight.arrival.date,
          datetime: outboundFlight.arrival.datetime
        },
        duration: outboundFlight.duration,
        durationMinutes: outboundFlight.durationMinutes,
        price: parseFloat(outboundOffer.price.total),
        currency: outboundOffer.price.currency,
        seatsAvailable: Math.max(1, Math.floor(Math.random() * 10) + 1),
        stops: outboundFlight.stops,
        isRoundTrip: tripType === 'roundTrip',
        returnFlight: returnFlight,
        segments: outboundFlight.segments
      };
    });

    return NextResponse.json({ 
      flights: processedFlights,
      meta: {
        origin: originCode,
        destination: destinationCode,
        departureDate,
        returnDate,
        tripType,
        totalFlights: processedFlights.length,
        hasReturnFlights: returnFlights.length > 0
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