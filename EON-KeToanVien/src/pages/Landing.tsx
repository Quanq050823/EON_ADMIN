import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Calculator,
	TrendingUp,
	Shield,
	Zap,
	Users,
	BarChart3,
	CheckCircle2,
	ArrowRight,
	Sparkles,
	FileText,
	Globe,
	Clock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
	const navigate = useNavigate();
	const heroRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Hero animations
			gsap.from(".hero-title", {
				opacity: 0,
				y: 50,
				duration: 1,
				ease: "power3.out",
			});

			gsap.from(".hero-subtitle", {
				opacity: 0,
				y: 30,
				duration: 1,
				delay: 0.2,
				ease: "power3.out",
			});

			gsap.from(".hero-cta", {
				opacity: 0,
				y: 20,
				duration: 0.8,
				delay: 0.4,
				ease: "power3.out",
			});

			gsap.from(".hero-image", {
				opacity: 0,
				scale: 0.95,
				duration: 1.2,
				delay: 0.3,
				ease: "power3.out",
			});

			// Feature cards animation
			gsap.fromTo(
				".feature-card",
				{
					opacity: 0,
					y: 50,
				},
				{
					scrollTrigger: {
						trigger: featuresRef.current,
						start: "top 80%",
					},
					opacity: 1,
					y: 0,
					duration: 0.8,
					stagger: 0.15,
					ease: "power3.out",
				}
			); // Stats animation
			gsap.from(".stat-item", {
				scrollTrigger: {
					trigger: ".stats-section",
					start: "top 80%",
				},
				opacity: 0,
				scale: 0.8,
				duration: 0.6,
				stagger: 0.1,
				ease: "back.out(1.7)",
			});

			// CTA section animation
			gsap.from(".cta-content", {
				scrollTrigger: {
					trigger: ctaRef.current,
					start: "top 80%",
				},
				opacity: 0,
				y: 40,
				duration: 1,
				ease: "power3.out",
			});

			// Floating animation for decorative elements
			gsap.to(".float-animation", {
				y: -15,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		});

		return () => ctx.revert();
	}, []);

	const features = [
		{
			icon: FileText,
			title: "Quản lý Hóa đơn",
			description:
				"Tạo, theo dõi và quản lý hóa đơn đầu vào/ra một cách dễ dàng và chính xác",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Calculator,
			title: "Tính toán Thuế tự động",
			description:
				"Hệ thống tự động tính thuế VAT, TNCN và các loại thuế khác theo quy định",
			color: "from-violet-500 to-purple-500",
		},
		{
			icon: BarChart3,
			title: "Báo cáo Chi tiết",
			description:
				"Xuất báo cáo tài chính, thuế và doanh thu theo thời gian thực",
			color: "from-orange-500 to-red-500",
		},
		{
			icon: Users,
			title: "Quản lý Nhân viên",
			description:
				"Theo dõi thông tin nhân viên, bảng lương và các khoản phúc lợi",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: TrendingUp,
			title: "Theo dõi Kho hàng",
			description:
				"Quản lý tồn kho, nhập xuất hàng và giá trị hàng hóa theo thời gian thực",
			color: "from-pink-500 to-rose-500",
		},
		{
			icon: Shield,
			title: "Bảo mật Cao",
			description:
				"Mã hóa dữ liệu đầu cuối, xác thực 2 lớp và backup tự động hàng ngày",
			color: "from-indigo-500 to-blue-500",
		},
	];

	const benefits = [
		"Tiết kiệm thời gian lên đến 80%",
		"Giảm thiểu sai sót kế toán",
		"Tuân thủ đầy đủ quy định thuế",
		"Truy cập mọi lúc mọi nơi",
		"Hỗ trợ 24/7",
		"Miễn phí cập nhật",
	];

	const stats = [
		{ value: "5000+", label: "Hộ kinh doanh" },
		{ value: "99.9%", label: "Uptime" },
		{ value: "50K+", label: "Hóa đơn/tháng" },
		{ value: "4.9/5", label: "Đánh giá" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			{/* Navigation */}
			<nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
							<Calculator className="h-6 w-6 text-white" />
						</div>
						<span className="text-xl font-bold text-white">KeToan EON</span>
					</div>
					<div className="flex items-center gap-4">
						<Button
							className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700"
							onClick={() => navigate("/auth")}
						>
							Đăng nhập
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section ref={heroRef} className="relative overflow-hidden pt-32 pb-20">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
					<div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] float-animation" />
					<div className="absolute -right-40 top-60 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px] float-animation" />
				</div>

				<div className="relative mx-auto max-w-7xl px-6">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<div className="hero-title mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
								<Sparkles className="h-4 w-4" />
								Giải pháp kế toán thông minh cho HKD
							</div>

							<h1 className="hero-title mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-5xl font-bold pb-6 text-transparent lg:text-6xl">
								Quản lý Hộ Kinh Doanh
								<br />
								Dễ dàng & Hiệu quả
							</h1>

							<p className="hero-subtitle mb-8 text-lg text-slate-400">
								Hệ thống CMS toàn diện giúp kế toán viên quản lý mọi khía cạnh
								của hộ kinh doanh: từ hóa đơn, thuế, kho hàng đến nhân viên và
								báo cáo tài chính.
							</p>

							<div className="hero-cta flex flex-wrap gap-4">
								<Button
									size="lg"
									className="group h-14 bg-gradient-to-r from-blue-500 to-violet-600 px-8 text-lg text-white hover:from-blue-600 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25"
									onClick={() => navigate("/auth")}
								>
									Dùng thử miễn phí
									<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="h-14 border-slate-700 bg-slate-800/50 px-8 text-lg text-slate-300 hover:bg-slate-700/50"
								>
									<Globe className="mr-2 h-5 w-5" />
									Xem Demo
								</Button>
							</div>

							<div className="hero-subtitle mt-8 flex items-center gap-6 text-sm text-slate-500">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									Không cần thẻ tín dụng
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									Dùng thử 14 ngày
								</div>
							</div>
						</div>

						<div className="hero-image relative">
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-3xl" />
							<div className="relative rounded-3xl border border-white/10 bg-slate-800/50 p-8 backdrop-blur-xl">
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="flex items-center gap-4 rounded-xl bg-slate-700/50 p-4"
										>
											<div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600" />
											<div className="flex-1">
												<div className="mb-2 h-3 w-3/4 rounded bg-slate-600" />
												<div className="h-2 w-1/2 rounded bg-slate-700" />
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="stats-section relative py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
						{stats.map((stat, i) => (
							<div
								key={i}
								className="stat-item rounded-2xl border border-white/10 bg-slate-800/50 p-6 text-center backdrop-blur-xl"
							>
								<div className="mb-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-4xl font-bold text-transparent">
									{stat.value}
								</div>
								<div className="text-sm text-slate-400">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section ref={featuresRef} className="relative py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-16 text-center">
						<h2 className="mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-bold text-transparent">
							Tính năng Nổi bật
						</h2>
						<p className="text-lg text-slate-400">
							Mọi công cụ bạn cần để quản lý hộ kinh doanh hiệu quả
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{features.map((feature, i) => (
							<div
								key={i}
								className="feature-card group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-slate-800/70"
							>
								<div
									className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
								>
									<feature.icon className="h-6 w-6 text-white" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-white">
									{feature.title}
								</h3>
								<p className="text-slate-400">{feature.description}</p>
								<div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl transition-all group-hover:scale-150" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="relative py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<h2 className="mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-bold text-transparent">
								Lợi ích Vượt trội
							</h2>
							<p className="mb-8 text-lg text-slate-400">
								KeToan EON mang đến giải pháp toàn diện giúp tối ưu hóa quy
								trình kế toán và quản lý cho hộ kinh doanh của bạn.
							</p>

							<div className="space-y-4">
								{benefits.map((benefit, i) => (
									<div key={i} className="flex items-center gap-3">
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
											<CheckCircle2 className="h-4 w-4 text-green-500" />
										</div>
										<span className="text-slate-300">{benefit}</span>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-3xl" />
							<div className="relative space-y-4">
								{[
									{ icon: Clock, text: "Tiết kiệm 20+ giờ mỗi tháng" },
									{ icon: Shield, text: "Bảo mật cấp ngân hàng" },
									{ icon: Zap, text: "Xử lý nhanh chóng, chính xác" },
								].map((item, i) => (
									<div
										key={i}
										className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl"
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
											<item.icon className="h-6 w-6 text-white" />
										</div>
										<span className="text-lg text-white">{item.text}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section ref={ctaRef} className="relative py-20">
				<div className="mx-auto max-w-4xl px-6">
					<div className="cta-content relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-12 text-center backdrop-blur-xl">
						<div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500/30 blur-[80px]" />
						<div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-violet-500/30 blur-[80px]" />

						<div className="relative">
							<h2 className="mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-bold text-transparent">
								Sẵn sàng Bắt đầu?
							</h2>
							<p className="mb-8 text-lg text-slate-400">
								Tham gia cùng hàng nghìn hộ kinh doanh đang sử dụng KeToan EON
								để tối ưu hóa quản lý tài chính
							</p>

							<div className="flex flex-wrap justify-center gap-4">
								<Button
									size="lg"
									className="group h-14 bg-gradient-to-r from-blue-500 to-violet-600 px-8 text-lg text-white hover:from-blue-600 hover:to-violet-700 hover:shadow-lg hover:shadow-blue-500/25"
									onClick={() => navigate("/auth")}
								>
									Đăng ký ngay
									<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="h-14 border-slate-700 bg-slate-800/50 px-8 text-lg text-slate-300 hover:bg-slate-700/50"
								>
									Liên hệ tư vấn
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-white/10 py-12">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center gap-2">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
									<Calculator className="h-6 w-6 text-white" />
								</div>
								<span className="text-xl font-bold text-white">KeToan EON</span>
							</div>
							<p className="text-sm text-slate-400">
								Giải pháp quản lý kế toán toàn diện cho hộ kinh doanh
							</p>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Sản phẩm</h4>
							<ul className="space-y-2 text-sm text-slate-400">
								<li>Tính năng</li>
								<li>Giá cả</li>
								<li>Bảo mật</li>
								<li>Cập nhật</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Hỗ trợ</h4>
							<ul className="space-y-2 text-sm text-slate-400">
								<li>Tài liệu</li>
								<li>Hướng dẫn</li>
								<li>FAQ</li>
								<li>Liên hệ</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Công ty</h4>
							<ul className="space-y-2 text-sm text-slate-400">
								<li>Về chúng tôi</li>
								<li>Blog</li>
								<li>Tuyển dụng</li>
								<li>Điều khoản</li>
							</ul>
						</div>
					</div>

					<div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
						© 2024 KeToan EON. Được phát triển bởi EON Software.
					</div>
				</div>
			</footer>
		</div>
	);
}
