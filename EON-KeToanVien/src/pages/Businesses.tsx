import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Building2,
	Search,
	Filter,
	Clock,
	MoreVertical,
	Plus,
	RefreshCw,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { businesses, formatCurrency, formatDateTime } from "@/data/mockData";

export default function Businesses() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredBusinesses = businesses.filter((business) => {
		const matchesSearch =
			business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			business.taxCode.includes(searchTerm);
		const matchesStatus =
			statusFilter === "all" || business.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Tìm theo tên hoặc mã số thuế..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Business List */}
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{filteredBusinesses.map((business) => (
					<Card
						key={business.id}
						className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
						onClick={() => navigate(`/businesses/${business.id}`)}
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Building2 className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-base">{business.name}</CardTitle>
										<CardDescription>MST: {business.taxCode}</CardDescription>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger
										asChild
										onClick={(e) => e.stopPropagation()}
									>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>
											<RefreshCw className="mr-2 h-4 w-4" />
											Đồng bộ dữ liệu
										</DropdownMenuItem>
										<DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
										<DropdownMenuItem className="text-destructive">
											Hủy liên kết
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">Chủ hộ</p>
									<p className="font-medium">{business.ownerName}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Loại hình</p>
									<p className="font-medium">{business.businessType}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Doanh thu</p>
									<p className="font-medium text-success">
										{formatCurrency(business.revenue)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Nhân viên</p>
									<p className="font-medium">{business.employeeCount} người</p>
								</div>
							</div>

							<div className="flex items-center justify-between border-t border-border pt-3">
								<span className="flex items-center text-xs text-muted-foreground">
									<Clock className="mr-1 h-3 w-3" />
									{formatDateTime(business.lastSyncAt)}
								</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredBusinesses.length === 0 && (
				<Card className="py-12">
					<CardContent className="text-center">
						<Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
						<h3 className="mt-4 text-lg font-medium">
							Không tìm thấy hộ kinh doanh
						</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
