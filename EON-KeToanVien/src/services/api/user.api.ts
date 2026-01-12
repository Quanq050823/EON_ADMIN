import axiosInstance from "@/lib/axios";

export interface User {
	id: string;
	email: string;
	fullName: string;
	phoneNumber?: string;
	avatar?: string;
	role: "user" | "admin" | "accountant" | "business_owner";
	status: "active" | "inactive" | "suspended";
	createdAt: string;
	updatedAt: string;
}

export interface UpdateUserData {
	fullName?: string;
	phoneNumber?: string;
	avatar?: File;
}

export interface ChangePasswordData {
	oldPassword: string;
	newPassword: string;
}

export interface UpdateUserStatusData {
	userId: string;
	status: "active" | "inactive" | "suspended";
}

export interface SelectRoleData {
	role: "accountant" | "business_owner";
}

/**
 * User API Service
 */
export const userApi = {
	/**
	 * Get all users (Admin only)
	 */
	getAllUsers: async (): Promise<User[]> => {
		const response = await axiosInstance.get("/user");
		return response.data;
	},

	/**
	 * Get current user profile
	 */
	getCurrentUser: async (): Promise<User> => {
		const response = await axiosInstance.get("/user/me");
		return response.data;
	},

	/**
	 * Update current user profile
	 */
	updateCurrentUser: async (data: UpdateUserData): Promise<User> => {
		const formData = new FormData();

		if (data.fullName) formData.append("fullName", data.fullName);
		if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
		if (data.avatar) formData.append("avatar", data.avatar);

		const response = await axiosInstance.put("/user/update-info", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	/**
	 * Change password
	 */
	changePassword: async (
		data: ChangePasswordData
	): Promise<{ message: string }> => {
		const response = await axiosInstance.put("/user/change-password", data);
		return response.data;
	},

	/**
	 * Update user status (Admin only)
	 */
	updateUserStatus: async (data: UpdateUserStatusData): Promise<User> => {
		const response = await axiosInstance.put("/user/update-status", data);
		return response.data;
	},

	/**
	 * Select user role
	 */
	selectUserRole: async (data: SelectRoleData): Promise<User> => {
		const response = await axiosInstance.put("/user/select-role", data);
		return response.data;
	},
};
