import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityCode = searchParams.get("cityCode");
  const checkInDate = searchParams.get("checkInDate");
  const checkOutDate = searchParams.get("checkOutDate");
  const adults = searchParams.get("adults");

  if (!cityCode || !checkInDate || !checkOutDate || !adults) {
    return new Response(
      JSON.stringify({ message: "Missing required parameters" }),
      { status: 400 }
    );
  }

  try {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.code || 500 }
    );
  }
}
