"use server";

import { revalidatePath } from "next/cache";
import { Wishlist } from "@/model/Wishlist";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";
import Product from "@/model/product.model";

export type WishlistActionResponse = {
  status: "added" | "removed" | "error";
  message: string;
  error?: string;
};

export type WishlistItem = {
  productId: Types.ObjectId;
  addedAt: Date;
};

export type WishlistData = {
  items: WishlistItem[];
  count: number;
};


interface WishlistDocument {
  _id: Types.ObjectId;
  customerId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}


export const toggleWishlist = async (
  productId: string
): Promise<WishlistActionResponse> => {
  try {
    await dbConnect();
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
      (item: WishlistItem) => item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      wishlist.items.splice(existingIndex, 1);
      await wishlist.save();
      revalidatePath("/wishlist");
      revalidatePath("/products");
      revalidatePath("/");
      return { status: "removed", message: "Removed from wishlist" };
    } else {
      wishlist.items.push({ 
        productId: new Types.ObjectId(productId),
        addedAt: new Date()
      });
      await wishlist.save();
      revalidatePath("/wishlist");
      revalidatePath("/products");
      revalidatePath("/");
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

export const getUserWishlist = async (): Promise<{
  success: boolean;
  data?: WishlistData;
  error?: string;
}> => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const wishlist = await Wishlist.findOne({ customerId: session.user.id }).lean();

    if (!wishlist) {
      return { 
        success: true, 
        data: { items: [], count: 0 } 
      };
    }

    const wishlistDoc = wishlist as unknown as WishlistDocument;

    return {
      success: true,
      data: {
        items: wishlistDoc.items,
        count: wishlistDoc.items.length
      }
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch wishlist"
    };
  }
};
export const getWishlistCount = async (): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const wishlist = await Wishlist.findOne({ customerId: session.user.id });
    
    if (!wishlist) {
      return { success: true, count: 0 };
    }

    return {
      success: true,
      count: wishlist.items.length
    };
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch wishlist count"
    };
  }
};

export const isProductInWishlist = async (productId: string): Promise<{
  success: boolean;
  isInWishlist?: boolean;
  error?: string;
}> => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const wishlist = await Wishlist.findOne({ 
      customerId: session.user.id,
      "items.productId": new Types.ObjectId(productId)
    });

    return {
      success: true,
      isInWishlist: !!wishlist
    };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check wishlist"
    };
  }
};
export const getWishlistWithProducts = async (): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const wishlist = await Wishlist.findOne({ customerId: session.user.id }).lean();

    if (!wishlist) {
      return { 
        success: true, 
        data: { items: [], count: 0 } 
      };
    }

    const wishlistDoc = wishlist as unknown as {
      _id: string;
      customerId: string;
      items: Array<{
        productId: string;
        addedAt: Date;
      }>;
      createdAt: Date;
      updatedAt: Date;
      __v: number;
    };

    const productIds = wishlistDoc.items.map(item => item.productId);

    const products = await Product.find({
      _id: { $in: productIds }
    }).select('name image location price rating').lean<any[]>();
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product._id.toString(), product);
    });
    const itemsWithProducts = wishlistDoc.items.map((item) => {
      const product = productMap.get(item.productId.toString());
      
      if (!product) {
        return null;
      }

      return {
        productId: {
          _id: product._id.toString(),
          name: product.name,
          image: product.image,
          location: product.location,
          price: product.price,
          rating: product.rating,
        },
        addedAt: item.addedAt
      }
    }).filter(Boolean); 

    return {
      success: true,
      data: {
        items: itemsWithProducts,
        count: itemsWithProducts.length
      }
    };
  } catch (error) {
    console.error("Error fetching wishlist with products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch wishlist"
    };
  }
};