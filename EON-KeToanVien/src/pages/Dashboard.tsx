import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { alerts, businesses, formatCurrency } from "@/data/mockData";
import {
	AlertTriangle,
	Building2,
	Receipt,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const revenueData = [
	{ month: "T8", revenue: 280, expense: 200 },
	{ month: "T9", revenue: 350, expense: 250 },
	{ month: "T10", revenue: 420, expense: 310 },
	{ month: "T11", revenue: 380, expense: 290 },
	{ month: "T12", revenue: 450, expense: 320 },
	{ month: "T1", revenue: 520, expense: 380 },
];

const businessTypeData = [
	{ name: "Phân phối, cung cấp hàng hóa", value: 40 },
	{ name: "Dịch vụ", value: 30 },
	{ name: "Sản xuất", value: 20 },
	{ name: "Kinh doanh khác", value: 10 },
];

const COLORS = [
	"hsl(217, 91%, 40%)",
	"hsl(142, 76%, 36%)",
	"hsl(38, 92%, 50%)",
	"hsl(280, 65%, 60%)",
];

export default function Dashboard() {
	const navigate = useNavigate();
	const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
		businesses[0]?.id || ""
	);

	const filteredBusinesses = businesses.filter(
		(b) => b.id === selectedBusinessId
	);

	const totalRevenue = filteredBusinesses.reduce(
		(acc, b) => acc + b.revenue,
		0
	);
	const totalExpense = filteredBusinesses.reduce(
		(acc, b) => acc + b.expense,
		0
	);
	const totalProfit = totalRevenue - totalExpense;

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Page Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>
					<p className="mt-1 text-muted-foreground">
						Xin chào! Đây là tổng quan dữ liệu của các hộ kinh doanh bạn đang
						quản lý.
					</p>
				</div>
				<div className="w-[280px]">
					<Select
						value={selectedBusinessId}
						onValueChange={setSelectedBusinessId}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn hộ kinh doanh" />
						</SelectTrigger>
						<SelectContent>
							{businesses.map((business) => (
								<SelectItem key={business.id} value={business.id}>
									{business.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									{selectedBusinessId === "all"
										? "Tổng hộ kinh doanh"
										: "Số nhân viên"}
								</p>
								<p className="mt-1 text-2xl font-bold">
									{selectedBusinessId === "all"
										? businesses.length
										: filteredBusinesses[0]?.employeeCount || 0}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Building2 className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Tổng doanh thu
								</p>
								<p className="mt-1 text-2xl font-bold">
									{formatCurrency(totalRevenue)}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
								<TrendingUp className="h-6 w-6 text-success" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Tổng chi phí
								</p>
								<p className="mt-1 text-2xl font-bold">
									{formatCurrency(totalExpense)}
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
								<Receipt className="h-6 w-6 text-warning" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts & Alerts */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Revenue Chart */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Doanh thu & Chi phí</CardTitle>
						<CardDescription>
							6 tháng gần nhất (triệu VNĐ) - {filteredBusinesses[0]?.name}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={280}>
							<BarChart data={revenueData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="hsl(var(--border))"
								/>
								<XAxis
									dataKey="month"
									stroke="hsl(var(--muted-foreground))"
									fontSize={12}
								/>
								<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Bar
									dataKey="revenue"
									name="Doanh thu"
									fill="hsl(var(--chart-1))"
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="expense"
									name="Chi phí"
									fill="hsl(var(--chart-3))"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Alerts */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-warning" />
							Cảnh báo
						</CardTitle>
						<CardDescription>Các vấn đề cần chú ý</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{alerts
							.filter((alert) => alert.businessId === selectedBusinessId)
							.map((alert) => (
								<div
									key={alert.id}
									className={`rounded-lg border p-3 ${
										alert.severity === "error"
											? "border-destructive/30 bg-destructive/5"
											: alert.severity === "warning"
											? "border-warning/30 bg-warning/5"
											: "border-info/30 bg-info/5"
									}`}
								>
									<p className="text-sm font-medium">{alert.message}</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{businesses.find((b) => b.id === alert.businessId)?.name}
									</p>
								</div>
							))}
						{alerts.filter((alert) => alert.businessId === selectedBusinessId)
							.length === 0 && (
							<p className="text-sm text-muted-foreground text-center py-4">
								Không có cảnh báo
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Business List & Distribution */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Business Type Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Phân loại hóa đơn bán ra</CardTitle>
						<CardDescription>Theo loại hình kinh doanh</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={200}>
							<PieChart>
								<Pie
									data={businessTypeData}
									cx="50%"
									cy="50%"
									innerRadius={50}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
								>
									{businessTypeData.map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{businessTypeData.map((item, index) => (
								<div
									key={item.name}
									className="flex items-center justify-between text-sm"
								>
									<div className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: COLORS[index] }}
										/>
										<span>{item.name}</span>
									</div>
									<span className="font-medium">{item.value}%</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
