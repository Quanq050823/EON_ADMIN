import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	invoiceApi,
	adminApi,
	type EasyInvoiceItem,
	type ViewInvoiceResponse,
} from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	Calendar,
	FileText,
	Search,
	ExternalLink,
	RefreshCw,
	Filter,
	Download,
	Eye,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

export default function AdminEasyInvoices() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Filters
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [dateFilter, setDateFilter] = useState<string>("all");

	// Invoice detail dialog
	const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
	const [selectedInvoice, setSelectedInvoice] =
		useState<EasyInvoiceItem | null>(null);
	const [invoiceDetailHtml, setInvoiceDetailHtml] = useState<string>("");
	const [loadingDetail, setLoadingDetail] = useState(false);

	const {
		data: response,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-easy-invoices", id],
		queryFn: () => adminApi.getEasyInvoicesByBusinessOwner(id!),
		enabled: !!id,
	});

	const invoices = response?.data?.Data?.Invoices || [];
	const dateRange = response?.dateRange;
	const totalRecords = response?.data?.Data?.TotalRecords || 0;

	// Load invoice detail
	const handleViewInvoice = async (invoice: EasyInvoiceItem) => {
		setSelectedInvoice(invoice);
		setShowInvoiceDetail(true);
		setLoadingDetail(true);

		try {
			const response = await adminApi.viewInvoiceByBusinessOwner(id!, {
				Ikey: invoice.Ikey,
				Pattern: invoice.Pattern,
				Option: "",
				Serial: invoice.Serial,
			});

			if (response.success && response.data.Data) {
				setInvoiceDetailHtml(response.data.Data.Html);
			}
		} catch (error) {
			console.error("Error loading invoice detail:", error);
			setInvoiceDetailHtml("<p>Không thể tải chi tiết hóa đơn</p>");
		} finally {
			setLoadingDetail(false);
		}
	};

	// Filter invoices
	const filteredInvoices = useMemo(() => {
		return invoices.filter((invoice: EasyInvoiceItem) => {
			// Search filter
			const matchesSearch =
				searchQuery === "" ||
				invoice.CustomerName.toLowerCase().includes(
					searchQuery.toLowerCase(),
				) ||
				invoice.Ikey.toLowerCase().includes(searchQuery.toLowerCase()) ||
				invoice.No.toLowerCase().includes(searchQuery.toLowerCase()) ||
				invoice.CustomerTaxCode.toLowerCase().includes(
					searchQuery.toLowerCase(),
				);

			// Status filter
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "signed" && invoice.InvoiceStatus === 1) ||
				(statusFilter === "unsigned" && invoice.InvoiceStatus === 0) ||
				(statusFilter === "cancelled" && invoice.InvoiceStatus === 2);

			// Date filter (this month, last month, etc.)
			let matchesDate = true;
			if (dateFilter !== "all") {
				const invoiceDate = parseVietnameseDate(invoice.ArisingDate);
				const now = new Date();
				const currentMonth = now.getMonth();
				const currentYear = now.getFullYear();

				if (dateFilter === "thisMonth") {
					matchesDate =
						invoiceDate.getMonth() === currentMonth &&
						invoiceDate.getFullYear() === currentYear;
				} else if (dateFilter === "lastMonth") {
					const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
					const lastMonthYear =
						currentMonth === 0 ? currentYear - 1 : currentYear;
					matchesDate =
						invoiceDate.getMonth() === lastMonth &&
						invoiceDate.getFullYear() === lastMonthYear;
				}
			}

			return matchesSearch && matchesStatus && matchesDate;
		});
	}, [invoices, searchQuery, statusFilter, dateFilter]);

	// Calculate statistics
	const statistics = useMemo(() => {
		const signed = invoices.filter(
			(inv: EasyInvoiceItem) => inv.InvoiceStatus === 1,
		).length;
		const unsigned = invoices.filter(
			(inv: EasyInvoiceItem) => inv.InvoiceStatus === 0,
		).length;
		const totalAmount = invoices.reduce(
			(sum: number, inv: EasyInvoiceItem) => sum + inv.Amount,
			0,
		);
		const totalTax = invoices.reduce(
			(sum: number, inv: EasyInvoiceItem) => sum + inv.TaxAmount,
			0,
		);

		return {
			signed,
			unsigned,
			totalAmount,
			totalTax,
		};
	}, [invoices]);

	const parseVietnameseDate = (dateStr: string): Date => {
		const [day, month, year] = dateStr.split("/").map(Number);
		return new Date(year, month - 1, day);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const getInvoiceStatusBadge = (status: number) => {
		switch (status) {
			case 1:
				return (
					<Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
						Đã ký
					</Badge>
				);
			case 0:
				return (
					<Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
						Chưa ký
					</Badge>
				);
			case 2:
				return (
					<Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">
						Đã hủy
					</Badge>
				);
			default:
				return <Badge variant="secondary">N/A</Badge>;
		}
	};

	const getTCTStatusBadge = (status: string) => {
		if (status.includes("Đang kiểm tra")) {
			return (
				<Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">
					{status}
				</Badge>
			);
		} else if (status.includes("Chưa gửi")) {
			return (
				<Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20">
					{status}
				</Badge>
			);
		} else if (status.includes("Đã gửi")) {
			return (
				<Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
					{status}
				</Badge>
			);
		}
		return <Badge variant="secondary">{status}</Badge>;
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
							Quản lý Hóa đơn EasyInvoice
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

	if (error) {
		return (
			<div className="space-y-6 animate-fade-in">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Quản lý Hóa đơn EasyInvoice
						</h1>
					</div>
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="text-center text-red-500">
							Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.
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
							Quản lý Hóa đơn EasyInvoice
						</h1>
						<p className="text-muted-foreground">
							{dateRange && (
								<>
									Từ ngày {dateRange.FromDate} đến {dateRange.ToDate}
								</>
							)}
						</p>
					</div>
				</div>
				<Button onClick={() => refetch()} variant="outline" size="sm">
					<RefreshCw className="h-4 w-4 mr-2" />
					Làm mới
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalRecords}</div>
						<p className="text-xs text-muted-foreground">
							{filteredInvoices.length} hóa đơn hiển thị
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đã ký</CardTitle>
						<FileText className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{statistics.signed}
						</div>
						<p className="text-xs text-muted-foreground">
							{((statistics.signed / totalRecords) * 100).toFixed(1)}% tổng số
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(statistics.totalAmount)}
						</div>
						<p className="text-xs text-muted-foreground">
							Thuế: {formatCurrency(statistics.totalTax)}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Chưa ký</CardTitle>
						<FileText className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{statistics.unsigned}
						</div>
						<p className="text-xs text-muted-foreground">
							{((statistics.unsigned / totalRecords) * 100).toFixed(1)}% tổng số
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Bộ lọc
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Tìm kiếm theo tên KH, số HĐ, MST..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full md:w-[200px]">
								<SelectValue placeholder="Trạng thái" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả trạng thái</SelectItem>
								<SelectItem value="signed">Đã ký</SelectItem>
								<SelectItem value="unsigned">Chưa ký</SelectItem>
								<SelectItem value="cancelled">Đã hủy</SelectItem>
							</SelectContent>
						</Select>

						<Select value={dateFilter} onValueChange={setDateFilter}>
							<SelectTrigger className="w-full md:w-[200px]">
								<SelectValue placeholder="Thời gian" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả thời gian</SelectItem>
								<SelectItem value="thisMonth">Tháng này</SelectItem>
								<SelectItem value="lastMonth">Tháng trước</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Invoice Table */}
			<Card>
				<CardHeader>
					<CardTitle>Danh sách hóa đơn ({filteredInvoices.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Số HĐ</TableHead>
									<TableHead>Mẫu số</TableHead>
									<TableHead>Ngày lập</TableHead>
									<TableHead>Khách hàng</TableHead>
									<TableHead>MST</TableHead>
									<TableHead className="text-right">Tiền trước thuế</TableHead>
									<TableHead className="text-right">Thuế</TableHead>
									<TableHead className="text-right">Tổng tiền</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead>Tình trạng TCT</TableHead>
									<TableHead className="text-center w-[120px]">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredInvoices.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={11}
											className="text-center text-muted-foreground py-8"
										>
											Không có dữ liệu
										</TableCell>
									</TableRow>
								) : (
									filteredInvoices.map((invoice: EasyInvoiceItem) => (
										<TableRow key={invoice.Ikey}>
											<TableCell className="font-medium">
												{invoice.No || "0"}
											</TableCell>
											<TableCell>{invoice.Pattern}</TableCell>
											<TableCell>{invoice.ArisingDate}</TableCell>
											<TableCell>
												<div className="max-w-[200px] truncate">
													{invoice.CustomerName}
												</div>
											</TableCell>
											<TableCell>{invoice.CustomerTaxCode}</TableCell>
											<TableCell className="text-right">
												{formatCurrency(invoice.Total)}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(invoice.TaxAmount)}
											</TableCell>
											<TableCell className="text-right font-semibold">
												{formatCurrency(invoice.Amount)}
											</TableCell>
											<TableCell>
												{getInvoiceStatusBadge(invoice.InvoiceStatus)}
											</TableCell>
											<TableCell>
												{getTCTStatusBadge(invoice.TCTCheckStatus)}
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-center gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleViewInvoice(invoice)}
														title="Xem chi tiết"
													>
														<Eye className="h-4 w-4" />
													</Button>
													{/* {invoice.LinkView &&
														invoice.LinkView !==
															"http://075094013025hd.softdreams.vn" && (
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	window.open(invoice.LinkView, "_blank")
																}
																title="Mở link"
															>
																<ExternalLink className="h-4 w-4" />
															</Button>
														)} */}
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Invoice Detail Dialog */}
			<Dialog open={showInvoiceDetail} onOpenChange={setShowInvoiceDetail}>
				<DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>
							Chi tiết hóa đơn {selectedInvoice?.Pattern} - Số{" "}
							{selectedInvoice?.No}
						</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
						{loadingDetail ? (
							<div className="flex items-center justify-center py-12">
								<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
								<p className="ml-4 text-muted-foreground">
									Đang tầi chi tiết hóa đơn...
								</p>
							</div>
						) : (
							<div
								dangerouslySetInnerHTML={{ __html: invoiceDetailHtml }}
								className="invoice-detail-content"
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
