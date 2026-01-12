import { useState } from "react";
import { Package, Search, Download, AlertTriangle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { products, businesses, formatCurrency } from "@/data/mockData";

export default function Inventory() {
	const [searchTerm, setSearchTerm] = useState("");
	const [businessFilter, setBusinessFilter] = useState("all");

	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.sku.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesBusiness =
			businessFilter === "all" || product.businessId === businessFilter;
		return matchesSearch && matchesBusiness;
	});

	const inventoryProducts = filteredProducts.filter(
		(p) => p.category !== "Sản xuất"
	);
	const productionProducts = filteredProducts.filter(
		(p) => p.category === "Sản xuất"
	);

	const totalValue = inventoryProducts.reduce(
		(acc, p) => acc + p.quantity * p.unitPrice,
		0
	);
	const lowStockCount = inventoryProducts.filter(
		(p) => p.quantity > 0 && p.quantity < 50
	).length;

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Kho hàng</h1>
					<p className="mt-1 text-muted-foreground">
						Quản lý sản phẩm và nguyên liệu
					</p>
				</div>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Xuất Excel
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Package className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
								<p className="text-xl font-bold">{inventoryProducts.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
								<Package className="h-5 w-5 text-success" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Giá trị tồn kho</p>
								<p className="text-xl font-bold">
									{formatCurrency(totalValue)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent className="p-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
								<AlertTriangle className="h-5 w-5 text-warning" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Sắp hết hàng</p>
								<p className="text-xl font-bold">{lowStockCount}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Tìm theo tên hoặc mã SP..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={businessFilter} onValueChange={setBusinessFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Hộ kinh doanh" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả hộ KD</SelectItem>
								{businesses.map((b) => (
									<SelectItem key={b.id} value={b.id}>
										{b.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Product Table */}
			<Tabs defaultValue="inventory" className="space-y-4">
				<TabsList>
					<TabsTrigger value="inventory">Tồn kho</TabsTrigger>
					<TabsTrigger value="production">Sản xuất</TabsTrigger>
				</TabsList>

				{/* Inventory Tab */}
				<TabsContent value="inventory">
					<Card>
						<CardHeader>
							<CardTitle>Danh sách sản phẩm tồn kho</CardTitle>
							<CardDescription>
								Sản phẩm có sẵn trong kho của các hộ kinh doanh
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Mã SP</TableHead>
										<TableHead>Tên sản phẩm</TableHead>
										<TableHead>Hộ KD</TableHead>
										<TableHead>Tính chất</TableHead>
										<TableHead className="text-right">Tồn kho</TableHead>
										<TableHead className="text-right">Đơn giá</TableHead>
										<TableHead className="text-right">Giá trị</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{inventoryProducts.map((product) => (
										<TableRow key={product.id} className="data-table-row">
											<TableCell className="font-medium">
												{product.sku}
											</TableCell>
											<TableCell>{product.name}</TableCell>
											<TableCell>
												{
													businesses.find((b) => b.id === product.businessId)
														?.name
												}
											</TableCell>
											<TableCell>
												<Badge variant="outline">{product.category}</Badge>
											</TableCell>
											<TableCell className="text-right">
												<span
													className={
														product.quantity < 50
															? "text-warning font-medium"
															: ""
													}
												>
													{product.quantity} {product.unit}
												</span>
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(product.unitPrice)}
											</TableCell>
											<TableCell className="text-right font-medium">
												{formatCurrency(product.quantity * product.unitPrice)}
											</TableCell>
										</TableRow>
									))}
									{inventoryProducts.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												className="text-center text-muted-foreground py-8"
											>
												Không tìm thấy sản phẩm tồn kho
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Production Tab */}
				<TabsContent value="production">
					<Card>
						<CardHeader>
							<CardTitle>Danh sách sản phẩm sản xuất</CardTitle>
							<CardDescription>
								Sản phẩm được sản xuất theo đơn hàng
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Mã SP</TableHead>
										<TableHead>Tên sản phẩm</TableHead>
										<TableHead>Hộ KD</TableHead>
										<TableHead>Tính chất</TableHead>
										<TableHead>Đơn vị</TableHead>
										<TableHead className="text-right">Đơn giá</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{productionProducts.map((product) => (
										<TableRow key={product.id} className="data-table-row">
											<TableCell className="font-medium">
												{product.sku}
											</TableCell>
											<TableCell>{product.name}</TableCell>
											<TableCell>
												{
													businesses.find((b) => b.id === product.businessId)
														?.name
												}
											</TableCell>
											<TableCell>
												<Badge variant="outline">{product.category}</Badge>
											</TableCell>
											<TableCell>{product.unit}</TableCell>
											<TableCell className="text-right">
												{formatCurrency(product.unitPrice)}
											</TableCell>
										</TableRow>
									))}
									{productionProducts.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center text-muted-foreground py-8"
											>
												Không tìm thấy sản phẩm sản xuất
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
