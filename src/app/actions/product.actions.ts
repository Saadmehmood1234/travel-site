"use server";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/model/product.model"
import { IProduct, SerializedProduct, ProductCategory } from "@/types/product";
import { getServerSession } from "next-auth";

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
    
    if (products.length === 0) {
      return {
        success: true,
        data: [],
      };
    }
    
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
