import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Building2,
	TrendingUp,
	TrendingDown,
	FileText,
	Package,
	Users,
	Calculator,
	RefreshCw,
	Phone,
	Mail,
	MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
	businesses,
	invoices,
	products,
	employees,
	taxRecords,
	expenses,
	formatCurrency,
	formatDate,
	formatDateTime,
} from "@/data/mockData";

export default function BusinessDetail() {
	const { id } = useParams();
	const navigate = useNavigate();

	const business = businesses.find((b) => b.id === id);
	const businessInvoices = invoices.filter((i) => i.businessId === id);
	const businessProducts = products.filter((p) => p.businessId === id);
	const businessEmployees = employees.filter((e) => e.businessId === id);
	const businessTaxes = taxRecords.filter((t) => t.businessId === id);
	const businessExpenses = expenses.filter((e) => e.businessId === id);

	if (!business) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<h2 className="text-xl font-medium">Không tìm thấy hộ kinh doanh</h2>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => navigate("/businesses")}
				>
					Quay lại danh sách
				</Button>
			</div>
		);
	}

	const profit = business.revenue - business.expense;

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/businesses")}
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<Building2 className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">{business.name}</h1>
							<p className="text-muted-foreground">MST: {business.taxCode}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Business Info & Stats */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Info Card */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Thông tin cơ bản</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3 text-sm">
							<div className="flex items-start gap-3">
								<Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground">Chủ hộ</p>
									<p className="font-medium">{business.ownerName}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground">Địa chỉ</p>
									<p className="font-medium">{business.address}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground">Điện thoại</p>
									<p className="font-medium">{business.phone}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground">Email</p>
									<p className="font-medium">{business.email}</p>
								</div>
							</div>
						</div>
						<div className="border-t border-border pt-3 text-xs text-muted-foreground">
							Đồng bộ lần cuối: {formatDateTime(business.lastSyncAt)}
						</div>
					</CardContent>
				</Card>

				{/* Stats Cards */}
				<div className="space-y-4 lg:col-span-2">
					<div className="grid gap-4 sm:grid-cols-2">
						<Card className="stat-card">
							<CardContent className="p-0">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
										<TrendingUp className="h-5 w-5 text-success" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Doanh thu</p>
										<p className="text-lg font-bold text-success">
											{formatCurrency(business.revenue)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card className="stat-card">
							<CardContent className="p-0">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
										<TrendingDown className="h-5 w-5 text-warning" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Chi phí</p>
										<p className="text-lg font-bold text-warning">
											{formatCurrency(business.expense)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="invoices" className="space-y-4">
				{/* Invoices Tab */}
				<TabsContent value="invoices">
					<Tabs defaultValue="output" className="space-y-4">
						<TabsList>
							<TabsTrigger value="output">Hóa đơn đầu ra</TabsTrigger>
							<TabsTrigger value="input">Hóa đơn đầu vào</TabsTrigger>
						</TabsList>

						{/* Output Invoices */}
						<TabsContent value="output">
							<Card>
								<CardHeader>
									<CardTitle>Hóa đơn đầu ra</CardTitle>
									<CardDescription>
										Danh sách hóa đơn bán hàng/dịch vụ
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Số HĐ</TableHead>
												<TableHead>Đối tác</TableHead>
												<TableHead className="text-right">Thành tiền</TableHead>
												<TableHead>Ngày</TableHead>
												<TableHead>Trạng thái</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{businessInvoices
												.filter((invoice) => invoice.type === "output")
												.map((invoice) => (
													<TableRow key={invoice.id} className="data-table-row">
														<TableCell className="font-medium">
															{invoice.invoiceNumber}
														</TableCell>
														<TableCell>{invoice.partnerName}</TableCell>
														<TableCell className="text-right">
															{formatCurrency(invoice.total)}
														</TableCell>
														<TableCell>{formatDate(invoice.date)}</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className={
																	invoice.status === "paid"
																		? "badge-success"
																		: invoice.status === "overdue"
																		? "badge-warning"
																		: "badge-destructive"
																}
															>
																{invoice.status === "paid"
																	? "Đã TT"
																	: invoice.status === "overdue"
																	? "Chờ TT"
																	: "Quá hạn"}
															</Badge>
														</TableCell>
													</TableRow>
												))}
											{businessInvoices.filter((i) => i.type === "output")
												.length === 0 && (
												<TableRow>
													<TableCell
														colSpan={5}
														className="text-center text-muted-foreground py-8"
													>
														Chưa có hóa đơn đầu ra
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Input Invoices */}
						<TabsContent value="input">
							<Card>
								<CardHeader>
									<CardTitle>Hóa đơn đầu vào</CardTitle>
									<CardDescription>
										Danh sách hóa đơn mua hàng/dịch vụ
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Số HĐ</TableHead>
												<TableHead>Đối tác</TableHead>
												<TableHead className="text-right">Thành tiền</TableHead>
												<TableHead>Ngày</TableHead>
												<TableHead>Trạng thái</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{businessInvoices
												.filter((invoice) => invoice.type === "input")
												.map((invoice) => (
													<TableRow key={invoice.id} className="data-table-row">
														<TableCell className="font-medium">
															{invoice.invoiceNumber}
														</TableCell>
														<TableCell>{invoice.partnerName}</TableCell>
														<TableCell className="text-right">
															{formatCurrency(invoice.total)}
														</TableCell>
														<TableCell>{formatDate(invoice.date)}</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className={
																	invoice.status === "paid"
																		? "badge-success"
																		: invoice.status === "overdue"
																		? "badge-warning"
																		: "badge-destructive"
																}
															>
																{invoice.status === "paid"
																	? "Đã TT"
																	: invoice.status === "overdue"
																	? "Chờ TT"
																	: "Quá hạn"}
															</Badge>
														</TableCell>
													</TableRow>
												))}
											{businessInvoices.filter((i) => i.type === "input")
												.length === 0 && (
												<TableRow>
													<TableCell
														colSpan={5}
														className="text-center text-muted-foreground py-8"
													>
														Chưa có hóa đơn đầu vào
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</TabsContent>{" "}
				{/* Inventory Tab */}
			</Tabs>
		</div>
	);
}
