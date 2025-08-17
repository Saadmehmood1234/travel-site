"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/dbConnect";
import { Wishlist } from "@/model/Wishlist";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export type WishlistActionResponse = {
  status: "added" | "removed" | "error";
  message: string;
  error?: string;
};

export const toggleWishlist = async (
  productId: string
): Promise<WishlistActionResponse> => {
  try {
    await dbConnect();
    console.log("Toggling wishlist for productId:", productId);
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    if (!productId) {
      return { status: "error", message: "Product ID required" };
    }

    let wishlist = await Wishlist.findOne({ customerId: session.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        customerId: session.user.id,
        items: [],
      });
    }

    const existingIndex = wishlist.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      wishlist.items.splice(existingIndex, 1);
      await wishlist.save();
      revalidatePath("/wishlist");
      return { status: "removed", message: "Removed from wishlist" };
    } else {
      wishlist.items.push({ productId });
      await wishlist.save();
      revalidatePath("/wishlist");
      return { status: "added", message: "Added to wishlist" };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return {
      status: "error",
      message: "Failed to update wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
