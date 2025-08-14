import type { NextApiRequest, NextApiResponse } from "next";
import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { latitude, longitude, radius } = req.query;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const response = await amadeus.referenceData.locations.pointsOfInterest.get({
      latitude: latitude as string,
      longitude: longitude as string,
      radius: radius || "20",
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.code || 500).json({ error: error.message });
  }
}