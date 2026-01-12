import { FileBarChart, Download, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { businesses } from '@/data/mockData';
import { useState } from 'react';

const reports = [
  {
    id: 'S1',
    name: 'Báo cáo S1 - Sổ chi tiết bán hàng',
    description: 'Chi tiết doanh thu bán hàng theo ngày',
    icon: FileText,
  },
  {
    id: 'S2',
    name: 'Báo cáo S2 - Sổ chi tiết mua hàng',
    description: 'Chi tiết chi phí mua hàng theo ngày',
    icon: FileText,
  },
  {
    id: 'S3',
    name: 'Báo cáo S3 - Sổ quỹ tiền mặt',
    description: 'Thu chi tiền mặt trong kỳ',
    icon: FileText,
  },
  {
    id: 'S4',
    name: 'Báo cáo S4 - Sổ theo dõi TSCĐ',
    description: 'Theo dõi tài sản cố định',
    icon: FileText,
  },
  {
    id: 'S5',
    name: 'Báo cáo S5 - Sổ theo dõi thuế',
    description: 'Chi tiết thuế phải nộp và đã nộp',
    icon: FileText,
  },
  {
    id: 'S6',
    name: 'Báo cáo S6 - Báo cáo tài chính',
    description: 'Tổng hợp tình hình tài chính',
    icon: FileBarChart,
  },
];

export default function Reports() {
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('Q4-2023');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo</h1>
          <p className="mt-1 text-muted-foreground">Xuất báo cáo S1 - S6 theo quy định</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Chọn hộ kinh doanh" />
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
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q4-2023">Quý 4/2023</SelectItem>
                <SelectItem value="Q3-2023">Quý 3/2023</SelectItem>
                <SelectItem value="Q2-2023">Quý 2/2023</SelectItem>
                <SelectItem value="Q1-2023">Quý 1/2023</SelectItem>
                <SelectItem value="2023">Năm 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="transition-all hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{report.id}</span>
              </div>
              <CardTitle className="mt-3 text-base">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Xem
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info/10">
            <FileBarChart className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Hướng dẫn xuất báo cáo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chọn hộ kinh doanh và kỳ báo cáo phù hợp trước khi xuất. Báo cáo sẽ được xuất theo mẫu quy định của cơ quan thuế.
              Đảm bảo dữ liệu đã được đồng bộ đầy đủ trước khi xuất báo cáo chính thức.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
