import axiosInstance from "@/lib/axios";

export interface BusinessOwner {
	id: string;
	userId: string;
	businessName: string;
	businessType?: string;
	taxCode?: string;
	address?: string;
	phoneNumber?: string;
	email?: string;
	registrationDate?: string;
	representative?: string;
	bankAccount?: string;
	bankName?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBusinessOwnerData {
	businessName: string;
	businessType?: string;
	taxCode?: string;
	address?: string;
	phoneNumber?: string;
	email?: string;
	registrationDate?: string;
	representative?: string;
	bankAccount?: string;
	bankName?: string;
}

export interface UpdateBusinessOwnerData
	extends Partial<CreateBusinessOwnerData> {}

/**
 * Business Owner API Service
 */
export const businessApi = {
	/**
	 * Create business owner profile
	 */
	create: async (data: CreateBusinessOwnerData): Promise<BusinessOwner> => {
		const response = await axiosInstance.post("/business-owner", data);
		return response.data;
	},

	/**
	 * Get current user's business owner profile
	 */
	getMyProfile: async (): Promise<BusinessOwner> => {
		const response = await axiosInstance.get("/business-owner/me");
		return response.data;
	},

	/**
	 * Get business owner by user ID (Admin only)
	 */
	getByUserId: async (userId: string): Promise<BusinessOwner> => {
		const response = await axiosInstance.get(`/business-owner/${userId}`);
		return response.data;
	},

	/**
	 * Update business owner profile
	 */
	update: async (data: UpdateBusinessOwnerData): Promise<BusinessOwner> => {
		const response = await axiosInstance.put("/business-owner", data);
		return response.data;
	},

	/**
	 * Delete business owner profile
	 */
	remove: async (): Promise<{ message: string }> => {
		const response = await axiosInstance.delete("/business-owner");
		return response.data;
	},

	/**
	 * List all business owners (Admin only)
	 */
	list: async (): Promise<BusinessOwner[]> => {
		const response = await axiosInstance.get("/business-owner");
		return response.data;
	},
};
