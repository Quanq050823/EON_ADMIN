import axiosInstance from "@/lib/axios";

export interface AdminUser {
	_id: string;
	name: string;
	email: string;
	avatar?: string;
	role: "admin" | "user";
	userType: number;
	isVerified: boolean;
	createDate: string;
}

export interface AdminBusinessOwner {
	_id: string;
	userId: {
		_id: string;
		name: string;
		email: string;
		avatar?: string;
		isVerified: boolean;
	};
	businessName: string;
	businessType: string;
	taxCode?: string;
	address: {
		street: string;
		ward: string;
		district: string;
		city: string;
		zipCode?: string;
	};
	phoneNumber: string;
	industry: string;
	establishedDate?: string;
	employeeCount: number;
	annualRevenue?: number;
	businessStatus: "active" | "inactive" | "suspended";
	taxType?: string;
	tax_filing_frequency?: number;
	easyInvoiceInfo?: {
		account?: string;
		password?: string;
		mst?: string;
		serial?: string;
	};
	documents?: Array<{
		name: string;
		url: string;
		uploadDate: string;
		documentType: "license" | "tax_certificate" | "id_card" | "other";
	}>;
	verificationDate?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AdminAccountant {
	_id: string;
	userId: {
		_id: string;
		name: string;
		email: string;
		avatar?: string;
		isVerified: boolean;
	};
	certifications?: string[];
	experience?: number;
	specialization?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: number;
	search?: string;
	status?: string;
	category?: string;
	isActive?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export interface SystemStats {
	totalUsers: number;
	totalBusinessOwners: number;
	totalAccountants: number;
	totalInvoices: number;
	newUsersThisMonth: number;
}

export interface AdminInvoiceIn {
	_id: string;
	ownerId: string;
	nbmst?: string;
	khmshdon?: number;
	khhdon?: string;
	shdon?: number;
	nbten?: string;
	nbdchi?: string;
	nbsdthoai?: string;
	nbdctdtu?: string;
	nbwebsite?: string;
	nmmst?: string;
	nmten?: string;
	nmdchi?: string;
	nmsdthoai?: string;
	tdlap?: string;
	tgtttbso?: number;
	tgtcthue?: number;
	tgtthue?: number;
	tgtttbchu?: string;
	htttoan?: string;
	dvtte?: string;
	mhdon?: string;
	thdon?: string;
	tthai?: number;
	hthdon?: number;
	hdhhdvu?: any[];
	gchu?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AdminOutputInvoice {
	_id: string;
	businessOwnerId: string;
	nbmst?: string;
	khmshdon?: string;
	khhdon?: string;
	shdon?: string;
	nbten?: string;
	nbdchi?: string;
	nmmst?: string;
	nmten?: string;
	nmdchi?: string;
	tdlap?: string;
	tgtttbso?: string;
	tgtcthue?: string;
	tgtthue?: string;
	tgtttbchu?: string;
	mhdon?: string;
	thdon?: string;
	ncnhat?: string;
	tthai?: string;
	hthdon?: string;
	totalGTGT?: number;
	totalTNCN?: number;
	hdhhdvu?: any[];
	gchu?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaxStatistics {
	period: {
		type: "month" | "quarter" | "year";
		year: number;
		month?: number;
		quarter?: number;
		startDate: string;
		endDate: string;
	};
	statistics: {
		totalGTGT: number;
		totalTNCN: number;
		totalTax: number;
		totalRevenue: number;
		invoiceCount: number;
	};
}

export interface AdminStorageItem {
	_id: string;
	businessOwnerId: string;
	name: string;
	unit: string;
	stock: number;
	price: number;
	imageURL?: string;
	description?: string;
	syncStatus: boolean;
	category: number; // 0: chưa set, 1: nguyên liệu, 2: hàng hóa
	tchat: number;
	conversionUnit?: {
		from?: {
			itemQuantity?: number;
		};
		to?: Array<{
			itemName?: string;
			itemQuantity?: number;
		}>;
		isActive?: boolean;
	};
	createdAt: string;
	updatedAt: string;
}

export interface AdminProduct {
	_id: string;
	ownerId: string;
	name: string;
	code: string;
	category?: string;
	unit?: string;
	price: number;
	description?: string;
	imageUrl?: string;
	stock: number;
	isActive: boolean;
	tchat: number;
	materials?: Array<{
		component: string;
		quantity: number;
		unit: string;
	}>;
	createdAt: string;
	updatedAt: string;
}

/**
 * Admin API Service
 */
export const adminApi = {
	// User Management
	getAllUsers: async (
		params?: PaginationParams & {
			role?: string;
			isVerified?: boolean;
			userType?: number;
		},
	): Promise<PaginatedResponse<AdminUser>> => {
		const response = await axiosInstance.get("/admin/users", { params });
		return response.data;
	},

	getUserById: async (
		userId: string,
	): Promise<{ success: boolean; data: AdminUser }> => {
		const response = await axiosInstance.get(`/admin/users/${userId}`);
		return response.data;
	},

	createUser: async (data: {
		name: string;
		email: string;
		password: string;
		role?: string;
		userType?: number;
	}): Promise<{ success: boolean; data: AdminUser }> => {
		const response = await axiosInstance.post("/admin/users", data);
		return response.data;
	},

	updateUser: async (
		userId: string,
		data: Partial<AdminUser>,
	): Promise<{ success: boolean; data: AdminUser }> => {
		const response = await axiosInstance.put(`/admin/users/${userId}`, data);
		return response.data;
	},

	deleteUser: async (
		userId: string,
	): Promise<{ success: boolean; message: string }> => {
		const response = await axiosInstance.delete(`/admin/users/${userId}`);
		return response.data;
	},

	updateUserRole: async (
		userId: string,
		role: string,
	): Promise<{ success: boolean; data: AdminUser }> => {
		const response = await axiosInstance.patch(`/admin/users/${userId}/role`, {
			role,
		});
		return response.data;
	},

	// Business Owner Management
	getAllBusinessOwners: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<AdminBusinessOwner>> => {
		const response = await axiosInstance.get("/admin/business-owners", {
			params,
		});
		return response.data;
	},

	getBusinessOwnerById: async (
		ownerId: string,
	): Promise<{ success: boolean; data: AdminBusinessOwner }> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}`,
		);
		return response.data;
	},

	getInvoicesInByBusinessOwner: async (
		ownerId: string,
		params?: PaginationParams & { search?: string; status?: string },
	): Promise<PaginatedResponse<AdminInvoiceIn>> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}/invoices-in`,
			{ params },
		);
		return response.data;
	},

	getOutputInvoicesByBusinessOwner: async (
		ownerId: string,
		params?: PaginationParams & { search?: string; status?: string },
	): Promise<PaginatedResponse<AdminOutputInvoice>> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}/output-invoices`,
			{ params },
		);
		return response.data;
	},

	getStorageItemsByBusinessOwner: async (
		ownerId: string,
		params?: PaginationParams & { search?: string; category?: string },
	): Promise<PaginatedResponse<AdminStorageItem>> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}/storage-items`,
			{ params },
		);
		return response.data;
	},

	getProductsByBusinessOwner: async (
		ownerId: string,
		params?: PaginationParams & {
			search?: string;
			category?: string;
			isActive?: string;
		},
	): Promise<PaginatedResponse<AdminProduct>> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}/products`,
			{ params },
		);
		return response.data;
	},

	// Accountant Management
	getAllAccountants: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<AdminAccountant>> => {
		const response = await axiosInstance.get("/admin/accountants", { params });
		return response.data;
	},

	getAccountantById: async (
		accountantId: string,
	): Promise<{ success: boolean; data: AdminAccountant }> => {
		const response = await axiosInstance.get(
			`/admin/accountants/${accountantId}`,
		);
		return response.data;
	},

	// Statistics
	getSystemStats: async (): Promise<{
		success: boolean;
		data: SystemStats;
	}> => {
		const response = await axiosInstance.get("/admin/stats/system");
		return response.data;
	},

	getUserStats: async (): Promise<{ success: boolean; data: any }> => {
		const response = await axiosInstance.get("/admin/stats/users");
		return response.data;
	},

	getInvoiceStats: async (): Promise<{ success: boolean; data: any }> => {
		const response = await axiosInstance.get("/admin/stats/invoices");
		return response.data;
	},

	// Tax Statistics
	getTaxStatisticsByBusinessOwner: async (
		ownerId: string,
		params?: {
			period?: "month" | "quarter" | "year";
			year?: number;
			month?: number;
			quarter?: number;
		},
	): Promise<{ success: boolean; data: TaxStatistics }> => {
		const response = await axiosInstance.get(
			`/admin/business-owners/${ownerId}/tax-statistics`,
			{ params },
		);
		return response.data;
	},
};
