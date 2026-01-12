export interface Business {
	id: string;
	name: string;
	taxCode: string;
	address: string;
	phone: string;
	email: string;
	ownerName: string;
	businessType: string;
	lastSyncAt: string;
	status: "active" | "pending" | "inactive";
	revenue: number;
	expense: number;
	employeeCount: number;
}

export interface Invoice {
	id: string;
	businessId: string;
	invoiceNumber: string;
	type: "input" | "output";
	partnerName: string;
	amount: number;
	tax: number;
	total: number;
	date: string;
	status: "paid" | "pending" | "overdue";
}

export interface Product {
	id: string;
	businessId: string;
	name: string;
	sku: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	category: string;
}

export interface Employee {
	id: string;
	businessId: string;
	name: string;
	position: string;
	phone: string;
	salary: number;
	startDate: string;
	status: "active" | "inactive";
}

export interface TaxRecord {
	id: string;
	businessId: string;
	type: string;
	period: string;
	amount: number;
	dueDate: string;
	paidDate: string | null;
	status: "paid" | "pending" | "overdue";
}

export interface Expense {
	id: string;
	businessId: string;
	description: string;
	category: string;
	amount: number;
	date: string;
	paymentMethod: string;
}

export const businesses: Business[] = [
	{
		id: "1",
		name: "Cửa hàng Minh Phát",
		taxCode: "0312345678",
		address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
		phone: "0901234567",
		email: "minhphat@email.com",
		ownerName: "Nguyễn Văn Minh",
		businessType: "Dịch vụ",
		lastSyncAt: "2024-01-15T10:30:00",
		status: "active",
		revenue: 450000000,
		expense: 320000000,
		employeeCount: 5,
	},
	{
		id: "2",
		name: "Quán ăn Hương Việt",
		taxCode: "0312345679",
		address: "456 Lê Lợi, Q.1, TP.HCM",
		phone: "0901234568",
		email: "huongviet@email.com",
		ownerName: "Trần Thị Hương",
		businessType: "Phân phối, cung cấp hàng hóa",
		lastSyncAt: "2024-01-15T08:15:00",
		status: "active",
		revenue: 280000000,
		expense: 195000000,
		employeeCount: 8,
	},
	{
		id: "3",
		name: "Tiệm may Thanh Xuân",
		taxCode: "0312345680",
		address: "789 Hai Bà Trưng, Q.3, TP.HCM",
		phone: "0901234569",
		email: "thanhxuan@email.com",
		ownerName: "Lê Thanh Xuân",
		businessType: "Dịch vụ",
		lastSyncAt: "2024-01-14T16:45:00",
		status: "pending",
		revenue: 120000000,
		expense: 85000000,
		employeeCount: 3,
	},
	{
		id: "4",
		name: "Cửa hàng vật liệu Thành Công",
		taxCode: "0312345681",
		address: "321 Cách Mạng Tháng 8, Q.10, TP.HCM",
		phone: "0901234570",
		email: "thanhcong@email.com",
		ownerName: "Phạm Thành Công",
		businessType: "Khác",
		lastSyncAt: "2024-01-13T14:20:00",
		status: "active",
		revenue: 890000000,
		expense: 720000000,
		employeeCount: 12,
	},
];

export const invoices: Invoice[] = [
	{
		id: "1",
		businessId: "1",
		invoiceNumber: "HD001",
		type: "output",
		partnerName: "Công ty ABC",
		amount: 15000000,
		tax: 1500000,
		total: 16500000,
		date: "2024-01-15",
		status: "paid",
	},
	{
		id: "2",
		businessId: "1",
		invoiceNumber: "HD002",
		type: "input",
		partnerName: "Nhà cung cấp XYZ",
		amount: 8000000,
		tax: 800000,
		total: 8800000,
		date: "2024-01-14",
		status: "paid",
	},
	{
		id: "3",
		businessId: "1",
		invoiceNumber: "HD003",
		type: "output",
		partnerName: "Khách hàng DEF",
		amount: 25000000,
		tax: 2500000,
		total: 27500000,
		date: "2024-01-13",
		status: "pending",
	},
	{
		id: "4",
		businessId: "2",
		invoiceNumber: "HD004",
		type: "output",
		partnerName: "Khách lẻ",
		amount: 500000,
		tax: 50000,
		total: 550000,
		date: "2024-01-15",
		status: "paid",
	},
	{
		id: "5",
		businessId: "2",
		invoiceNumber: "HD005",
		type: "input",
		partnerName: "Chợ đầu mối",
		amount: 3000000,
		tax: 300000,
		total: 3300000,
		date: "2024-01-14",
		status: "overdue",
	},
];

