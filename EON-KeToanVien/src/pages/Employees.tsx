import { useState } from 'react';
import { Users, Search, Download, UserCheck, UserX } from 'lucide-react';
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
import { employees, businesses, formatCurrency, formatDate } from '@/data/mockData';

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('all');

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBusiness = businessFilter === 'all' || employee.businessId === businessFilter;
    return matchesSearch && matchesBusiness;
  });

  const activeCount = filteredEmployees.filter((e) => e.status === 'active').length;
  const totalSalary = filteredEmployees
    .filter((e) => e.status === 'active')
    .reduce((acc, e) => acc + e.salary, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nhân viên</h1>
          <p className="mt-1 text-muted-foreground">Quản lý nhân viên của các hộ kinh doanh</p>
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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                <p className="text-xl font-bold">{filteredEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang làm việc</p>
                <p className="text-xl font-bold text-success">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng lương/tháng</p>
                <p className="text-xl font-bold">{formatCurrency(totalSalary)}</p>
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
                placeholder="Tìm theo tên hoặc chức vụ..."
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

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>Tất cả nhân viên của các hộ kinh doanh</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Hộ KD</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead className="text-right">Lương</TableHead>
                <TableHead>Ngày vào</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="data-table-row">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{businesses.find((b) => b.id === employee.businessId)?.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>{formatDate(employee.startDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={employee.status === 'active' ? 'badge-success' : 'badge-destructive'}
                    >
                      {employee.status === 'active' ? 'Đang làm' : 'Đã nghỉ'}
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
