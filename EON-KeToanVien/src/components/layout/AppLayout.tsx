import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

function LayoutContent() {
	const navigate = useNavigate();
	const { collapsed } = useSidebar();

	const handleLogout = async () => {
		try {
			await authApi.logout();

			toast({
				title: "Đăng xuất thành công",
				description: "Hẹn gặp lại bạn!",
			});

			navigate("/auth", { replace: true });
		} catch (error: any) {
			console.error("Logout error:", error);

			// Clear local data even if API call fails
			localStorage.removeItem("accessToken");
			localStorage.removeItem("user");

			navigate("/auth", { replace: true });
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<AppSidebar />

			{/* Main Content */}
			<div
				className={`transition-all duration-300 ${
					collapsed ? "pl-16" : "pl-64"
				}`}
			>
				{/* Header */}
				<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="flex items-center gap-4"></div>

					<div className="flex items-center gap-3">
						<Button variant="ghost" size="icon" className="relative">
							{/* <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
								3
							</span> */}
						</Button>

						<div className="flex items-center gap-3 border-l border-border pl-3">
							<div className="text-right">
								<p className="text-sm font-medium">Admin</p>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="rounded-full">
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-30">
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={handleLogout}
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Đăng xuất</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export function AppLayout() {
	return (
		<SidebarProvider>
			<LayoutContent />
		</SidebarProvider>
	);
}
