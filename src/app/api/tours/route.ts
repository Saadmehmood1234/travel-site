import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const radius = searchParams.get("radius") || "20";

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ message: "Missing required parameters: latitude and longitude" }),
        { status: 400 }
      );
    }

    const response = await amadeus.referenceData.locations.pointsOfInterest.get({
      latitude,
      longitude,
      radius,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: any) {
    console.error("Amadeus API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: error.code || 500 }
    );
  }
}
