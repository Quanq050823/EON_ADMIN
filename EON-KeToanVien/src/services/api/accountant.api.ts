import axiosInstance from "@/lib/axios";

export interface Accountant {
	id: string;
	userId: string;
	fullName: string;
	licenseNumber?: string;
	specialization?: string;
	yearsOfExperience?: number;
	phoneNumber?: string;
	email?: string;
	address?: string;
	certifications?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateAccountantData {
	fullName: string;
	licenseNumber?: string;
	specialization?: string;
	yearsOfExperience?: number;
	phoneNumber?: string;
	email?: string;
	address?: string;
	certifications?: string[];
}

export interface UpdateAccountantData extends Partial<CreateAccountantData> {}

/**
 * Accountant API Service
 */
export const accountantApi = {
	/**
	 * Create accountant profile
	 */
	create: async (data: CreateAccountantData): Promise<Accountant> => {
		const response = await axiosInstance.post("/accountant", data);
		return response.data;
	},

	/**
	 * Get current user's accountant profile
	 */
	getMyProfile: async (): Promise<Accountant> => {
		const response = await axiosInstance.get("/accountant/me");
		return response.data;
	},

	/**
	 * Get accountant by user ID (Admin only)
	 */
	getByUserId: async (userId: string): Promise<Accountant> => {
		const response = await axiosInstance.get(`/accountant/${userId}`);
		return response.data;
	},

	/**
	 * Update accountant profile
	 */
	update: async (data: UpdateAccountantData): Promise<Accountant> => {
		const response = await axiosInstance.put("/accountant", data);
		return response.data;
	},

	/**
	 * Delete accountant profile
	 */
	remove: async (): Promise<{ message: string }> => {
		const response = await axiosInstance.delete("/accountant");
		return response.data;
	},

	/**
	 * List all accountants (Admin only)
	 */
	list: async (): Promise<Accountant[]> => {
		const response = await axiosInstance.get("/accountant");
		return response.data;
	},
};
