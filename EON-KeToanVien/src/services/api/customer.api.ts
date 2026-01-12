import axiosInstance from "@/lib/axios";

export interface Customer {
	id: string;
	userId: string;
	customerCode: string;
	customerName: string;
	taxCode?: string;
	address?: string;
	phoneNumber?: string;
	email?: string;
	contactPerson?: string;
	bankAccount?: string;
	bankName?: string;
	customerType?: "individual" | "company";
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCustomerData {
	customerCode: string;
	customerName: string;
	taxCode?: string;
	address?: string;
	phoneNumber?: string;
	email?: string;
	contactPerson?: string;
	bankAccount?: string;
	bankName?: string;
	customerType?: "individual" | "company";
	notes?: string;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export interface CustomerStats {
	totalCustomers: number;
	newCustomersThisMonth: number;
	activeCustomers: number;
	topCustomers: Array<{
		id: string;
		name: string;
		totalRevenue: number;
	}>;
}

export interface CustomerListParams {
	page?: number;
	limit?: number;
	sort?: string;
}

/**
 * Customer API Service
 */
export const customerApi = {
	/**
	 * Create new customer
	 */
	create: async (data: CreateCustomerData): Promise<Customer> => {
		const response = await axiosInstance.post("/customer", data);
		return response.data;
	},

	/**
	 * Get customer by ID
	 */
	getById: async (id: string): Promise<Customer> => {
		const response = await axiosInstance.get(`/customer/${id}`);
		return response.data;
	},

	/**
	 * Update customer
	 */
	update: async (id: string, data: UpdateCustomerData): Promise<Customer> => {
		const response = await axiosInstance.put(`/customer/${id}`, data);
		return response.data;
	},

	/**
	 * Delete customer
	 */
	remove: async (id: string): Promise<{ message: string }> => {
		const response = await axiosInstance.delete(`/customer/${id}`);
		return response.data;
	},

	/**
	 * List current user's customers
	 */
	listMyCustomers: async (): Promise<Customer[]> => {
		const response = await axiosInstance.get("/customer");
		return response.data;
	},

	/**
	 * List customers with pagination
	 */
	list: async (
		params?: CustomerListParams
	): Promise<{
		customers: Customer[];
		total: number;
		page: number;
		limit: number;
	}> => {
		const response = await axiosInstance.get("/customer/list/paginated", {
			params,
		});
		return response.data;
	},

	/**
	 * Get customer statistics
	 */
	getStats: async (): Promise<CustomerStats> => {
		const response = await axiosInstance.get("/customer/stats/overview");
		return response.data;
	},

	/**
	 * Search customers
	 */
	search: async (query: string): Promise<Customer[]> => {
		const response = await axiosInstance.get("/customer/search/query", {
			params: { q: query },
		});
		return response.data;
	},
};
