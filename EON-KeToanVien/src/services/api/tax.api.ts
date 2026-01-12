import axiosInstance from "@/lib/axios";

export interface TaxSubmission {
	id: string;
	userId: string;
	submissionCode: string;
	taxPeriod: string;
	taxType: "VAT" | "CIT" | "PIT" | "OTHER";
	status: "draft" | "submitted" | "approved" | "rejected";
	submissionDate?: string;
	dueDate: string;
	totalRevenue: number;
	taxableRevenue: number;
	taxAmount: number;
	paidAmount: number;
	remainingAmount: number;
	description?: string;
	attachments?: string[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaxSubmissionData {
	submissionCode: string;
	taxPeriod: string;
	taxType: "VAT" | "CIT" | "PIT" | "OTHER";
	dueDate: string;
	totalRevenue: number;
	taxableRevenue: number;
	taxAmount: number;
	paidAmount?: number;
	description?: string;
	attachments?: string[];
	notes?: string;
}

export interface UpdateTaxSubmissionData
	extends Partial<CreateTaxSubmissionData> {
	status?: "draft" | "submitted" | "approved" | "rejected";
}

/**
 * Tax Submission API Service
 */
export const taxApi = {
	/**
	 * Create new tax submission
	 */
	create: async (data: CreateTaxSubmissionData): Promise<TaxSubmission> => {
		const response = await axiosInstance.post("/tax-submission", data);
		return response.data;
	},

	/**
	 * Get tax submission by ID
	 */
	getById: async (id: string): Promise<TaxSubmission> => {
		const response = await axiosInstance.get(`/tax-submission/${id}`);
		return response.data;
	},

	/**
	 * Update tax submission
	 */
	update: async (
		id: string,
		data: UpdateTaxSubmissionData
	): Promise<TaxSubmission> => {
		const response = await axiosInstance.put(`/tax-submission/${id}`, data);
		return response.data;
	},

	/**
	 * Delete tax submission
	 */
	remove: async (id: string): Promise<{ message: string }> => {
		const response = await axiosInstance.delete(`/tax-submission/${id}`);
		return response.data;
	},

	/**
	 * Get all tax submissions for current business owner
	 */
	getAllByOwner: async (): Promise<TaxSubmission[]> => {
		const response = await axiosInstance.get("/tax-submission");
		return response.data;
	},
};
