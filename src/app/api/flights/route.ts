// app/api/flights/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }
  try {

    console.log(process.env.AMADEUS_CLIENT_ID!,process.env.AMADEUS_CLIENT_SECRET!)
    const tokenRes = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_CLIENT_ID!,
          client_secret: process.env.AMADEUS_CLIENT_SECRET!,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: tokenData.error || "Failed to get access token" },
        { status: tokenRes.status }
      );
    }

    const accessToken = tokenData.access_token;


    const flightRes = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const flightData = await flightRes.json();
    return NextResponse.json(flightData, { status: flightRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
