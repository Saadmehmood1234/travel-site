"use server";
import dbConnect from "@/lib/dbConnect";
import Offer, { IOffer } from "@/model/Offer";

export interface SerializedOffer {
  _id: string;
  title: string;
  subtitle: string;
  discount: number;
  description: string;
  image: string;
  validUntil: string;
  code: string;
  type: 'percentage' | 'fixed';
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const serializeOffer = (offer: IOffer): SerializedOffer => {
  const plainOffer = offer.toObject ? offer.toObject() : offer;
  
  return {
    _id: plainOffer._id.toString(),
    title: plainOffer.title,
    subtitle: plainOffer.subtitle,
    discount: plainOffer.discount,
    description: plainOffer.description,
    image: plainOffer.image,
    validUntil: plainOffer.validUntil.toISOString(),
    code: plainOffer.code,
    type: plainOffer.type,
    icon: plainOffer.icon,
    color: plainOffer.color,
    isActive: plainOffer.isActive,
    createdAt: plainOffer.createdAt.toISOString(),
    updatedAt: plainOffer.updatedAt.toISOString(),
  };
};

export const getOffers = async (): Promise<{
  success: boolean;
  data?: SerializedOffer[];
  error?: string;
}> => {
  try {
    await dbConnect();

    const currentDate = new Date();
    const offers = await Offer.find({
      isActive: true,
      validUntil: { $gte: currentDate },
    }).sort({ createdAt: -1 });

    return {
      success: true,
      data: offers.map(serializeOffer),
    };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return {
      success: false,
      error: "Failed to fetch offers",
    };
  }
};
