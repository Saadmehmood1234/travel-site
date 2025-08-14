import type { NextApiRequest, NextApiResponse } from "next";
import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { origin, destination, departureDate, adults } = req.query;

    // Validate required parameters
    if (!origin || !destination || !departureDate || !adults) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin as string,
      destinationLocationCode: destination as string,
      departureDate: departureDate as string,
      adults: adults as string,
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Flight search error:", error);
    return res
      .status(error?.response?.status || 500)
      .json({ message: error.message });
  }
}