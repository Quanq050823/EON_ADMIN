import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Building2,
	FileText,
	Package,
	Users,
	Receipt,
	Calculator,
	FileBarChart,
	LogOut,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
	{ title: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
	{ title: "Hộ kinh doanh", href: "/businesses", icon: Building2 },
];

const moduleNavItems = [
	{ title: "Hóa đơn", href: "/invoices", icon: FileText },
	{ title: "Kho hàng", href: "/inventory", icon: Package },
	{ title: "Chi phí", href: "/expenses", icon: Receipt },
	{ title: "Thuế", href: "/taxes", icon: Calculator },
	{ title: "Nhân viên", href: "/employees", icon: Users },
	{ title: "Báo cáo", href: "/reports", icon: FileBarChart },
];

export function AppSidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();

	const isActive = (path: string) =>
		location.pathname === path || location.pathname.startsWith(path + "/");

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
				collapsed ? "w-16" : "w-64"
			)}
		>
			<div className="flex h-full flex-col">
				{/* Logo */}
				<div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
					{!collapsed && (
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
								<Calculator className="h-5 w-5 text-sidebar-primary-foreground" />
							</div>
							<span className="text-lg font-semibold text-sidebar-foreground">
								KeToan EON
							</span>
						</div>
					)}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
					>
						{collapsed ? (
							<ChevronRight className="h-5 w-5" />
						) : (
							<ChevronLeft className="h-5 w-5" />
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
					{/* Main Nav */}
					<div className="space-y-1">
						{!collapsed && (
							<span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
								Chính
							</span>
						)}
						{mainNavItems.map((item) => (
							<NavLink
								key={item.href}
								to={item.href}
								className={cn(
									"sidebar-item",
									isActive(item.href) && "sidebar-item-active"
								)}
							>
								<item.icon className="h-5 w-5 shrink-0" />
								{!collapsed && <span>{item.title}</span>}
							</NavLink>
						))}
					</div>

					{/* Module Nav */}
					<div className="mt-6 space-y-1">
						{!collapsed && (
							<span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
								Quản lý
							</span>
						)}
						{moduleNavItems.map((item) => (
							<NavLink
								key={item.href}
								to={item.href}
								className={cn(
									"sidebar-item",
									isActive(item.href) && "sidebar-item-active"
								)}
							>
								<item.icon className="h-5 w-5 shrink-0" />
								{!collapsed && <span>{item.title}</span>}
							</NavLink>
						))}
					</div>
				</nav>
			</div>
		</aside>
	);
}
