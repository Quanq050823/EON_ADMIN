import axiosInstance from "@/lib/axios";

export interface InvoiceItem {
	productId: string;
	productName: string;
	unit: string;
	quantity: number;
	price: number;
	vatRate: number;
	amount: number;
}

export interface OutputInvoice {
	id: string;
	userId: string;
	invoiceNumber: string;
	invoiceDate: string;
	customerId: string;
	customerName: string;
	customerTaxCode?: string;
	customerAddress?: string;
	items: InvoiceItem[];
	subtotal: number;
	vatAmount: number;
	totalAmount: number;
	paymentMethod?: string;
	paymentStatus: "pending" | "paid" | "partially_paid" | "cancelled";
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateOutputInvoiceData {
	invoiceNumber: string;
	invoiceDate: string;
	customerId: string;
	items: InvoiceItem[];
	paymentMethod?: string;
	paymentStatus?: "pending" | "paid" | "partially_paid";
	notes?: string;
}

export interface UpdateOutputInvoiceData
	extends Partial<CreateOutputInvoiceData> {}

export interface InvoiceListParams {
	page?: number;
	limit?: number;
	startDate?: string;
	endDate?: string;
	status?: string;
}

export interface TaxTotal {
	vat5: number;
	vat10: number;
	totalVat: number;
	period: string;
}

/**
 * Output Invoice API Service
 */
export const invoiceApi = {
	/**
	 * Create new output invoice
	 */
	create: async (data: CreateOutputInvoiceData): Promise<OutputInvoice> => {
		const response = await axiosInstance.post("/output-invoices", data);
		return response.data;
	},

	/**
	 * Get invoice by ID
	 */
	getById: async (id: string): Promise<OutputInvoice> => {
		const response = await axiosInstance.get(`/output-invoices/${id}`);
		return response.data;
	},

	/**
	 * Update invoice
	 */
	update: async (
		id: string,
		data: UpdateOutputInvoiceData
	): Promise<OutputInvoice> => {
		const response = await axiosInstance.put(`/output-invoices/${id}`, data);
		return response.data;
	},

	/**
	 * Delete invoice
	 */
	remove: async (id: string): Promise<{ message: string }> => {
		const response = await axiosInstance.delete(`/output-invoices/${id}`);
		return response.data;
	},

	/**
	 * List invoices
	 */
	list: async (
		params?: InvoiceListParams
	): Promise<{
		invoices: OutputInvoice[];
		total: number;
		page: number;
		limit: number;
	}> => {
		const response = await axiosInstance.get("/output-invoices", { params });
		return response.data;
	},

	/**
	 * Get total taxes
	 */
	getTotalTaxes: async (params?: {
		startDate?: string;
		endDate?: string;
	}): Promise<TaxTotal> => {
		const response = await axiosInstance.get("/output-invoices/taxes/total", {
			params,
		});
		return response.data;
	},
};
