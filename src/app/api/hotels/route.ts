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

  const { cityCode, checkInDate, checkOutDate, adults } = req.query;
  
  if (!cityCode || !checkInDate || !checkOutDate || !adults) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode as string,
      checkInDate: checkInDate as string,
      checkOutDate: checkOutDate as string,
      adults: adults as string,
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.code || 500).json({ error: error.message });
  }
}