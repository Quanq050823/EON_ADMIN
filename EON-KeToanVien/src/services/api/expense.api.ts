import axiosInstance from "@/lib/axios";

export interface ExpenseVoucher {
	id: string;
	userId: string;
	voucherNumber: string;
	voucherDate: string;
	supplierId?: string;
	supplierName?: string;
	supplierTaxCode?: string;
	description: string;
	amount: number;
	vatAmount: number;
	totalAmount: number;
	category: string;
	paymentMethod?: string;
	status: "draft" | "approved" | "paid" | "cancelled";
	attachments?: string[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateExpenseVoucherData {
	voucherNumber: string;
	voucherDate: string;
	supplierId?: string;
	supplierName?: string;
	supplierTaxCode?: string;
	description: string;
	amount: number;
	vatAmount: number;
	category: string;
	paymentMethod?: string;
	status?: "draft" | "approved" | "paid";
	attachments?: string[];
	notes?: string;
}

export interface UpdateExpenseVoucherData
	extends Partial<CreateExpenseVoucherData> {}

export interface ExpenseListParams {
	page?: number;
	limit?: number;
	startDate?: string;
	endDate?: string;
	category?: string;
	status?: string;
}

/**
 * Expense Voucher API Service
 */
export const expenseApi = {
	/**
	 * Create new expense voucher
	 */
	create: async (data: CreateExpenseVoucherData): Promise<ExpenseVoucher> => {
		const response = await axiosInstance.post("/expense-voucher", data);
		return response.data;
	},

	/**
	 * Get expense voucher by ID
	 */
	getById: async (id: string): Promise<ExpenseVoucher> => {
		const response = await axiosInstance.get(`/expense-voucher/${id}`);
		return response.data;
	},

	/**
	 * Update expense voucher
	 */
	update: async (
		id: string,
		data: UpdateExpenseVoucherData
	): Promise<ExpenseVoucher> => {
		const response = await axiosInstance.put(`/expense-voucher/${id}`, data);
		return response.data;
	},

	/**
	 * Delete expense voucher
	 */
	remove: async (id: string): Promise<{ message: string }> => {
		const response = await axiosInstance.delete(`/expense-voucher/${id}`);
		return response.data;
	},

	/**
	 * List expense vouchers
	 */
	list: async (
		params?: ExpenseListParams
	): Promise<{
		expenses: ExpenseVoucher[];
		total: number;
		page: number;
		limit: number;
	}> => {
		const response = await axiosInstance.get("/expense-voucher", { params });
		return response.data;
	},
};
