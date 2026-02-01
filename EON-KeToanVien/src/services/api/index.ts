/**
 * Central export file for all API services
 * Import from this file to access all API functions
 *
 * Example usage:
 * import { authApi, userApi, invoiceApi } from '@/services/api';
 */

export { authApi } from "./auth.api";
export { userApi } from "./user.api";
export { businessApi } from "./business.api";
export { accountantApi } from "./accountant.api";
export { productApi } from "./product.api";
export { customerApi } from "./customer.api";
export { invoiceApi } from "./invoice.api";
export { expenseApi } from "./expense.api";
export { taxApi } from "./tax.api";
export { adminApi } from "./admin.api";

// Re-export types
export type { RegisterData, LoginData, AuthResponse } from "./auth.api";
export type { User, UpdateUserData } from "./user.api";
export type { BusinessOwner, CreateBusinessOwnerData } from "./business.api";
export type { Accountant, CreateAccountantData } from "./accountant.api";
export type { Product, CreateProductData } from "./product.api";
export type { Customer, CreateCustomerData } from "./customer.api";
export type { OutputInvoice, CreateOutputInvoiceData } from "./invoice.api";
export type { ExpenseVoucher, CreateExpenseVoucherData } from "./expense.api";
export type { TaxSubmission, CreateTaxSubmissionData } from "./tax.api";
export type {
	AdminUser,
	AdminBusinessOwner,
	AdminAccountant,
	AdminInvoiceIn,
	AdminOutputInvoice,
	AdminStorageItem,
	AdminProduct,
	PaginationParams,
	PaginatedResponse,
	SystemStats,
	TaxStatistics,
} from "./admin.api";
