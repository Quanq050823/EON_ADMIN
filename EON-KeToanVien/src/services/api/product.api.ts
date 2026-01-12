import axiosInstance from "@/lib/axios";

export interface Product {
	id: string;
	userId: string;
	productCode: string;
	productName: string;
	unit: string;
	price: number;
	vatRate: number;
	description?: string;
	category?: string;
	stock?: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProductData {
	productCode: string;
	productName: string;
	unit: string;
	price: number;
	vatRate: number;
	description?: string;
	category?: string;
	stock?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

/**
 * Product API Service
 */
export const productApi = {
	/**
	 * Create new product
	 */
	create: async (data: CreateProductData): Promise<Product> => {
		const response = await axiosInstance.post("/product", data);
		return response.data;
	},

	/**
	 * Get product by ID
	 */
	getById: async (id: string): Promise<Product> => {
		const response = await axiosInstance.get(`/product/${id}`);
		return response.data;
	},

	/**
	 * Update product
	 */
	update: async (id: string, data: UpdateProductData): Promise<Product> => {
		const response = await axiosInstance.put(`/product/${id}`, data);
		return response.data;
	},

	/**
	 * Delete product
	 */
	remove: async (id: string): Promise<{ message: string }> => {
		const response = await axiosInstance.delete(`/product/${id}`);
		return response.data;
	},

	/**
	 * List current user's products
	 */
	listMyProducts: async (): Promise<Product[]> => {
		const response = await axiosInstance.get("/product");
		return response.data;
	},
};