export const products: Product[] = [
	{
		id: "1",
		businessId: "1",
		name: "Gạo ST25",
		sku: "GAO001",
		quantity: 500,
		unit: "kg",
		unitPrice: 25000,
		category: "Dịch vụ",
	},
	{
		id: "2",
		businessId: "1",
		name: "Dầu ăn Neptune",
		sku: "DAU001",
		quantity: 200,
		unit: "lít",
		unitPrice: 45000,
		category: "Dịch vụ",
	},
	{
		id: "3",
		businessId: "1",
		name: "Nước mắm Phú Quốc",
		sku: "NM001",
		quantity: 150,
		unit: "chai",
		unitPrice: 35000,
		category: "Dịch vụ",
	},
	{
		id: "4",
		businessId: "2",
		name: "Thịt heo",
		sku: "TH001",
		quantity: 50,
		unit: "kg",
		unitPrice: 120000,
		category: "Dịch vụ",
	},
	{
		id: "5",
		businessId: "2",
		name: "Rau xanh",
		sku: "RX001",
		quantity: 30,
		unit: "kg",
		unitPrice: 30000,
		category: "Rau củ",
	},

	{
		id: "6",
		businessId: "3",
		name: "Áo sơ mi nam",
		sku: "ASM001",
		quantity: 0,
		unit: "cái",
		unitPrice: 350000,
		category: "Sản xuất",
	},
	{
		id: "7",
		businessId: "3",
		name: "Áo dài nữ",
		sku: "ADN001",
		quantity: 0,
		unit: "bộ",
		unitPrice: 1200000,
		category: "Sản xuất",
	},
	{
		id: "8",
		businessId: "3",
		name: "Quần âu",
		sku: "QA001",
		quantity: 0,
		unit: "cái",
		unitPrice: 450000,
		category: "Sản xuất",
	},
	{
		id: "9",
		businessId: "4",
		name: "Bàn gỗ công nghiệp",
		sku: "BGN001",
		quantity: 0,
		unit: "cái",
		unitPrice: 2500000,
		category: "Sản xuất",
	},
	{
		id: "10",
		businessId: "4",
		name: "Tủ kệ lắp ráp",
		sku: "TKL001",
		quantity: 0,
		unit: "bộ",
		unitPrice: 3200000,
		category: "Sản xuất",
	},
];

export const employees: Employee[] = [
	{
		id: "1",
		businessId: "1",
		name: "Nguyễn Văn An",
		position: "Nhân viên bán hàng",
		phone: "0909111222",
		salary: 8000000,
		startDate: "2023-03-01",
		status: "active",
	},
	{
		id: "2",
		businessId: "1",
		name: "Trần Thị Bình",
		position: "Thu ngân",
		phone: "0909111223",
		salary: 7500000,
		startDate: "2023-05-15",
		status: "active",
	},
	{
		id: "3",
		businessId: "2",
		name: "Lê Văn Cường",
		position: "Đầu bếp",
		phone: "0909111224",
		salary: 12000000,
		startDate: "2022-08-01",
		status: "active",
	},
	{
		id: "4",
		businessId: "2",
		name: "Phạm Thị Dung",
		position: "Phục vụ",
		phone: "0909111225",
		salary: 6500000,
		startDate: "2023-09-01",
		status: "active",
	},
];

export const taxRecords: TaxRecord[] = [
	{
		id: "1",
		businessId: "1",
		type: "GTGT",
		period: "Q4/2023",
		amount: 15000000,
		dueDate: "2024-01-30",
		paidDate: "2024-01-20",
		status: "paid",
	},
	{
		id: "2",
		businessId: "1",
		type: "TNCN",
		period: "T12/2023",
		amount: 2500000,
		dueDate: "2024-01-20",
		paidDate: null,
		status: "pending",
	},
	{
		id: "3",
		businessId: "2",
		type: "GTGT",
		period: "Q4/2023",
		amount: 8000000,
		dueDate: "2024-01-30",
		paidDate: null,
		status: "overdue",
	},
	{
		id: "4",
		businessId: "2",
		type: "Môn bài",
		period: "2024",
		amount: 1000000,
		dueDate: "2024-01-31",
		paidDate: "2024-01-10",
		status: "paid",
	},
];

export const expenses: Expense[] = [
	{
		id: "1",
		businessId: "1",
		description: "Tiền điện tháng 12",
		category: "Điện nước",
		amount: 3500000,
		date: "2024-01-05",
		paymentMethod: "Chuyển khoản",
	},
	{
		id: "2",
		businessId: "1",
		description: "Thuê mặt bằng T1/2024",
		category: "Thuê mặt bằng",
		amount: 15000000,
		date: "2024-01-01",
		paymentMethod: "Chuyển khoản",
	},
	{
		id: "3",
		businessId: "2",
		description: "Mua gas",
		category: "Nguyên liệu",
		amount: 2000000,
		date: "2024-01-10",
		paymentMethod: "Tiền mặt",
	},
	{
		id: "4",
		businessId: "2",
		description: "Sửa chữa thiết bị",
		category: "Bảo trì",
		amount: 5000000,
		date: "2024-01-12",
		paymentMethod: "Tiền mặt",
	},
];

export const alerts = [
	{
		id: "1",
		type: "invoice",
		message: "3 hóa đơn mới cần xử lý",
		businessId: "1",
		severity: "info",
	},
	{
		id: "2",
		type: "tax",
		message: "Thuế GTGT Q4/2023 sắp đến hạn",
		businessId: "2",
		severity: "warning",
	},
	{
		id: "3",
		type: "sync",
		message: "Tiệm may Thanh Xuân chưa đồng bộ 2 ngày",
		businessId: "3",
		severity: "error",
	},
];

export const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export const formatDateTime = (dateString: string) => {
	return new Date(dateString).toLocaleString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
