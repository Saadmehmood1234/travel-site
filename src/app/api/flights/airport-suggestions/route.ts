
import { NextRequest, NextResponse } from 'next/server';
import { commonAirports } from '@/lib/Destinations';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const filtered = commonAirports.filter(airport => 
      airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({ suggestions: filtered });
  } catch (error) {
    console.error('Airport suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}