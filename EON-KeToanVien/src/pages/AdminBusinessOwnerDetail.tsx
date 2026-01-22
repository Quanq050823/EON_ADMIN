import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	adminApi,
	type AdminBusinessOwner,
	type AdminInvoiceIn,
	type AdminOutputInvoice,
	type AdminStorageItem,
	type AdminProduct,
} from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	Building2,
	Calendar,
	FileText,
	Mail,
	MapPin,
	Phone,
	User,
	Users,
	DollarSign,
	Shield,
	Briefcase,
	Hash,
	Receipt,
	ChevronLeft,
	ChevronRight,
	Package,
	ShoppingCart,
	Search,
	ArrowUpDown,
	Eye,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminBusinessOwnerDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [outputCurrentPage, setOutputCurrentPage] = useState(1);
	const [storageCurrentPage, setStorageCurrentPage] = useState(1);
	const [productCurrentPage, setProductCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// InvoicesIn filters
	const [invoiceSearch, setInvoiceSearch] = useState("");
	const [invoiceStatus, setInvoiceStatus] = useState("");
	const [invoiceSortBy, setInvoiceSortBy] = useState("tdlap");
	const [invoiceSortOrder, setInvoiceSortOrder] = useState<1 | -1>(-1);

	// OutputInvoices filters
	const [outputSearch, setOutputSearch] = useState("");
	const [outputStatus, setOutputStatus] = useState("");
	const [outputSortBy, setOutputSortBy] = useState("tdlap");
	const [outputSortOrder, setOutputSortOrder] = useState<1 | -1>(-1);

	// StorageItems filters
	const [storageSearch, setStorageSearch] = useState("");
	const [storageCategory, setStorageCategory] = useState("");
	const [storageSortBy, setStorageSortBy] = useState("createdAt");
	const [storageSortOrder, setStorageSortOrder] = useState<1 | -1>(-1);

	// Products filters
	const [productSearch, setProductSearch] = useState("");
	const [productCategory, setProductCategory] = useState("");
	const [productIsActive, setProductIsActive] = useState("");
	const [productSortBy, setProductSortBy] = useState("createdAt");
	const [productSortOrder, setProductSortOrder] = useState<1 | -1>(-1);

	// Invoice detail modal
	const [selectedInvoice, setSelectedInvoice] = useState<AdminInvoiceIn | null>(
		null,
	);
	const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);

	// Output invoice detail modal
	const [selectedOutputInvoice, setSelectedOutputInvoice] =
		useState<AdminOutputInvoice | null>(null);
	const [isOutputInvoiceDetailOpen, setIsOutputInvoiceDetailOpen] =
		useState(false);

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-business-owner-detail", id],
		queryFn: () => adminApi.getBusinessOwnerById(id!),
		enabled: !!id,
	});

	const businessOwner = response?.data;

	const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
		queryKey: [
			"admin-invoices-in",
			id,
			currentPage,
			itemsPerPage,
			invoiceSearch,
			invoiceStatus,
			invoiceSortBy,
			invoiceSortOrder,
		],
		queryFn: () =>
			adminApi.getInvoicesInByBusinessOwner(id!, {
				page: currentPage,
				limit: itemsPerPage,
				sortBy: invoiceSortBy,
				sortOrder: invoiceSortOrder,
				search: invoiceSearch,
				status: invoiceStatus,
			}),
		enabled: !!id,
	});

	const invoices = invoicesData?.data || [];
	const invoicesPagination = invoicesData?.pagination;

	const { data: outputInvoicesData, isLoading: isLoadingOutputInvoices } =
		useQuery({
			queryKey: [
				"admin-output-invoices",
				id,
				outputCurrentPage,
				itemsPerPage,
				outputSearch,
				outputStatus,
				outputSortBy,
				outputSortOrder,
			],
			queryFn: () =>
				adminApi.getOutputInvoicesByBusinessOwner(id!, {
					page: outputCurrentPage,
					limit: itemsPerPage,
					sortBy: outputSortBy,
					sortOrder: outputSortOrder,
					search: outputSearch,
					status: outputStatus,
				}),
			enabled: !!id,
		});

	const outputInvoices = outputInvoicesData?.data || [];
	const outputInvoicesPagination = outputInvoicesData?.pagination;

	const { data: storageItemsData, isLoading: isLoadingStorageItems } = useQuery(
		{
			queryKey: [
				"admin-storage-items",
				id,
				storageCurrentPage,
				itemsPerPage,
				storageSearch,
				storageCategory,
				storageSortBy,
				storageSortOrder,
			],
			queryFn: () =>
				adminApi.getStorageItemsByBusinessOwner(id!, {
					page: storageCurrentPage,
					limit: itemsPerPage,
					sortBy: storageSortBy,
					sortOrder: storageSortOrder,
					search: storageSearch,
					category: storageCategory,
				}),
			enabled: !!id,
		},
	);

	const storageItems = storageItemsData?.data || [];
	const storageItemsPagination = storageItemsData?.pagination;

	const { data: productsData, isLoading: isLoadingProducts } = useQuery({
		queryKey: [
			"admin-products",
			id,
			productCurrentPage,
			itemsPerPage,
			productSearch,
			productCategory,
			productIsActive,
			productSortBy,
			productSortOrder,
		],
		queryFn: () =>
			adminApi.getProductsByBusinessOwner(id!, {
				page: productCurrentPage,
				limit: itemsPerPage,
				sortBy: productSortBy,
				sortOrder: productSortOrder,
				search: productSearch,
				category: productCategory,
				isActive: productIsActive,
			}),
		enabled: !!id,
	});

	const products = productsData?.data || [];
	const productsPagination = productsData?.pagination;

	const formatDate = (dateString?: string) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString?: string) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatCurrency = (amount?: number) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			active:
				"bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20",
			inactive:
				"bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20",
			suspended:
				"bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20",
		};
		const labels = {
			active: "Hoạt động",
			inactive: "Ngưng hoạt động",
			suspended: "Tạm ngưng",
		};
		return (
			<Badge
				className={variants[status as keyof typeof variants]}
				variant="secondary"
			>
				{labels[status as keyof typeof labels] || status}
			</Badge>
		);
	};

	const getInvoiceStatusText = (status?: number) => {
		switch (status) {
			case 1:
				return "Đã ký";
			case 2:
				return "Chưa ký";
			case 3:
				return "Đã hủy";
			default:
				return "N/A";
		}
	};

	const getFilingFrequencyText = (frequency?: number) => {
		if (!frequency) return "N/A";
		return frequency === 1
			? "Theo quý"
			: frequency === 2
				? "Theo tháng"
				: "N/A";
	};

	const getCategoryText = (category: number) => {
		switch (category) {
			case 1:
				return "Nguyên liệu";
			case 2:
				return "Hàng hóa";
			default:
				return "Chưa phân loại";
		}
	};

	const getCategoryBadge = (category: number) => {
		const variants = {
			1: "bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20",
			2: "bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20",
			0: "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20",
		};
		return (
			<Badge
				className={variants[category as keyof typeof variants]}
				variant="secondary"
			>
				{getCategoryText(category)}
			</Badge>
		);
	};

	if (isLoading) {
		return (
			<div className="space-y-6 animate-fade-in">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Chi tiết Hộ kinh doanh
						</h1>
					</div>
				</div>
				<div className="flex items-center justify-center py-12">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
					<p className="ml-4 text-muted-foreground">Đang tải dữ liệu...</p>
				</div>
			</div>
		);
	}

	if (error || !businessOwner) {
		return (
			<div className="space-y-6 animate-fade-in">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Chi tiết Hộ kinh doanh
						</h1>
					</div>
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="text-center text-red-500">
							Không tìm thấy thông tin hộ kinh doanh.
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{businessOwner.businessName}
						</h1>
						<p className="text-muted-foreground">
							Chi tiết thông tin hộ kinh doanh
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{getStatusBadge(businessOwner.businessStatus)}
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="info" className="w-full">
				<TabsList>
					<TabsTrigger value="info">Thông tin</TabsTrigger>
					<TabsTrigger value="invoices">
						Hóa đơn mua vào ({invoicesPagination?.total || 0})
					</TabsTrigger>
					<TabsTrigger value="output-invoices">
						Hóa đơn bán ra ({outputInvoicesPagination?.total || 0})
					</TabsTrigger>
					<TabsTrigger value="storage">
						Kho hàng ({storageItemsPagination?.total || 0})
					</TabsTrigger>
					<TabsTrigger value="products">
						Sản phẩm ({productsPagination?.total || 0})
					</TabsTrigger>
				</TabsList>

				{/* Info Tab */}
				<TabsContent value="info" className="space-y-6 mt-6">
					{/* Business Information */}
					<div className="grid gap-6 md:grid-cols-2">
						{/* Basic Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Building2 className="h-5 w-5" />
									Thông tin cơ bản
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Building2 className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Tên hộ kinh doanh
											</p>
											<p className="font-medium">
												{businessOwner.businessName}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Hash className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Mã số thuế
											</p>
											<p className="font-medium">
												{businessOwner.taxCode || (
													<span className="text-muted-foreground">Chưa có</span>
												)}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Briefcase className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Loại hình</p>
											<p className="font-medium">
												{businessOwner.businessType}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Briefcase className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Ngành nghề
											</p>
											<p className="font-medium">{businessOwner.industry}</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Ngày thành lập
											</p>
											<p className="font-medium">
												{formatDate(businessOwner.establishedDate)}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Users className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Số nhân viên
											</p>
											<p className="font-medium">
												{businessOwner.employeeCount}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="h-5 w-5" />
									Thông tin chủ hộ & Liên hệ
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<User className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Tên chủ hộ
											</p>
											<p className="font-medium">
												{businessOwner.userId?.name || "N/A"}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Mail className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="font-medium">
												{businessOwner.userId?.email || "N/A"}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Phone className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Số điện thoại
											</p>
											<p className="font-medium">{businessOwner.phoneNumber}</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Địa chỉ</p>
											<p className="font-medium">
												{businessOwner.address?.street && (
													<>
														{businessOwner.address.street}
														<br />
													</>
												)}
												{businessOwner.address?.ward && (
													<>
														{businessOwner.address.ward},{" "}
														{businessOwner.address.district}
														<br />
													</>
												)}
												{businessOwner.address?.city}
												{businessOwner.address?.zipCode && (
													<> - {businessOwner.address.zipCode}</>
												)}
											</p>
										</div>
									</div>
									<Separator />
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Shield className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Trạng thái tài khoản
											</p>
											<Badge
												variant={
													businessOwner.userId?.isVerified
														? "default"
														: "secondary"
												}
											>
												{businessOwner.userId?.isVerified
													? "Đã xác thực"
													: "Chưa xác thực"}
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Tax Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Thông tin thuế
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-3">
								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<FileText className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">Loại thuế</p>
											<p className="font-medium">
												{businessOwner.taxType || (
													<span className="text-muted-foreground">Chưa có</span>
												)}
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Kỳ nộp thuế
											</p>
											<p className="font-medium">
												{getFilingFrequencyText(
													businessOwner.tax_filing_frequency,
												)}
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-start gap-3">
										<Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm text-muted-foreground">
												Ngày xác minh
											</p>
											<p className="font-medium">
												{formatDate(businessOwner.verificationDate)}
											</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* EasyInvoice Info */}
					{businessOwner.easyInvoiceInfo && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Thông tin EasyInvoice
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-6 md:grid-cols-4">
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">Tài khoản</p>
										<p className="font-medium">
											{businessOwner.easyInvoiceInfo.account || "N/A"}
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">Mật khẩu</p>
										<p className="font-medium">
											{businessOwner.easyInvoiceInfo.password || "N/A"}
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">MST</p>
										<p className="font-medium">
											{businessOwner.easyInvoiceInfo.mst || "N/A"}
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">Serial</p>
										<p className="font-medium">
											{businessOwner.easyInvoiceInfo.serial || "N/A"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Documents */}
					{businessOwner.documents && businessOwner.documents.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Tài liệu ({businessOwner.documents.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{businessOwner.documents.map((doc, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div className="flex items-center gap-3">
												<FileText className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium">{doc.name}</p>
													<p className="text-sm text-muted-foreground">
														{doc.documentType} • Tải lên ngày{" "}
														{formatDate(doc.uploadDate)}
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => window.open(doc.url, "_blank")}
											>
												Xem
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Notes */}
					{businessOwner.notes && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Ghi chú
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm">{businessOwner.notes}</p>
							</CardContent>
						</Card>
					)}

					{/* System Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Thông tin hệ thống
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground">Ngày tạo</p>
									<p className="font-medium">
										{formatDateTime(businessOwner.createdAt)}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground">
										Cập nhật lần cuối
									</p>
									<p className="font-medium">
										{formatDateTime(businessOwner.updatedAt)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Invoices Tab */}
				<TabsContent value="invoices" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Receipt className="h-5 w-5" />
								Danh sách hóa đơn mua vào
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							{/* Filters and Search */}
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Tìm kiếm theo ký hiệu, số hóa đơn, MST..."
											value={invoiceSearch}
											onChange={(e) => {
												setInvoiceSearch(e.target.value);
												setCurrentPage(1);
											}}
											className="pl-10"
										/>
									</div>
									<Select
										value={invoiceStatus || "all"}
										onValueChange={(value) => {
											setInvoiceStatus(value === "all" ? "" : value);
											setCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Trạng thái" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Tất cả</SelectItem>
											<SelectItem value="1">Hợp lệ</SelectItem>
											<SelectItem value="2">Chưa xử lý</SelectItem>
											<SelectItem value="3">Đã hủy</SelectItem>
										</SelectContent>
									</Select>
									<Select
										value={invoiceSortBy}
										onValueChange={(value) => setInvoiceSortBy(value)}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Sắp xếp theo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="tdlap">Ngày lập</SelectItem>
											<SelectItem value="tgtttbso">Tổng tiền</SelectItem>
											<SelectItem value="nbten">Người bán</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										size="icon"
										onClick={() =>
											setInvoiceSortOrder(invoiceSortOrder === -1 ? 1 : -1)
										}
									>
										<ArrowUpDown className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
						<CardContent className="p-0">
							{isLoadingInvoices ? (
								<div className="p-8 text-center">
									<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
									<p className="mt-4 text-muted-foreground">
										Đang tải dữ liệu...
									</p>
								</div>
							) : invoices.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									{invoiceSearch || invoiceStatus
										? "Không tìm thấy hóa đơn phù hợp"
										: "Chưa có hóa đơn mua vào nào"}
								</div>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Ký hiệu</TableHead>
												<TableHead>Số hóa đơn</TableHead>
												<TableHead>Người bán</TableHead>
												<TableHead>Mã số thuế NB</TableHead>
												<TableHead>Ngày lập</TableHead>
												<TableHead className="text-right">Tổng tiền</TableHead>
												<TableHead className="text-right">Thuế GTGT</TableHead>
												<TableHead className="text-right">Tổng cộng</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead className="text-right"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{invoices.map((invoice) => (
												<TableRow key={invoice._id}>
													<TableCell className="font-medium">
														{invoice.khhdon || "N/A"}
													</TableCell>
													<TableCell>{invoice.shdon || "N/A"}</TableCell>
													<TableCell className="max-w-[200px] truncate">
														{invoice.nbten || "N/A"}
													</TableCell>
													<TableCell>{invoice.nbmst || "N/A"}</TableCell>
													<TableCell>{formatDate(invoice.tdlap)}</TableCell>
													<TableCell className="text-right">
														{formatCurrency(invoice.tgtcthue)}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(invoice.tgtthue)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{formatCurrency(invoice.tgtttbso)}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																invoice.tthai === 1 ? "default" : "secondary"
															}
														>
															{getInvoiceStatusText(invoice.tthai)}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => {
																setSelectedInvoice(invoice);
																setIsInvoiceDetailOpen(true);
															}}
														>
															<Eye className="h-4 w-4 mr-1" />
															Chi tiết
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>

									{/* Pagination */}
									{invoicesPagination && invoicesPagination.pages > 1 && (
										<div className="flex items-center justify-between border-t px-6 py-4">
											<div className="text-sm text-muted-foreground">
												Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
												{Math.min(
													currentPage * itemsPerPage,
													invoicesPagination.total,
												)}{" "}
												trong tổng số {invoicesPagination.total} kết quả
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setCurrentPage(currentPage - 1)}
													disabled={currentPage === 1}
												>
													<ChevronLeft className="h-4 w-4" />
													Trước
												</Button>
												<div className="flex items-center gap-1">
													{Array.from(
														{ length: invoicesPagination.pages },
														(_, i) => i + 1,
													)
														.filter(
															(page) =>
																page === 1 ||
																page === invoicesPagination.pages ||
																Math.abs(page - currentPage) <= 1,
														)
														.map((page, index, array) => (
															<>
																{index > 0 && array[index - 1] !== page - 1 && (
																	<span
																		key={`ellipsis-${page}`}
																		className="px-2"
																	>
																		...
																	</span>
																)}
																<Button
																	key={page}
																	variant={
																		page === currentPage ? "default" : "outline"
																	}
																	size="sm"
																	onClick={() => setCurrentPage(page)}
																>
																	{page}
																</Button>
															</>
														))}
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setCurrentPage(currentPage + 1)}
													disabled={currentPage === invoicesPagination.pages}
												>
													Sau
													<ChevronRight className="h-4 w-4" />
												</Button>
											</div>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Output Invoices Tab */}
				<TabsContent value="output-invoices" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Receipt className="h-5 w-5" />
								Danh sách hóa đơn bán ra
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							{/* Filters and Search */}
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Tìm kiếm theo ký hiệu, số hóa đơn, MST..."
											value={outputSearch}
											onChange={(e) => {
												setOutputSearch(e.target.value);
												setOutputCurrentPage(1);
											}}
											className="pl-10"
										/>
									</div>
									<Select
										value={outputStatus || "all"}
										onValueChange={(value) => {
											setOutputStatus(value === "all" ? "" : value);
											setOutputCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Trạng thái" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Tất cả</SelectItem>
											<SelectItem value="1">Hợp lệ</SelectItem>
											<SelectItem value="2">Chưa xử lý</SelectItem>
											<SelectItem value="3">Đã hủy</SelectItem>
										</SelectContent>
									</Select>
									<Select
										value={outputSortBy}
										onValueChange={(value) => setOutputSortBy(value)}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Sắp xếp theo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="tdlap">Ngày lập</SelectItem>
											<SelectItem value="tgtttbso">Tổng tiền</SelectItem>
											<SelectItem value="nbten">Người mua</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										size="icon"
										onClick={() =>
											setOutputSortOrder(outputSortOrder === -1 ? 1 : -1)
										}
									>
										<ArrowUpDown className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
						<CardContent className="p-0">
							{isLoadingOutputInvoices ? (
								<div className="p-8 text-center">
									<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
									<p className="mt-4 text-muted-foreground">
										Đang tải dữ liệu...
									</p>
								</div>
							) : outputInvoices.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									{outputSearch || outputStatus
										? "Không tìm thấy hóa đơn phù hợp"
										: "Chưa có hóa đơn bán ra nào"}
								</div>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Ký hiệu</TableHead>
												<TableHead>Số hóa đơn</TableHead>
												<TableHead>Người mua</TableHead>
												<TableHead>Mã số thuế NM</TableHead>
												<TableHead>Ngày lập</TableHead>
												<TableHead className="text-right">Tổng tiền</TableHead>
												<TableHead className="text-right">Thuế GTGT</TableHead>
												<TableHead className="text-right">Thuế TNCN</TableHead>
												<TableHead className="text-right">Tổng cộng</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead className="text-right">Thao tác</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{outputInvoices.map((invoice) => (
												<TableRow key={invoice._id}>
													<TableCell className="font-medium">
														{invoice.khhdon || "N/A"}
													</TableCell>
													<TableCell>{invoice.shdon || "N/A"}</TableCell>
													<TableCell className="max-w-[200px] truncate">
														{invoice.nmten || "N/A"}
													</TableCell>
													<TableCell>{invoice.nmmst || "N/A"}</TableCell>
													<TableCell>{formatDate(invoice.tdlap)}</TableCell>
													<TableCell className="text-right">
														{formatCurrency(Number(invoice.tgtcthue) || 0)}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(invoice.totalGTGT || 0)}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(invoice.totalTNCN || 0)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{formatCurrency(Number(invoice.tgtttbso) || 0)}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																invoice.tthai === "1" ? "default" : "secondary"
															}
														>
															{getInvoiceStatusText(
																invoice.tthai === "1"
																	? 1
																	: invoice.tthai === "2"
																		? 2
																		: invoice.tthai === "3"
																			? 3
																			: undefined,
															)}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => {
																setSelectedOutputInvoice(invoice);
																setIsOutputInvoiceDetailOpen(true);
															}}
														>
															<Eye className="h-4 w-4 mr-1" />
															Chi tiết
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>

									{/* Pagination */}
									{outputInvoicesPagination &&
										outputInvoicesPagination.pages > 1 && (
											<div className="flex items-center justify-between border-t px-6 py-4">
												<div className="text-sm text-muted-foreground">
													Hiển thị {(outputCurrentPage - 1) * itemsPerPage + 1}{" "}
													-{" "}
													{Math.min(
														outputCurrentPage * itemsPerPage,
														outputInvoicesPagination.total,
													)}{" "}
													trong tổng số {outputInvoicesPagination.total} kết quả
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															setOutputCurrentPage(outputCurrentPage - 1)
														}
														disabled={outputCurrentPage === 1}
													>
														<ChevronLeft className="h-4 w-4" />
														Trước
													</Button>
													<div className="flex items-center gap-1">
														{Array.from(
															{ length: outputInvoicesPagination.pages },
															(_, i) => i + 1,
														)
															.filter(
																(page) =>
																	page === 1 ||
																	page === outputInvoicesPagination.pages ||
																	Math.abs(page - outputCurrentPage) <= 1,
															)
															.map((page, index, array) => (
																<>
																	{index > 0 &&
																		array[index - 1] !== page - 1 && (
																			<span
																				key={`ellipsis-${page}`}
																				className="px-2"
																			>
																				...
																			</span>
																		)}
																	<Button
																		key={page}
																		variant={
																			page === outputCurrentPage
																				? "default"
																				: "outline"
																		}
																		size="sm"
																		onClick={() => setOutputCurrentPage(page)}
																	>
																		{page}
																	</Button>
																</>
															))}
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															setOutputCurrentPage(outputCurrentPage + 1)
														}
														disabled={
															outputCurrentPage ===
															outputInvoicesPagination.pages
														}
													>
														Sau
														<ChevronRight className="h-4 w-4" />
													</Button>
												</div>
											</div>
										)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Storage Items Tab */}
				<TabsContent value="storage" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								Danh sách hàng hóa trong kho
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							{/* Filters and Search */}
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Tìm kiếm theo tên, mã sản phẩm..."
											value={storageSearch}
											onChange={(e) => {
												setStorageSearch(e.target.value);
												setStorageCurrentPage(1);
											}}
											className="pl-10"
										/>
									</div>
									<Select
										value={storageCategory || "all"}
										onValueChange={(value) => {
											setStorageCategory(value === "all" ? "" : value);
											setStorageCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Danh mục" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Tất cả</SelectItem>
											<SelectItem value="0">Chưa phân loại</SelectItem>
											<SelectItem value="1">Nguyên liệu</SelectItem>
											<SelectItem value="2">Hàng hóa</SelectItem>
										</SelectContent>
									</Select>
									<Select
										value={storageSortBy}
										onValueChange={(value) => setStorageSortBy(value)}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Sắp xếp theo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="createdAt">Ngày tạo</SelectItem>
											<SelectItem value="name">Tên</SelectItem>
											<SelectItem value="quantity">Số lượng</SelectItem>
											<SelectItem value="price">Giá</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										size="icon"
										onClick={() =>
											setStorageSortOrder(storageSortOrder === -1 ? 1 : -1)
										}
									>
										<ArrowUpDown className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
						<CardContent className="p-0">
							{isLoadingStorageItems ? (
								<div className="p-8 text-center">
									<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
									<p className="mt-4 text-muted-foreground">
										Đang tải dữ liệu...
									</p>
								</div>
							) : storageItems.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									{storageSearch || storageCategory
										? "Không tìm thấy sản phẩm phù hợp"
										: "Kho hàng hiện tại trống"}
								</div>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Tên sản phẩm</TableHead>
												<TableHead>Phân loại</TableHead>
												<TableHead>Đơn vị</TableHead>
												<TableHead className="text-right">Số lượng</TableHead>
												<TableHead className="text-right">Đơn giá</TableHead>
												<TableHead className="text-right">
													Tổng giá trị
												</TableHead>
												<TableHead>Ngày tạo</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{storageItems.map((item) => (
												<TableRow key={item._id}>
													<TableCell>
														<div className="flex items-center gap-3">
															{item.imageURL ? (
																<img
																	src={item.imageURL}
																	alt={item.name}
																	className="h-10 w-10 rounded object-cover"
																/>
															) : (
																<div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
																	<Package className="h-5 w-5 text-muted-foreground" />
																</div>
															)}
															<div>
																<p className="font-medium">{item.name}</p>
																{item.description && (
																	<p className="text-sm text-muted-foreground truncate max-w-[200px]">
																		{item.description}
																	</p>
																)}
															</div>
														</div>
													</TableCell>
													<TableCell>
														{getCategoryBadge(item.category)}
													</TableCell>
													<TableCell>{item.unit}</TableCell>
													<TableCell className="text-right font-medium">
														{item.stock.toLocaleString("vi-VN")}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(item.price)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{formatCurrency(item.stock * item.price)}
													</TableCell>
													<TableCell>{formatDate(item.createdAt)}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>

									{/* Pagination */}
									{storageItemsPagination &&
										storageItemsPagination.pages > 1 && (
											<div className="flex items-center justify-between border-t px-6 py-4">
												<div className="text-sm text-muted-foreground">
													Hiển thị {(storageCurrentPage - 1) * itemsPerPage + 1}{" "}
													-{" "}
													{Math.min(
														storageCurrentPage * itemsPerPage,
														storageItemsPagination.total,
													)}{" "}
													trong tổng số {storageItemsPagination.total} kết quả
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															setStorageCurrentPage(storageCurrentPage - 1)
														}
														disabled={storageCurrentPage === 1}
													>
														<ChevronLeft className="h-4 w-4" />
														Trước
													</Button>
													<div className="flex items-center gap-1">
														{Array.from(
															{ length: storageItemsPagination.pages },
															(_, i) => i + 1,
														)
															.filter(
																(page) =>
																	page === 1 ||
																	page === storageItemsPagination.pages ||
																	Math.abs(page - storageCurrentPage) <= 1,
															)
															.map((page, index, array) => (
																<>
																	{index > 0 &&
																		array[index - 1] !== page - 1 && (
																			<span
																				key={`ellipsis-${page}`}
																				className="px-2"
																			>
																				...
																			</span>
																		)}
																	<Button
																		key={page}
																		variant={
																			page === storageCurrentPage
																				? "default"
																				: "outline"
																		}
																		size="sm"
																		onClick={() => setStorageCurrentPage(page)}
																	>
																		{page}
																	</Button>
																</>
															))}
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															setStorageCurrentPage(storageCurrentPage + 1)
														}
														disabled={
															storageCurrentPage ===
															storageItemsPagination.pages
														}
													>
														Sau
														<ChevronRight className="h-4 w-4" />
													</Button>
												</div>
											</div>
										)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Products Tab */}
				<TabsContent value="products" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ShoppingCart className="h-5 w-5" />
								Danh sách sản phẩm
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							{/* Filters and Search */}
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Tìm kiếm theo tên, mã sản phẩm..."
											value={productSearch}
											onChange={(e) => {
												setProductSearch(e.target.value);
												setProductCurrentPage(1);
											}}
											className="pl-10"
										/>
									</div>
									<Select
										value={productCategory || "all"}
										onValueChange={(value) => {
											setProductCategory(value === "all" ? "" : value);
											setProductCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Danh mục" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Tất cả</SelectItem>
											<SelectItem value="Đồ ăn">Đồ ăn</SelectItem>
											<SelectItem value="Đồ uống">Đồ uống</SelectItem>
											<SelectItem value="Nguyên liệu">Nguyên liệu</SelectItem>
											<SelectItem value="Khác">Khác</SelectItem>
										</SelectContent>
									</Select>
									<Select
										value={productIsActive || "all"}
										onValueChange={(value) => {
											setProductIsActive(value === "all" ? "" : value);
											setProductCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-full sm:w-[180px]">
											<SelectValue placeholder="Trạng thái" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Tất cả</SelectItem>
											<SelectItem value="true">Hoạt động</SelectItem>
											<SelectItem value="false">Ngưng bán</SelectItem>
										</SelectContent>
									</Select>
									<Select
										value={productSortBy}
										onValueChange={(value) => setProductSortBy(value)}
									>
										<SelectTrigger className="w-full sm:w-[200px]">
											<SelectValue placeholder="Sắp xếp theo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="createdAt">Ngày tạo</SelectItem>
											<SelectItem value="name">Tên</SelectItem>
											<SelectItem value="price">Giá</SelectItem>
											<SelectItem value="stock">Tồn kho</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										size="icon"
										onClick={() =>
											setProductSortOrder(productSortOrder === -1 ? 1 : -1)
										}
									>
										<ArrowUpDown className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
						<CardContent className="p-0">
							{isLoadingProducts ? (
								<div className="p-8 text-center">
									<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
									<p className="mt-4 text-muted-foreground">
										Đang tải dữ liệu...
									</p>
								</div>
							) : products.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									{productSearch || productCategory || productIsActive
										? "Không tìm thấy sản phẩm phù hợp"
										: "Chưa có sản phẩm nào"}
								</div>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Sản phẩm</TableHead>
												<TableHead>Mã SP</TableHead>
												<TableHead>Danh mục</TableHead>
												<TableHead>Đơn vị</TableHead>
												<TableHead className="text-right">Giá bán</TableHead>
												<TableHead className="text-right">Tồn kho</TableHead>
												<TableHead>Nguyên liệu</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead>Ngày tạo</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{products.map((product) => (
												<TableRow key={product._id}>
													<TableCell>
														<div className="flex items-center gap-3">
															{product.imageUrl ? (
																<img
																	src={product.imageUrl}
																	alt={product.name}
																	className="h-10 w-10 rounded object-cover"
																/>
															) : (
																<div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
																	<ShoppingCart className="h-5 w-5 text-muted-foreground" />
																</div>
															)}
															<div>
																<p className="font-medium">{product.name}</p>
																{product.description && (
																	<p className="text-sm text-muted-foreground truncate max-w-[200px]">
																		{product.description}
																	</p>
																)}
															</div>
														</div>
													</TableCell>
													<TableCell className="font-mono text-sm">
														{product.code}
													</TableCell>
													<TableCell>
														{product.category || (
															<span className="text-muted-foreground">N/A</span>
														)}
													</TableCell>
													<TableCell>
														{product.unit || (
															<span className="text-muted-foreground">N/A</span>
														)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{formatCurrency(product.price)}
													</TableCell>
													<TableCell className="text-right">
														{product.stock.toLocaleString("vi-VN")}
													</TableCell>
													<TableCell>
														{product.materials &&
														product.materials.length > 0 ? (
															<Badge variant="outline">
																{product.materials.length} NL
															</Badge>
														) : (
															<span className="text-muted-foreground text-sm">
																Không có
															</span>
														)}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																product.isActive ? "default" : "secondary"
															}
														>
															{product.isActive ? "Hoạt động" : "Ngưng bán"}
														</Badge>
													</TableCell>
													<TableCell>{formatDate(product.createdAt)}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>

									{/* Pagination */}
									{productsPagination && productsPagination.pages > 1 && (
										<div className="flex items-center justify-between border-t px-6 py-4">
											<div className="text-sm text-muted-foreground">
												Hiển thị {(productCurrentPage - 1) * itemsPerPage + 1} -{" "}
												{Math.min(
													productCurrentPage * itemsPerPage,
													productsPagination.total,
												)}{" "}
												trong tổng số {productsPagination.total} kết quả
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setProductCurrentPage(productCurrentPage - 1)
													}
													disabled={productCurrentPage === 1}
												>
													<ChevronLeft className="h-4 w-4" />
													Trước
												</Button>
												<div className="flex items-center gap-1">
													{Array.from(
														{ length: productsPagination.pages },
														(_, i) => i + 1,
													)
														.filter(
															(page) =>
																page === 1 ||
																page === productsPagination.pages ||
																Math.abs(page - productCurrentPage) <= 1,
														)
														.map((page, index, array) => (
															<>
																{index > 0 && array[index - 1] !== page - 1 && (
																	<span
																		key={`ellipsis-${page}`}
																		className="px-2"
																	>
																		...
																	</span>
																)}
																<Button
																	key={page}
																	variant={
																		page === productCurrentPage
																			? "default"
																			: "outline"
																	}
																	size="sm"
																	onClick={() => setProductCurrentPage(page)}
																>
																	{page}
																</Button>
															</>
														))}
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setProductCurrentPage(productCurrentPage + 1)
													}
													disabled={
														productCurrentPage === productsPagination.pages
													}
												>
													Sau
													<ChevronRight className="h-4 w-4" />
												</Button>
											</div>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Invoice Detail Dialog */}
			<Dialog open={isInvoiceDetailOpen} onOpenChange={setIsInvoiceDetailOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Chi tiết hóa đơn mua vào</DialogTitle>
					</DialogHeader>
					{selectedInvoice && (
						<div className="space-y-6">
							{/* Thông tin chung */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin hóa đơn</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Ký hiệu hóa đơn
										</p>
										<p className="font-medium">
											{selectedInvoice.khhdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Số hóa đơn</p>
										<p className="font-medium">
											{selectedInvoice.shdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mã hóa đơn</p>
										<p className="font-medium">
											{selectedInvoice.mhdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Ngày lập</p>
										<p className="font-medium">
											{formatDate(selectedInvoice.tdlap)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Hình thức hóa đơn
										</p>
										<p className="font-medium">
											{selectedInvoice.hthdon === 1
												? "Hóa đơn điện tử"
												: selectedInvoice.hthdon === 2
													? "Hóa đơn giấy"
													: "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Trạng thái</p>
										<Badge
											variant={
												selectedInvoice.tthai === 1 ? "default" : "secondary"
											}
										>
											{getInvoiceStatusText(selectedInvoice.tthai)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin người bán */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin người bán</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">
											Tên người bán
										</p>
										<p className="font-medium">
											{selectedInvoice.nbten || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mã số thuế</p>
										<p className="font-medium">
											{selectedInvoice.nbmst || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Số điện thoại
										</p>
										<p className="font-medium">
											{selectedInvoice.nbsdthoai || "N/A"}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">Địa chỉ</p>
										<p className="font-medium">
											{selectedInvoice.nbdchi || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Email</p>
										<p className="font-medium">
											{selectedInvoice.nbdctdtu || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Website</p>
										<p className="font-medium">
											{selectedInvoice.nbwebsite || "N/A"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin người mua */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin người mua</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">
											Tên người mua
										</p>
										<p className="font-medium">
											{selectedInvoice.nmten || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mã số thuế</p>
										<p className="font-medium">
											{selectedInvoice.nmmst || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Số điện thoại
										</p>
										<p className="font-medium">
											{selectedInvoice.nmsdthoai || "N/A"}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">Địa chỉ</p>
										<p className="font-medium">
											{selectedInvoice.nmdchi || "N/A"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin thanh toán */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Thông tin thanh toán
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng tiền chưa thuế
										</p>
										<p className="font-medium text-lg">
											{formatCurrency(selectedInvoice.tgtcthue)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng thuế GTGT
										</p>
										<p className="font-medium text-lg">
											{formatCurrency(selectedInvoice.tgtthue)}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">
											Tổng tiền thanh toán
										</p>
										<p className="font-bold text-xl text-primary">
											{formatCurrency(selectedInvoice.tgtttbso)}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-muted-foreground">
											Số tiền bằng chữ
										</p>
										<p className="font-medium">
											{selectedInvoice.tgtttbchu || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Hình thức thanh toán
										</p>
										<p className="font-medium">
											{selectedInvoice.htttoan || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Đơn vị tiền tệ
										</p>
										<p className="font-medium">
											{selectedInvoice.dvtte || "VND"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Danh sách hàng hóa dịch vụ */}
							{selectedInvoice.hdhhdvu &&
								selectedInvoice.hdhhdvu.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Danh sách hàng hóa / dịch vụ
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>STT</TableHead>
														<TableHead>Tên hàng hóa / dịch vụ</TableHead>
														<TableHead>Đơn vị</TableHead>
														<TableHead className="text-right">
															Số lượng
														</TableHead>
														<TableHead className="text-right">
															Đơn giá
														</TableHead>
														<TableHead className="text-right">
															Thành tiền
														</TableHead>
														<TableHead className="text-right">
															Thuế suất
														</TableHead>
														<TableHead className="text-right">
															Tiền thuế
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{selectedInvoice.hdhhdvu.map(
														(item: any, index: number) => (
															<TableRow key={index}>
																<TableCell>{item.stt || index + 1}</TableCell>
																<TableCell className="max-w-[300px]">
																	{item.ten || "N/A"}
																</TableCell>
																<TableCell>{item.dvtinh || "N/A"}</TableCell>
																<TableCell className="text-right">
																	{item.sluong?.toLocaleString("vi-VN") || "0"}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(item.dgia)}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(item.thtien)}
																</TableCell>
																<TableCell className="text-right">
																	{item.tsuat ? `${item.tsuat}%` : "N/A"}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(item.tthue)}
																</TableCell>
															</TableRow>
														),
													)}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								)}

							{/* Ghi chú */}
							{selectedInvoice.gchu && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Ghi chú</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm">{selectedInvoice.gchu}</p>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Output Invoice Detail Dialog */}
			<Dialog
				open={isOutputInvoiceDetailOpen}
				onOpenChange={setIsOutputInvoiceDetailOpen}
			>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Chi tiết hóa đơn bán ra</DialogTitle>
					</DialogHeader>
					{selectedOutputInvoice && (
						<div className="space-y-6">
							{/* Thông tin chung */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin hóa đơn</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Ký hiệu hóa đơn
										</p>
										<p className="font-medium">
											{selectedOutputInvoice.khhdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Số hóa đơn</p>
										<p className="font-medium">
											{selectedOutputInvoice.shdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mẫu hóa đơn</p>
										<p className="font-medium">
											{selectedOutputInvoice.mhdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Thời điểm lập
										</p>
										<p className="font-medium">
											{selectedOutputInvoice.tdlap
												? new Date(selectedOutputInvoice.tdlap).toLocaleString(
														"vi-VN",
													)
												: "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Hình thức hóa đơn
										</p>
										<p className="font-medium">
											{selectedOutputInvoice.hthdon || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Trạng thái</p>
										<Badge
											variant={
												selectedOutputInvoice.tthai === "1"
													? "default"
													: "secondary"
											}
										>
											{getInvoiceStatusText(
												selectedOutputInvoice.tthai === "1"
													? 1
													: selectedOutputInvoice.tthai === "2"
														? 2
														: selectedOutputInvoice.tthai === "3"
															? 3
															: undefined,
											)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin người bán */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin người bán</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">Tên</p>
										<p className="font-medium">
											{selectedOutputInvoice.nbten || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mã số thuế</p>
										<p className="font-medium">
											{selectedOutputInvoice.nbmst || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Địa chỉ</p>
										<p className="font-medium">
											{selectedOutputInvoice.nbdchi || "N/A"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin người mua */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Thông tin người mua</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">Tên</p>
										<p className="font-medium">
											{selectedOutputInvoice.nmten || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mã số thuế</p>
										<p className="font-medium">
											{selectedOutputInvoice.nmmst || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Địa chỉ</p>
										<p className="font-medium">
											{selectedOutputInvoice.nmdchi || "N/A"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Thông tin thanh toán */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Thông tin thanh toán
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng tiền (số)
										</p>
										<p className="font-medium text-lg">
											{formatCurrency(
												Number(selectedOutputInvoice.tgtttbso) || 0,
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng thuế GTGT
										</p>
										<p className="font-medium text-lg">
											{formatCurrency(
												Number(selectedOutputInvoice.totalGTGT) || 0,
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng thuế TNCN
										</p>
										<p className="font-medium text-lg">
											{formatCurrency(
												Number(selectedOutputInvoice.totalTNCN) || 0,
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng tiền (chữ)
										</p>
										<p className="font-medium">
											{selectedOutputInvoice.tgtttbchu || "N/A"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Hình thức thanh toán
										</p>
										<p className="font-medium">
											{selectedOutputInvoice.hthdon || "N/A"}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Danh sách hàng hóa/dịch vụ */}
							{selectedOutputInvoice.hdhhdvu &&
								selectedOutputInvoice.hdhhdvu.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Danh sách hàng hóa/dịch vụ
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>STT</TableHead>
														<TableHead>Tên hàng hóa/dịch vụ</TableHead>
														<TableHead>Đơn vị tính</TableHead>
														<TableHead className="text-right">
															Số lượng
														</TableHead>
														<TableHead className="text-right">
															Đơn giá
														</TableHead>
														<TableHead className="text-right">
															Thành tiền
														</TableHead>
														<TableHead className="text-right">
															Thuế GTGT
														</TableHead>
														<TableHead className="text-right">
															Thuế TNCN
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{selectedOutputInvoice.hdhhdvu.map(
														(item: any, index: number) => (
															<TableRow key={index}>
																<TableCell>{item.stt || index + 1}</TableCell>
																<TableCell className="max-w-[300px]">
																	{item.ten || "N/A"}
																</TableCell>
																<TableCell>{item.dvtinh || "N/A"}</TableCell>
																<TableCell className="text-right">
																	{item.sluong?.toLocaleString("vi-VN") || "0"}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(Number(item.dgia) || 0)}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(Number(item.thtien) || 0)}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(Number(item.gtgt) || 0)}
																</TableCell>
																<TableCell className="text-right">
																	{formatCurrency(Number(item.tncn) || 0)}
																</TableCell>
															</TableRow>
														),
													)}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								)}

							{/* Ghi chú */}
							{selectedOutputInvoice.gchu && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Ghi chú</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm">{selectedOutputInvoice.gchu}</p>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
