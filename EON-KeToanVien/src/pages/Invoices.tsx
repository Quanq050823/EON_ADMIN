import { useState } from "react";
import { FileText, Search, Filter, Download } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	invoices,
	businesses,
	formatCurrency,
	formatDate,
} from "@/data/mockData";

export default function Invoices() {
	const [searchTerm, setSearchTerm] = useState("");
	const [businessFilter, setBusinessFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredInvoices = invoices.filter((invoice) => {
		const matchesSearch =
			invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesBusiness =
			businessFilter === "all" || invoice.businessId === businessFilter;
		const matchesStatus =
			statusFilter === "all" || invoice.status === statusFilter;
		return matchesSearch && matchesBusiness && matchesStatus;
	});

	const inputInvoices = filteredInvoices.filter((i) => i.type === "input");
	const outputInvoices = filteredInvoices.filter((i) => i.type === "output");

	const InvoiceTable = ({ data }: { data: typeof invoices }) => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Số HĐ</TableHead>
					<TableHead>Hộ KD</TableHead>
					<TableHead>Khách hàng</TableHead>
					<TableHead className="text-right">Tiền hàng</TableHead>
					<TableHead className="text-right">Thuế</TableHead>
					<TableHead className="text-right">Thành tiền</TableHead>
					<TableHead>Ngày</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((invoice) => (
					<TableRow key={invoice.id} className="data-table-row cursor-pointer">
						<TableCell className="font-medium">
							{invoice.invoiceNumber}
						</TableCell>
						<TableCell>
							{businesses.find((b) => b.id === invoice.businessId)?.name}
						</TableCell>
						<TableCell>{invoice.partnerName}</TableCell>
						<TableCell className="text-right">
							{formatCurrency(invoice.amount)}
						</TableCell>
						<TableCell className="text-right">
							{formatCurrency(invoice.tax)}
						</TableCell>
						<TableCell className="text-right font-medium">
							{formatCurrency(invoice.total)}
						</TableCell>
						<TableCell>{formatDate(invoice.date)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Hóa đơn</h1>
					<p className="mt-1 text-muted-foreground">
						Quản lý hóa đơn đầu vào và đầu ra
					</p>
				</div>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Xuất Excel
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Tìm theo số HĐ hoặc đối tác..."
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

			{/* Invoice Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">
						Tất cả ({filteredInvoices.length})
					</TabsTrigger>
					<TabsTrigger value="output">
						Đầu ra ({outputInvoices.length})
					</TabsTrigger>
					<TabsTrigger value="input">
						Đầu vào ({inputInvoices.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>Tất cả hóa đơn</CardTitle>
							<CardDescription>
								Danh sách tất cả hóa đơn của các hộ kinh doanh
							</CardDescription>
						</CardHeader>
						<CardContent>
							<InvoiceTable data={filteredInvoices} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="output">
					<Card>
						<CardHeader>
							<CardTitle>Hóa đơn đầu ra</CardTitle>
							<CardDescription>Hóa đơn bán hàng / dịch vụ</CardDescription>
						</CardHeader>
						<CardContent>
							<InvoiceTable data={outputInvoices} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="input">
					<Card>
						<CardHeader>
							<CardTitle>Hóa đơn đầu vào</CardTitle>
							<CardDescription>Hóa đơn mua hàng / dịch vụ</CardDescription>
						</CardHeader>
						<CardContent>
							<InvoiceTable data={inputInvoices} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
