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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { adminApi, type AdminBusinessOwner } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
	Building2,
	ChevronLeft,
	ChevronRight,
	Eye,
	MoreVertical,
	RefreshCw,
	Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminBusinessOwners() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const {
		data: businessOwnersData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["admin-business-owners", currentPage, itemsPerPage],
		queryFn: () =>
			adminApi.getAllBusinessOwners({
				page: currentPage,
				limit: itemsPerPage,
				sortBy: "createdAt",
				sortOrder: -1,
			}),
	});

	const businessOwners = businessOwnersData?.data || [];
	const pagination = businessOwnersData?.pagination;

	// Filter by search term (client-side filtering)
	const filteredBusinessOwners = businessOwners.filter((owner) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			owner.businessName.toLowerCase().includes(searchLower) ||
			owner.taxCode?.toLowerCase().includes(searchLower) ||
			owner.userId?.name.toLowerCase().includes(searchLower) ||
			owner.userId?.email.toLowerCase().includes(searchLower) ||
			owner.phoneNumber.includes(searchTerm)
		);
	});

	const handleRefresh = () => {
		refetch();
		toast.success("Đã làm mới dữ liệu");
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

	const formatDate = (dateString?: string) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("vi-VN");
	};

	const formatAddress = (address?: AdminBusinessOwner["address"]): string => {
		if (!address) return "N/A";
		const parts = [
			address.street,
			address.ward,
			address.district,
			address.city,
		].filter(Boolean);
		return parts.join(", ");
	};

	if (error) {
		return (
			<div className="space-y-6 animate-fade-in">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Quản lý Hộ kinh doanh
						</h1>
						<p className="text-muted-foreground">
							Danh sách tất cả hộ kinh doanh trong hệ thống
						</p>
					</div>
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="text-center text-red-500">
							Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
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
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Quản lý Hộ kinh doanh
					</h1>
					<p className="text-muted-foreground">
						Danh sách tất cả hộ kinh doanh trong hệ thống
					</p>
				</div>
				<Button onClick={handleRefresh} variant="outline" className="gap-2">
					<RefreshCw className="h-4 w-4" />
					Làm mới
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Tổng số hộ
								</p>
								<p className="mt-1 text-2xl font-bold">
									{pagination?.total || 0}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Building2 className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Đang hoạt động
								</p>
								<p className="mt-1 text-2xl font-bold text-green-600">
									{
										businessOwners.filter((b) => b.businessStatus === "active")
											.length
									}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
								<Building2 className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Tạm ngưng
								</p>
								<p className="mt-1 text-2xl font-bold text-red-600">
									{
										businessOwners.filter(
											(b) => b.businessStatus === "suspended",
										).length
									}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
								<Building2 className="h-6 w-6 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Ngưng hoạt động
								</p>
								<p className="mt-1 text-2xl font-bold text-gray-600">
									{
										businessOwners.filter(
											(b) => b.businessStatus === "inactive",
										).length
									}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500/10">
								<Building2 className="h-6 w-6 text-gray-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Tìm theo tên, mã số thuế, chủ hộ, email, SĐT..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="p-8 text-center">
							<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
							<p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
						</div>
					) : filteredBusinessOwners.length === 0 ? (
						<div className="p-8 text-center text-muted-foreground">
							Không tìm thấy hộ kinh doanh nào
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên hộ kinh doanh</TableHead>
										<TableHead>Chủ hộ</TableHead>
										<TableHead>Mã số thuế</TableHead>
										<TableHead>Số điện thoại</TableHead>
										<TableHead>Ngành nghề</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Ngày tạo</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredBusinessOwners.map((owner) => (
										<TableRow key={owner._id}>
											<TableCell className="font-medium">
												<div
													className="flex items-center gap-2 hover:underline cursor-pointer hover:text-primary"
													onClick={() =>
														navigate(`/admin/business-owners/${owner._id}`)
													}
												>
													<Building2 className="h-4 w-4 text-muted-foreground" />
													{owner.businessName}
												</div>
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">
														{owner.userId?.name || "N/A"}
													</div>
													<div className="text-sm text-muted-foreground">
														{owner.userId?.email || "N/A"}
													</div>
												</div>
											</TableCell>
											<TableCell>
												{owner.taxCode || (
													<span className="text-muted-foreground">Chưa có</span>
												)}
											</TableCell>
											<TableCell>{owner.phoneNumber}</TableCell>
											<TableCell>{owner.industry || "N/A"}</TableCell>
											<TableCell>
												{getStatusBadge(owner.businessStatus)}
											</TableCell>
											<TableCell>{formatDate(owner.createdAt)}</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreVertical className="h-4 w-4" />
															<span className="sr-only">Mở menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																navigate(`/admin/business-owners/${owner._id}`)
															}
														>
															<Eye className="mr-2 h-4 w-4" />
															Xem chi tiết
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="text-red-600">
															Tạm ngưng
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Pagination */}
							{pagination && pagination.pages > 1 && (
								<div className="flex items-center justify-between border-t px-6 py-4">
									<div className="text-sm text-muted-foreground">
										Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
										{Math.min(currentPage * itemsPerPage, pagination.total)}{" "}
										trong tổng số {pagination.total} kết quả
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
											{Array.from({ length: pagination.pages }, (_, i) => i + 1)
												.filter(
													(page) =>
														page === 1 ||
														page === pagination.pages ||
														Math.abs(page - currentPage) <= 1,
												)
												.map((page, index, array) => (
													<>
														{index > 0 && array[index - 1] !== page - 1 && (
															<span className="px-2">...</span>
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
											disabled={currentPage === pagination.pages}
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
		</div>
	);
}
