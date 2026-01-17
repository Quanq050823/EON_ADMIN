import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { businesses, formatCurrency, formatDateTime } from "@/data/mockData";
import {
	ArrowUpDown,
	Building2,
	ChevronLeft,
	ChevronRight,
	Edit,
	Eye,
	MoreVertical,
	Plus,
	RefreshCw,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SortField = "name" | "revenue" | "employeeCount" | "lastSyncAt";
type SortDirection = "asc" | "desc";

export default function Businesses() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortField, setSortField] = useState<SortField>("lastSyncAt");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const filteredBusinesses = businesses.filter((business) => {
		const matchesSearch =
			business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			business.taxCode.includes(searchTerm) ||
			business.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || business.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
		let aValue = a[sortField];
		let bValue = b[sortField];

		if (sortField === "lastSyncAt") {
			aValue = new Date(aValue as string).getTime();
			bValue = new Date(bValue as string).getTime();
		}

		if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
		if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage);
	const paginatedBusinesses = sortedBusinesses.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			active:
				"bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20",
			pending:
				"bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20",
			inactive:
				"bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20",
		};
		const labels = {
			active: "Hoạt động",
			pending: "Chờ duyệt",
			inactive: "Ngưng hoạt động",
		};
		return (
			<Badge
				className={variants[status as keyof typeof variants]}
				variant="secondary"
			>
				{labels[status as keyof typeof labels]}
			</Badge>
		);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Hộ kinh doanh</h1>
					<p className="text-muted-foreground">
						Quản lý và theo dõi các hộ kinh doanh
					</p>
				</div>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Thêm hộ kinh doanh
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Tìm theo tên, mã số thuế, chủ hộ..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Trạng thái" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả</SelectItem>
								<SelectItem value="active">Hoạt động</SelectItem>
								<SelectItem value="pending">Chờ duyệt</SelectItem>
								<SelectItem value="inactive">Ngưng hoạt động</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="w-[300px]">
										<Button
											variant="ghost"
											className="h-8 px-2 font-semibold"
											onClick={() => handleSort("name")}
										>
											Hộ kinh doanh
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>Chủ hộ</TableHead>
									<TableHead>Loại hình</TableHead>
									<TableHead className="text-right">
										<Button
											variant="ghost"
											className="h-8 px-2 font-semibold"
											onClick={() => handleSort("revenue")}
										>
											Doanh thu
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead className="text-center">
										<Button
											variant="ghost"
											className="h-8 px-2 font-semibold"
											onClick={() => handleSort("employeeCount")}
										>
											Nhân viên
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead>
										<Button
											variant="ghost"
											className="h-8 px-2 font-semibold"
											onClick={() => handleSort("lastSyncAt")}
										>
											Đồng bộ
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead className="text-right">Thao tác</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedBusinesses.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-64 text-center">
											<div className="flex flex-col items-center justify-center gap-2">
												<Building2 className="h-12 w-12 text-muted-foreground/50" />
												<h3 className="text-lg font-medium">
													Không tìm thấy hộ kinh doanh
												</h3>
												<p className="text-sm text-muted-foreground">
													Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
												</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedBusinesses.map((business) => (
										<TableRow
											key={business.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() => navigate(`/businesses/${business.id}`)}
										>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
														<Building2 className="h-5 w-5 text-primary" />
													</div>
													<div className="min-w-0">
														<p className="font-medium truncate">
															{business.name}
														</p>
														<p className="text-sm text-muted-foreground">
															MST: {business.taxCode}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span className="font-medium">
														{business.ownerName}
													</span>
													<span className="text-sm text-muted-foreground">
														{business.phone}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm">{business.businessType}</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex flex-col items-end">
													<span className="font-semibold text-green-600">
														{formatCurrency(business.revenue)}
													</span>
													<span className="text-xs text-muted-foreground">
														Chi phí: {formatCurrency(business.expense)}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<span className="font-medium">
													{business.employeeCount}
												</span>
											</TableCell>
											<TableCell>{getStatusBadge(business.status)}</TableCell>
											<TableCell>
												<span className="text-sm text-muted-foreground">
													{formatDateTime(business.lastSyncAt)}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
														onClick={(e) => e.stopPropagation()}
													>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																navigate(`/businesses/${business.id}`);
															}}
														>
															<Eye className="mr-2 h-4 w-4" />
															Xem chi tiết
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={(e) => e.stopPropagation()}
														>
															<Edit className="mr-2 h-4 w-4" />
															Chỉnh sửa
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={(e) => e.stopPropagation()}
														>
															<RefreshCw className="mr-2 h-4 w-4" />
															Đồng bộ dữ liệu
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={(e) => e.stopPropagation()}
															className="text-destructive"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Xóa
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
								{Math.min(currentPage * itemsPerPage, sortedBusinesses.length)}{" "}
								trong tổng số {sortedBusinesses.length} hộ kinh doanh
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) => Math.max(1, prev - 1))
									}
									disabled={currentPage === 1}
								>
									<ChevronLeft className="h-4 w-4" />
									Trước
								</Button>
								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(page) => (
											<Button
												key={page}
												variant={currentPage === page ? "default" : "outline"}
												size="sm"
												onClick={() => setCurrentPage(page)}
												className="w-8 h-8 p-0"
											>
												{page}
											</Button>
										)
									)}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) => Math.min(totalPages, prev + 1))
									}
									disabled={currentPage === totalPages}
								>
									Sau
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
