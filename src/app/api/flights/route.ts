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

function calculateDuration(departureTime: string, arrivalTime: string): string {
  const depTime = new Date(departureTime);
  const arrTime = new Date(arrivalTime);
  const durationMs = arrTime.getTime() - depTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
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

    let flightOffersUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${departureDate}&adults=${adults}&max=10`;

    if (tripType === 'roundTrip' && returnDate) {
      flightOffersUrl += `&returnDate=${returnDate}`;
    }

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
      const outboundItinerary = offer.itineraries[0];
      const returnItinerary = offer.itineraries[1] || null;
      
      const outboundSegments = outboundItinerary.segments;
      const firstOutboundSegment = outboundSegments[0];
      const lastOutboundSegment = outboundSegments[outboundSegments.length - 1];
      
      const departureTime = new Date(firstOutboundSegment.departure.at);
      const arrivalTime = new Date(lastOutboundSegment.arrival.at);
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      let returnFlight = null;
      if (returnItinerary) {
        const returnSegments = returnItinerary.segments;
        const firstReturnSegment = returnSegments[0];
        const lastReturnSegment = returnSegments[returnSegments.length - 1];
        
        const returnDepartureTime = new Date(firstReturnSegment.departure.at);
        const returnArrivalTime = new Date(lastReturnSegment.arrival.at);
        const returnDurationMs = returnArrivalTime.getTime() - returnDepartureTime.getTime();
        const returnHours = Math.floor(returnDurationMs / (1000 * 60 * 60));
        const returnMinutes = Math.floor((returnDurationMs % (1000 * 60 * 60)) / (1000 * 60));
        
        returnFlight = {
          airline: firstReturnSegment.carrierCode,
          flightNumber: `${firstReturnSegment.carrierCode}${firstReturnSegment.number}`,
          departure: {
            airport: firstReturnSegment.departure.iataCode,
            time: formatTime(firstReturnSegment.departure.at),
            city: getCityName(firstReturnSegment.departure.iataCode),
            date: formatDate(firstReturnSegment.departure.at),
            datetime: firstReturnSegment.departure.at
          },
          arrival: {
            airport: lastReturnSegment.arrival.iataCode,
            time: formatTime(lastReturnSegment.arrival.at),
            city: getCityName(lastReturnSegment.arrival.iataCode),
            date: formatDate(lastReturnSegment.arrival.at),
            datetime: lastReturnSegment.arrival.at
          },
          duration: `${returnHours}h ${returnMinutes}m`,
          segments: returnSegments.map((segment: any) => ({
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

      return {
        id: offer.id,
        airline: firstOutboundSegment.carrierCode,
        airlineName: getAirlineName(firstOutboundSegment.carrierCode),
        flightNumber: `${firstOutboundSegment.carrierCode}${firstOutboundSegment.number}`,
        departure: {
          airport: firstOutboundSegment.departure.iataCode,
          airportName: getAirlineName(firstOutboundSegment.departure.iataCode),
          time: formatTime(firstOutboundSegment.departure.at),
          city: getCityName(firstOutboundSegment.departure.iataCode),
          date: formatDate(firstOutboundSegment.departure.at),
          datetime: firstOutboundSegment.departure.at
        },
        arrival: {
          airport: lastOutboundSegment.arrival.iataCode,
          airportName: getAirlineName(lastOutboundSegment.arrival.iataCode),
          time: formatTime(lastOutboundSegment.arrival.at),
          city: getCityName(lastOutboundSegment.arrival.iataCode),
          date: formatDate(lastOutboundSegment.arrival.at),
          datetime: lastOutboundSegment.arrival.at
        },
        duration: `${hours}h ${minutes}m`,
        durationMinutes: Math.floor(durationMs / (1000 * 60)),
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        seatsAvailable: Math.max(1, Math.floor(Math.random() * 10) + 1),
        stops: outboundSegments.length - 1,
        isRoundTrip: tripType === 'roundTrip',
        returnFlight: returnFlight,
        segments: outboundSegments.map((segment: any) => ({
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
        returnDate,
        tripType,
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