import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import BusinessDetail from "./pages/BusinessDetail";
import Invoices from "./pages/Invoices";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import Taxes from "./pages/Taxes";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import AdminBusinessOwners from "./pages/AdminBusinessOwners";
import AdminBusinessOwnerDetail from "./pages/AdminBusinessOwnerDetail";
import NotFound from "./pages/NotFound";
import AdminEasyInvoices from "./pages/AdminEasyInvoices";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/auth" element={<Auth />} />

					{/* Protected routes with AppLayout */}
					<Route element={<AppLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/businesses" element={<Businesses />} />
						<Route path="/businesses/:id" element={<BusinessDetail />} />
						<Route path="/invoices" element={<Invoices />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route path="/expenses" element={<Expenses />} />
						<Route path="/taxes" element={<Taxes />} />
						<Route path="/employees" element={<Employees />} />
						<Route path="/reports" element={<Reports />} />

						<Route
							path="/admin/business-owners"
							element={<AdminBusinessOwners />}
						/>
						<Route
							path="/admin/business-owners/:id"
							element={<AdminBusinessOwnerDetail />}
						/>
						<Route
							path="/admin/business-owners/:id/easy-invoices"
							element={<AdminEasyInvoices />}
						/>
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
