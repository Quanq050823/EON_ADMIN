import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	Calculator,
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	ArrowRight,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api";
import type { LoginData, RegisterData } from "@/services/api";
import gsap from "gsap";

// Constants
const ORB_POSITIONS = [
	{ left: "10%", top: "20%", size: 60 },
	{ left: "85%", top: "15%", size: 40 },
	{ left: "75%", top: "70%", size: 50 },
	{ left: "15%", top: "75%", size: 35 },
	{ left: "50%", top: "10%", size: 45 },
	{ left: "90%", top: "45%", size: 30 },
];

const INITIAL_LOGIN_FORM: LoginData = {
	email: "",
	password: "",
};

const INITIAL_SIGNUP_FORM: RegisterData = {
	email: "",
	password: "",
	fullName: "",
};

export default function Auth() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [loginForm, setLoginForm] = useState<LoginData>(INITIAL_LOGIN_FORM);
	const [signupForm, setSignupForm] =
		useState<RegisterData>(INITIAL_SIGNUP_FORM);

	// Refs for GSAP animations
	const containerRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const orbsRef = useRef<(HTMLDivElement | null)[]>([]);

	// Check authentication status on mount
	useEffect(() => {
		let isMounted = true;

		const checkAuth = async () => {
			try {
				const isAuth = await authApi.isAuthenticated();
				if (isAuth && isMounted) {
					navigate("/dashboard", { replace: true });
				}
			} catch (error) {
				// User not authenticated, stay on auth page
			}
		};

		checkAuth();

		return () => {
			isMounted = false;
		};
	}, [navigate]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Initial setup
			gsap.set([logoRef.current, cardRef.current], { opacity: 0, y: 30 });
			gsap.set(".floating-orb", { opacity: 0, scale: 0 });

			// Main timeline
			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			tl.to(logoRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.8,
			})
				.to(
					cardRef.current,
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
					},
					"-=0.4"
				)
				.to(
					".floating-orb",
					{
						opacity: 0.6,
						scale: 1,
						stagger: 0.1,
						duration: 0.6,
					},
					"-=0.6"
				);

			// Floating animation for orbs
			orbsRef.current.forEach((orb, i) => {
				if (orb) {
					gsap.to(orb, {
						y: `random(-20, 20)`,
						x: `random(-15, 15)`,
						duration: `random(3, 5)`,
						repeat: -1,
						yoyo: true,
						ease: "sine.inOut",
						delay: i * 0.2,
					});
				}
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	// Tab change animation
	useEffect(() => {
		if (formRef.current) {
			gsap.fromTo(
				formRef.current,
				{ opacity: 0, x: activeTab === "login" ? -20 : 20 },
				{ opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
			);
		}
	}, [activeTab]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		gsap.to(e.currentTarget.querySelector('button[type="submit"]'), {
			scale: 0.95,
			duration: 0.1,
			yoyo: true,
			repeat: 1,
		});

		try {
			const response = await authApi.login(loginForm);

			// Save token and user data
			localStorage.setItem("accessToken", response.accessToken);

			toast({
				title: "Đăng nhập thành công",
			});

			// Navigate based on user role
			setTimeout(() => {
				navigate("/dashboard");
			}, 500);
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Email hoặc mật khẩu không chính xác";

			toast({
				title: "Đăng nhập thất bại",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!signupForm.email || !signupForm.password || !signupForm.fullName) {
			toast({
				title: "Thông tin không hợp lệ",
				description: "Vui lòng nhập đầy đủ thông tin",
				variant: "destructive",
			});
			return;
		}

		if (signupForm.password.length < 6) {
			toast({
				title: "Mật khẩu không hợp lệ",
				description: "Mật khẩu phải có ít nhất 6 ký tự",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await authApi.register(signupForm);

			// Save authentication data
			localStorage.setItem("accessToken", response.accessToken);
			localStorage.setItem("user", JSON.stringify(response.user));

			toast({
				title: "Đăng ký thành công",
				description: "Tài khoản của bạn đã được tạo! Vui lòng xác thực email.",
			});

			navigate("/dashboard", { replace: true });
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Đã có lỗi xảy ra. Vui lòng thử lại.";

			toast({
				title: "Đăng ký thất bại",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		authApi.loginWithGoogle();
	};

	const orbPositions = [
		{ left: "10%", top: "20%", size: 60 },
		{ left: "85%", top: "15%", size: 40 },
		{ left: "75%", top: "70%", size: 50 },
		{ left: "15%", top: "75%", size: 35 },
		{ left: "50%", top: "10%", size: 45 },
		{ left: "90%", top: "45%", size: 30 },
	];

	return (
		<div
			ref={containerRef}
			className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4"
		>
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
				<div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
				<div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]" />
				<div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
			</div>

			{/* Floating Orbs */}
			<div className="pointer-events-none absolute inset-0">
				{orbPositions.map((pos, i) => (
					<div
						key={i}
						ref={(el) => (orbsRef.current[i] = el)}
						className="floating-orb absolute rounded-full"
						style={{
							width: pos.size,
							height: pos.size,
							left: pos.left,
							top: pos.top,
							background: `linear-gradient(135deg, ${
								[
									"rgba(59,130,246,0.3)",
									"rgba(139,92,246,0.3)",
									"rgba(6,182,212,0.3)",
								][i % 3]
							}, transparent)`,
							filter: "blur(1px)",
						}}
					/>
				))}
			</div>

			<div className="relative z-10 w-full max-w-md">
				{/* Logo */}
				<div ref={logoRef} className="mb-8 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
						<Calculator className="h-9 w-9 text-white" />
					</div>
					<h1 className="bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-3xl font-bold text-transparent">
						KeToan EON
					</h1>
					<p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400">
						<Sparkles className="h-4 w-4 text-blue-400" />
						Hệ thống quản lý hộ kinh doanh
					</p>
				</div>

				{/* Card */}
				<div
					ref={cardRef}
					className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
				>
					<div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px]" />
					<div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/20 blur-[60px]" />

					<div className="relative">
						{/* Tab Switcher */}
						<div className="mb-8 flex rounded-xl bg-slate-800/50 p-1">
							{(["login", "signup"] as const).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
										activeTab === tab
											? "text-white"
											: "text-slate-400 hover:text-slate-300"
									}`}
								>
									{activeTab === tab && (
										<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600" />
									)}
									<span className="relative">
										{tab === "login" ? "Đăng nhập" : "Đăng ký"}
									</span>
								</button>
							))}
						</div>

						{/* Login Form */}
						{activeTab === "login" && (
							<form ref={formRef} onSubmit={handleLogin} className="space-y-5">
								<div className="space-y-2">
									<Label htmlFor="login-email" className="text-slate-300">
										Email
									</Label>
									<div className="group relative">
										<Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<Input
											id="login-email"
											type="email"
											placeholder="ketoan@example.com"
											value={loginForm.email}
											onChange={(e) =>
												setLoginForm({ ...loginForm, email: e.target.value })
											}
											className="h-12 border-slate-700 bg-slate-800/50 pl-11 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="login-password" className="text-slate-300">
										Mật khẩu
									</Label>
									<div className="group relative">
										<Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<Input
											id="login-password"
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											value={loginForm.password}
											onChange={(e) =>
												setLoginForm({ ...loginForm, password: e.target.value })
											}
											className="h-12 border-slate-700 bg-slate-800/50 pl-11 pr-11 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<div className="flex items-center justify-between text-sm">
									<label className="flex cursor-pointer items-center gap-2">
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20"
										/>
										<span className="text-slate-400">Ghi nhớ đăng nhập</span>
									</label>
									<a
										href="#"
										className="text-blue-400 transition-colors hover:text-blue-300"
									>
										Quên mật khẩu?
									</a>
								</div>

								<Button
									type="submit"
									className="group h-12 w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Đang xử lý...
										</div>
									) : (
										<span className="flex items-center gap-2">
											Đăng nhập
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
										</span>
									)}
								</Button>
							</form>
						)}

						{/* Signup Form */}
						{activeTab === "signup" && (
							<form ref={formRef} onSubmit={handleSignup} className="space-y-5">
								<div className="space-y-2">
									<Label htmlFor="signup-name" className="text-slate-300">
										Họ và tên
									</Label>
									<div className="group relative">
										<User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<Input
											id="signup-name"
											type="text"
											placeholder="Nguyễn Văn A"
											value={signupForm.fullName}
											onChange={(e) =>
												setSignupForm({
													...signupForm,
													fullName: e.target.value,
												})
											}
											className="h-12 border-slate-700 bg-slate-800/50 pl-11 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-email" className="text-slate-300">
										Email
									</Label>
									<div className="group relative">
										<Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<Input
											id="signup-email"
											type="email"
											placeholder="ketoan@example.com"
											value={signupForm.email}
											onChange={(e) =>
												setSignupForm({ ...signupForm, email: e.target.value })
											}
											className="h-12 border-slate-700 bg-slate-800/50 pl-11 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-password" className="text-slate-300">
										Mật khẩu
									</Label>
									<div className="group relative">
										<Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<Input
											id="signup-password"
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											value={signupForm.password}
											onChange={(e) =>
												setSignupForm({
													...signupForm,
													password: e.target.value,
												})
											}
											className="h-12 border-slate-700 bg-slate-800/50 pl-11 pr-11 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<div className="text-sm">
									<label className="flex cursor-pointer items-start gap-2">
										<input
											type="checkbox"
											className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20"
											required
										/>
										<span className="text-slate-400">
											Tôi đồng ý với{" "}
											<a href="#" className="text-blue-400 hover:text-blue-300">
												Điều khoản sử dụng
											</a>{" "}
											và{" "}
											<a href="#" className="text-blue-400 hover:text-blue-300">
												Chính sách bảo mật
											</a>
										</span>
									</label>
								</div>

								<Button
									type="submit"
									className="group h-12 w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Đang xử lý...
										</div>
									) : (
										<span className="flex items-center gap-2">
											Tạo tài khoản
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
										</span>
									)}
								</Button>
							</form>
						)}

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-700" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-slate-900/80 px-2 text-slate-500">
									hoặc tiếp tục với
								</span>
							</div>
						</div>

						{/* Social Login */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={handleGoogleLogin}
								className="h-11 border-slate-700 bg-slate-800/50 text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700/50"
							>
								<svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</Button>
							<Button
								variant="outline"
								className="h-11 border-slate-700 bg-slate-800/50 text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700/50"
							>
								<svg
									className="mr-2 h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								GitHub
							</Button>
						</div>
					</div>
				</div>

				<p className="mt-8 text-center text-xs text-slate-500">
					© 2024 KeToan EON. Được phát triển bởi EON Software.
				</p>
			</div>
		</div>
	);
}
