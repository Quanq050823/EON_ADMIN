import { useState } from 'react';
import { Calculator, Search, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { taxRecords, businesses, formatCurrency, formatDate } from '@/data/mockData';

export default function Taxes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTaxes = taxRecords.filter((tax) => {
    const matchesSearch =
      tax.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBusiness = businessFilter === 'all' || tax.businessId === businessFilter;
    const matchesStatus = statusFilter === 'all' || tax.status === statusFilter;
    return matchesSearch && matchesBusiness && matchesStatus;
  });

  const paidTotal = filteredTaxes.filter((t) => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0);
  const pendingTotal = filteredTaxes.filter((t) => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0);
  const overdueTotal = filteredTaxes.filter((t) => t.status === 'overdue').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thuế</h1>
          <p className="mt-1 text-muted-foreground">Theo dõi tình trạng kê khai và nộp thuế</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã nộp</p>
                <p className="text-xl font-bold text-success">{formatCurrency(paidTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chờ nộp</p>
                <p className="text-xl font-bold text-warning">{formatCurrency(pendingTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quá hạn</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(overdueTotal)}</p>
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
                placeholder="Tìm theo loại thuế hoặc kỳ..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã nộp</SelectItem>
                <SelectItem value="pending">Chờ nộp</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tax Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử nộp thuế</CardTitle>
          <CardDescription>Tình trạng kê khai và nộp thuế của các hộ kinh doanh</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại thuế</TableHead>
                <TableHead>Hộ KD</TableHead>
                <TableHead>Kỳ</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxes.map((tax) => (
                <TableRow key={tax.id} className="data-table-row">
                  <TableCell className="font-medium">{tax.type}</TableCell>
                  <TableCell>{businesses.find((b) => b.id === tax.businessId)?.name}</TableCell>
                  <TableCell>{tax.period}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(tax.amount)}</TableCell>
                  <TableCell>{formatDate(tax.dueDate)}</TableCell>
                  <TableCell>{tax.paidDate ? formatDate(tax.paidDate) : '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tax.status === 'paid'
                          ? 'badge-success'
                          : tax.status === 'pending'
                          ? 'badge-warning'
                          : 'badge-destructive'
                      }
                    >
                      {tax.status === 'paid' ? 'Đã nộp' : tax.status === 'pending' ? 'Chờ nộp' : 'Quá hạn'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
