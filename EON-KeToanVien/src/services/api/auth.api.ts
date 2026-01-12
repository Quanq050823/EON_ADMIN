import axiosInstance from "@/lib/axios";

export interface RegisterData {
	email: string;
	password: string;
	fullName: string;
	phoneNumber?: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface ChangePasswordData {
	oldPassword: string;
	newPassword: string;
}

export interface ForgotPasswordData {
	email: string;
}

export interface VerifyOtpData {
	email: string;
	otp: string;
}

export interface ResetPasswordData {
	email: string;
	otp: string;
	newPassword: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken?: string;
	user: {
		id: string;
		email: string;
		fullName: string;
		role: string;
		avatar?: string;
	};
}

/**
 * Authentication API Service
 */
export const authApi = {
	/**
	 * Register new user
	 */
	register: async (data: RegisterData): Promise<AuthResponse> => {
		const response = await axiosInstance.post("/auth/register", data);
		return response.data;
	},

	/**
	 * Login user
	 */
	login: async (data: LoginData): Promise<AuthResponse> => {
		const response = await axiosInstance.post("/auth/login", data);
		return response.data;
	},

	/**
	 * Logout user
	 */
	logout: async (): Promise<void> => {
		await axiosInstance.get("/auth/logout");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
	},

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated: async (): Promise<boolean> => {
		try {
			const response = await axiosInstance.get("/auth/is-login");
			return response.data.isAuthenticated;
		} catch {
			return false;
		}
	},

	/**
	 * Refresh access token
	 */
	refreshToken: async (): Promise<{ accessToken: string }> => {
		const response = await axiosInstance.post("/auth/refresh");
		return response.data;
	},

	/**
	 * Verify email
	 */
	verifyEmail: async (token: string): Promise<void> => {
		await axiosInstance.get(`/auth/verify-email?token=${token}`);
	},

	/**
	 * Forgot password - Send OTP
	 */
	forgotPassword: async (
		data: ForgotPasswordData
	): Promise<{ message: string }> => {
		const response = await axiosInstance.post("/auth/forgot-password", data);
		return response.data;
	},

	/**
	 * Verify OTP
	 */
	verifyOtp: async (data: VerifyOtpData): Promise<{ message: string }> => {
		const response = await axiosInstance.post("/auth/verify-otp", data);
		return response.data;
	},

	/**
	 * Change password with OTP
	 */
	changePasswordWithOtp: async (
		data: ResetPasswordData
	): Promise<{ message: string }> => {
		const response = await axiosInstance.post("/auth/change-pw-otp", data);
		return response.data;
	},

	/**
	 * Login with Google - Redirect to Google OAuth
	 */
	loginWithGoogle: (): void => {
		window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
	},
};
