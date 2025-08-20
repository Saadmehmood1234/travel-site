"use server";

import dbConnect from "@/lib/dbConnect";
import Product from "@/model/product.model"
import { IProduct, SerializedProduct, ProductCategory } from "@/types/product";

const serializeProduct = (product: IProduct): SerializedProduct => ({
  ...product.toObject(),
  _id: product._id.toString(),
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

export const getProducts = async (): Promise<{
  success: boolean;
  data?: SerializedProduct[];
  error?: string;
}> => {
  try {
    await dbConnect();
    const products = await Product.find({});
    return {
      success: true,
      data: products.map(serializeProduct),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
};

export const getFeaturedProducts = async (): Promise<{
  success: boolean;
  data?: SerializedProduct[];
  error?: string;
}> => {
  try {
    await dbConnect();
    const products = await Product.find({ featured: true });
    return {
      success: true,
      data: products.map(serializeProduct),
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      error: "Failed to fetch featured products",
    };
  }
};

export const getProductsByCategory = async (
  category: ProductCategory
): Promise<{
  success: boolean;
  data?: SerializedProduct[];
  error?: string;
}> => {
  try {
    await dbConnect();
    const products = await Product.find({ category });
    return {
      success: true,
      data: products.map(serializeProduct),
    };
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return {
      success: false,
      error: `Failed to fetch ${category} products`,
    };
  }
};

export const getProductById = async (
  id: string
): Promise<{
  success: boolean;
  data?: SerializedProduct;
  error?: string;
}> => {
  try {
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }
    return {
      success: true,
      data: serializeProduct(product),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
};


export type DifficultyLevel = "Easy" | "Moderate" | "Hard";

export interface ProductInput {
  name: string;
  location: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  duration: string;
  category: ProductCategory;
  image: string;
  featured: boolean;
  discount: number;
  highlights?: string[];
  groupSize?: string;
  difficulty?: DifficultyLevel;
  availableDates?: Date[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: string[];
  isCommunityTrip?: boolean;
}

export const createProduct = async (
  productData: ProductInput
): Promise<{
  success: boolean;
  data?: SerializedProduct;
  error?: string;
}> => {
  try {
    await dbConnect();

    const product = await Product.create(productData);

    return {
      success: true,
      data: serializeProduct(product),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: "Failed to create product",
    };
  }
};

// Utility function to serialize product for frontend


export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>
): Promise<{
  success: boolean;
  data?: SerializedProduct;
  error?: string;
}> => {
  try {
    await dbConnect();
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }
    return {
      success: true,
      data: serializeProduct(product),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: "Failed to update product",
    };
  }
};

export const deleteProduct = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await dbConnect();
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return {
        success: false,
        error: "Product not found",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: "Failed to delete product",
    };
  }
};