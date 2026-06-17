"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Image from "next/image";
import {
  ChevronRight, ChevronLeft, Lock, ArrowRight, Zap, TrendingUp, Users,
  Star, CheckCircle, Target, Mic2, Globe, Camera, MessageCircle,
  Flame, Trophy, Heart, ShieldCheck, Clock, Printer, ZoomIn, ZoomOut,
  RefreshCw, Search, X, Menu, Sparkles, PlayCircle, BarChart3, Award
} from "lucide-react";

type PlanKey = "presenca" | "autoridade" | "influenciador" | null;

interface PlanItem {
  label: string;
  detail: string;
  badge?: string;
}

const PLAN_DETAILS: Record<string, {
  name: string;
  tagline: string;
  price: string;
  installment: string;
  delivery: string;
  highlight: boolean;
  colorClass: string;
  accentClass: string;
  badgeBg: string;
  items: PlanItem[];
}> = {
  presenca: {
    name: "Presença",
    tagline: "A base da sua marca pessoal",
    price: "R$ 8.870",
    installment: "ou 2x de R$ 4.878",
    delivery: "10 dias úteis",
    highlight: false,
    colorClass: "border-[#555]",
    accentClass: "text-[#aaa]",
    badgeBg: "bg-[#2d2d2d]",
    items: [
      { label: "Consultoria de Identidade Pessoal", detail: "Diagnóstico completo da sua história, valores e diferencial como influenciador" },
      { label: "Naming e Posicionamento", detail: "Definição do seu nicho, persona do público e arquétipo de marca" },
      { label: "Logo e Identidade Visual", detail: "Criação profissional de logo, paleta, tipografia e avatar para redes sociais" },
      { label: "Bio Estratégica (Instagram e LinkedIn)", detail: "Copywriting persuasivo que transforma visitantes em seguidores" },
      { label: "Google Meu Negócio (Pizzaria + Pessoal)", detail: "Otimização completa para aparecer nas buscas locais" },
      { label: "6 Posts de Lançamento", detail: "Conteúdo estratégico: story de origem, bastidores, bastidores da expansão" },
      { label: "Relatório de Entrega", detail: "Documento com todos os acessos e orientações estratégicas" },
    ]
  },
  autoridade: {
    name: "Autoridade",
    tagline: "Você no topo do seu nicho",
    price: "R$ 12.980",
    installment: "ou 3x de R$ 4.659",
    delivery: "20 dias úteis",
    highlight: true,
    colorClass: "border-[#e63946]",
    accentClass: "text-[#e63946]",
    badgeBg: "bg-[#e63946]",
    items: [
      { label: "Tudo do Plano Presença", detail: "Base completa de identidade pessoal", badge: "+ 7 itens" },
      { label: "Site Pessoal One Page Premium", detail: "Sua central digital: história, projetos, mídia e contato" },
      { label: "Domínio + Hospedagem 1 ano", detail: "Registro em seu nome, SSL e velocidade premium" },
      { label: "Papelaria Digital Completa", detail: "Apresentação comercial em PDF, assinatura de e-mail, template de stories" },
      { label: "Planejamento de Conteúdo 90 dias", detail: "Calendário editorial com temas, formatos e melhores horários" },
      { label: "12 Posts + 12 Stories estratégicos", detail: "Reels de autoridade, bastidores da expansão e cases das pizzarias" },
      { label: "Consultoria de Monetização", detail: "Como transformar seguidores em negócios: parcerias, palestras e mentorias" },
      { label: "Manual de Marca (Brandbook Pocket)", detail: "Regras de uso, tons de voz e guia de comunicação visual" },
    ]
  },
  influenciador: {
    name: "Influenciador Pro",
    tagline: "Lançamento completo no mercado",
    price: "R$ 24.900",
    installment: "ou 4x de R$ 6.890",
    delivery: "40 dias úteis",
    highlight: false,
    colorClass: "border-[#555]",
    accentClass: "text-[#aaa]",
    badgeBg: "bg-[#2d2d2d]",
    items: [
      { label: "Tudo dos Planos Anteriores", detail: "Toda a base de presença e autoridade consolidada", badge: "+ 15 itens" },
      { label: "Vídeo Manifesto (2min)", detail: "Produção audiovisual: história, missão e impacto — para o perfil e o pitch deck" },
      { label: "Podcast Piloto (3 episódios)", detail: "Lançamento do seu podcast com edição, capa e distribuição nas plataformas" },
      { label: "Estratégia de Tráfego Pago", detail: "Campanhas Meta Ads para crescimento de seguidores qualificados do seu nicho" },
      { label: "Assessoria de Imprensa Digital", detail: "Envio do seu perfil para portais de notícia e parceiros de mídia do Nordeste" },
      { label: "Lançamento nas Redes Estratégico", detail: "Sequência de posts de lançamento com copywriting e timing de alta conversão" },
      { label: "Consultoria Mensal (3 meses)", detail: "1 reunião por mês para ajustes, análise de métricas e direcionamento" },
      { label: "Dashboard de Métricas", detail: "Painel de acompanhamento: alcance, engajamento, conversões e crescimento" },
    ]
  }
};

export default function FelipePresentation() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [activePlan, setActivePlan] = useState<PlanKey>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TOTAL_SCREENS = 10;

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("felipe_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pwd = passwordInput.trim().toLowerCase();
    if (pwd === "felipe2026") {
      setIsAuthenticated(true);
      localStorage.setItem("felipe_auth", "true");
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const nextScreen = useCallback(() => {
    setActivePlan(null);
    setCurrentScreen((prev) => Math.min(prev + 1, TOTAL_SCREENS - 1));
  }, []);

  const prevScreen = useCallback(() => {
    setActivePlan(null);
    setCurrentScreen((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePlan) { if (e.key === "Escape") setActivePlan(null); return; }
      if (isSearchOpen) { if (e.key === "Escape") setIsSearchOpen(false); return; }
      if (e.key === "ArrowRight") nextScreen();
      if (e.key === "ArrowLeft") prevScreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScreen, prevScreen, activePlan, isSearchOpen]);

  const navGroups = [
    { label: "Visão Geral", items: ["Capa", "Sobre Felipe", "Oportunidade"], startIndex: 0 },
    { label: "Consultoria", items: ["Diagnóstico", "Metodologia", "Ecossistema"], startIndex: 3 },
    { label: "Proposta", items: ["Influenciador Pro", "Plano Autoridade", "Plano Presença", "Contratar"], startIndex: 6 },
  ];

  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden">
        {/* Red ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e63946] rounded-full opacity-[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e63946] rounded-full opacity-[0.03] blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 w-full max-w-md px-6">
          <div className="glass-card rounded-2xl p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)]" style={{ border: "1px solid rgba(230,57,70,0.15)" }}>

            {/* Lock icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center red-glow"
                style={{ background: "linear-gradient(135deg, #e63946, #c62828)" }}>
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Logo Produza */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-10">
                <Image src="/logo-produza.png" alt="Produza" fill className="object-contain" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">Acesso Restrito</h2>
            <p className="text-[#666] text-center text-sm mb-8">Proposta exclusiva · Confidencial</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha de acesso"
                autoFocus
                className={`w-full rounded-xl px-5 py-4 text-white text-center tracking-widest transition-all duration-300 outline-none focus:ring-2 ${authError ? "ring-2 ring-red-500 bg-red-950/20" : "focus:ring-[#e63946]/50"}`}
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${authError ? "#e63946" : "rgba(255,255,255,0.1)"}` }}
              />
              {authError && (
                <p className="text-[#e63946] text-xs text-center animate-fade-in-up">Credencial inválida. Tente novamente.</p>
              )}
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-white font-bold tracking-widest uppercase text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #e63946, #c62828)" }}
              >
                Desbloquear Proposta →
              </button>
            </form>

            <p className="text-[#444] text-[10px] text-center mt-6 tracking-widest uppercase">
              Produza ProLab · CNPJ 36.312.373/0001-45
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── MAIN PRESENTATION ──
  return (
    <main
      style={{ zoom: `${fontSize}%` } as React.CSSProperties}
      className="min-h-screen bg-[#111111] text-[#d0d0d0] flex flex-col items-center relative overflow-hidden transition-all duration-300"
    >
      {/* Background ambient red glow — changes per slide */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000"
        style={{
          background: currentScreen === 0
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,57,70,0.08) 0%, transparent 70%)"
            : currentScreen >= 6
            ? "radial-gradient(ellipse 50% 60% at 20% 80%, rgba(230,57,70,0.06) 0%, transparent 60%)"
            : "radial-gradient(ellipse 40% 40% at 80% 20%, rgba(230,57,70,0.05) 0%, transparent 60%)"
        }}
      />

      {/* Subtle grid */}
      <div className="fixed inset-0 -z-10 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin-bottom: 25mm; }
          body, main { background: white !important; color: black !important; }
          .print-hide { display: none !important; }
          main { display: block !important; height: auto !important; overflow: visible !important; zoom: 1 !important; }
          .screen-slide { position: relative !important; opacity: 1 !important; transform: none !important; pointer-events: auto !important; display: block !important; height: auto !important; margin-bottom: 3rem; page-break-inside: avoid; }
        }
      `}} />

      {/* ── FLOATING TOOLS ── */}
      <div className="fixed bottom-12 md:bottom-6 right-2 md:right-6 z-[100] flex flex-col gap-3 print-hide opacity-30 md:opacity-100 hover:opacity-100 transition-opacity duration-300">
        {[
          { icon: Printer, label: "Imprimir", action: () => window.print() },
          { icon: ZoomIn, label: "Aumentar Zoom", action: () => setFontSize(f => Math.min(f + 10, 150)) },
          { icon: ZoomOut, label: "Diminuir Zoom", action: () => setFontSize(f => Math.max(f - 10, 50)) },
          { icon: Search, label: "Buscar", action: () => setIsSearchOpen(true) },
          { icon: RefreshCw, label: "Reiniciar", action: () => { setActivePlan(null); setCurrentScreen(0); } },
        ].map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl group relative"
            style={{ background: "#1e1e1e", border: "1px solid #2d2d2d" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#e63946")}
            onMouseLeave={e => (e.currentTarget.style.background = "#1e1e1e")}
          >
            <Icon className="w-4 h-4" />
            <span className="absolute right-12 bg-[#1a1a1a] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap font-bold tracking-wide" style={{ border: "1px solid #2d2d2d" }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 print-hide" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
          <div className="glass-card w-full max-w-lg rounded-2xl p-8" style={{ border: "1px solid rgba(230,57,70,0.2)" }}>
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-[#e63946]" />
              <input autoFocus value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar na proposta..."
                className="flex-1 bg-transparent text-white outline-none text-lg" />
              <button onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} className="text-[#555] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#555] text-xs">Pressione ESC para fechar</p>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 print-hide" style={{ background: "rgba(17,17,17,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="relative w-32 h-8 md:w-40 md:h-10">
              <Image src="/logo-produza.png" alt="Produza" fill className="object-contain object-left" />
            </div>
            <div className="hidden lg:block text-[9px] text-[#555] tracking-widest uppercase">Marketing Pessoal · Influência · Crescimento</div>
          </div>

          <button className="md:hidden p-2 text-[#555] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden md:flex items-start gap-1 text-[11px] font-bold tracking-wider text-[#555] uppercase flex-nowrap justify-end">
            {navGroups.map((group, gIdx) => (
              <Fragment key={group.label}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    {group.items.map((item, i) => {
                      const idx = group.startIndex + i;
                      const isActive = currentScreen === idx;
                      return (
                        <Fragment key={item}>
                          <button
                            onClick={() => { setActivePlan(null); setCurrentScreen(idx); }}
                            className="px-2.5 py-1.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                            style={{
                              background: isActive ? "rgba(230,57,70,0.15)" : "transparent",
                              color: isActive ? "#e63946" : undefined,
                              border: isActive ? "1px solid rgba(230,57,70,0.3)" : "1px solid transparent",
                            }}
                          >
                            {item}
                          </button>
                          {i < group.items.length - 1 && <ChevronRight className="w-3 h-3 text-[#333] mx-0.5" />}
                        </Fragment>
                      );
                    })}
                  </div>
                  {group.items.length > 1 && (
                    <div className="w-[90%] mt-1 flex flex-col items-center">
                      <div className="w-full h-1.5 border-t border-l border-r border-[#2d2d2d] rounded-t-[2px]" />
                      <div className="text-[8px] text-[#444] font-bold tracking-widest mt-0.5">{group.label}</div>
                    </div>
                  )}
                </div>
                {gIdx < navGroups.length - 1 && (
                  <div className="pt-2"><ChevronRight className="w-3 h-3 text-[#333]" /></div>
                )}
              </Fragment>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full py-4 px-6 flex flex-col gap-3" style={{ background: "rgba(17,17,17,0.97)", borderBottom: "1px solid #2d2d2d" }}>
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <div className="text-[9px] text-[#e63946] font-bold tracking-widest uppercase mb-1">{group.label}</div>
                {group.items.map((item, i) => {
                  const idx = group.startIndex + i;
                  return (
                    <button key={item} onClick={() => { setActivePlan(null); setCurrentScreen(idx); setIsMobileMenuOpen(false); }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
                      style={{ color: currentScreen === idx ? "#e63946" : "#666", background: currentScreen === idx ? "rgba(230,57,70,0.1)" : "transparent" }}>
                      {item}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="h-[2px]" style={{ background: "#1e1e1e" }}>
          <div className="h-full progress-bar" style={{ width: `${((currentScreen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
      </header>

      {/* ── NAV DOTS ── */}
      <div className="fixed bottom-12 md:bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 print-hide">
        {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
          <button key={i} onClick={() => { setActivePlan(null); setCurrentScreen(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: currentScreen === i ? "28px" : "6px",
              height: "6px",
              background: currentScreen === i ? "#e63946" : "#333",
            }} />
        ))}
      </div>

      {/* ── FOOTER COPYRIGHT ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 text-center text-[8px] md:text-[10px] text-[#555] tracking-widest uppercase font-sans px-4 py-3 print-footer transition-all duration-300 hover:text-[#888] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4"
        style={{ background: "rgba(10,10,10,0.9)", borderTop: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
        <span>© 2008–2026 PRODUZA | PROLAB</span>
        <span className="hidden md:inline text-[#333]">·</span>
        <span>Neuromarketing e Tecnologia</span>
        <span className="hidden md:inline text-[#333]">·</span>
        <span>CNPJ: 36.312.373/0001-45</span>
      </div>

      {/* ── SCREENS CONTAINER ── */}
      <div className="w-full max-w-6xl flex-1 mt-24 mb-16 px-4 md:px-6 flex items-center justify-center relative" style={{ minHeight: "calc(100vh - 140px)" }}>

        {/* NAV ARROWS */}
        <button onClick={prevScreen}
          className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 print-hide"
          style={{ background: "#1e1e1e", border: "1px solid #2d2d2d", opacity: currentScreen === 0 ? 0.2 : 0.8 }}>
          <ChevronLeft className="w-5 h-5 text-[#888]" />
        </button>
        <button onClick={nextScreen}
          className="fixed right-2 md:right-20 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 print-hide"
          style={{ background: currentScreen === TOTAL_SCREENS - 1 ? "#1e1e1e" : "#e63946", border: "1px solid #2d2d2d", opacity: currentScreen === TOTAL_SCREENS - 1 ? 0.3 : 1 }}>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* ══════════════════════════════════════════════════════════════
            TELA 0 — CAPA
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 0 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase mb-10 animate-fade-in-up"
              style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", color: "#e63946" }}>
              <Flame className="w-3.5 h-3.5" /> Projeto Exclusivo · Produza × Felipe
            </div>

            {/* Main title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-4 animate-slide-up"
              style={{ fontFamily: "var(--font-playfair)", animationDelay: "100ms" }}>
              <span className="animate-shine-white drop-shadow-sm pb-2 inline-block">
                De Empresário
              </span>
              <br />
              <span className="animate-shimmer drop-shadow-md" style={{ fontStyle: "italic" }}>
                a Referência
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#666] max-w-2xl leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              Um projeto estratégico de <span className="text-[#aaa]">marketing pessoal</span> para transformar
              a história do Felipe num ativo de <span className="text-[#aaa]">influência e impacto real</span> no Brasil.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              {[
                { value: "#1", label: "iFood Nordeste", sub: "Pizzaria líder" },
                { value: "5+", label: "Redes de Pizzaria", sub: "Em expansão" },
                { value: "SP", label: "Chegando em São Paulo", sub: "Escala nacional" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl py-6 px-4 text-center transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 hover:bg-[#1f1f1f] hover:border-[#e63946]/30 hover:shadow-[0_20px_40px_rgba(230,57,70,0.15)] relative overflow-hidden group" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#e63946]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}>{stat.value}</div>
                  <div className="relative z-10 text-[11px] font-bold text-[#e63946] uppercase tracking-wide mb-0.5">{stat.label}</div>
                  <div className="relative z-10 text-[10px] text-[#444] uppercase tracking-wider group-hover:text-[#888] transition-colors">{stat.sub}</div>
                </div>
              ))}
            </div>

            <button onClick={nextScreen}
              className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold tracking-wider uppercase text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] animate-fade-in-up"
              style={{ background: "linear-gradient(135deg, #e63946, #c62828)", animationDelay: "400ms" }}>
              Começar a Apresentação <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 1 — SOBRE FELIPE
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">01 · Sobre o Cliente</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter"
              style={{ fontFamily: "var(--font-playfair)" }}>
              A <span className="text-[#e63946]">história</span> que<br />vale ouro.
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light">Toda grande marca pessoal começa com uma grande história.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Timeline */}
              <div className="space-y-4">
                {[
                  { icon: "🍕", title: "Começou do Zero", desc: "Sem herança, sem atalhos. Apenas visão, coragem e muito trabalho." },
                  { icon: "✈️", title: "Viajou e Morou no Canadá", desc: "Absorveu uma visão de mundo diferente. Trouxe isso de volta para o Brasil." },
                  { icon: "🔥", title: "Abriu a Primeira Pizzaria", desc: "Transformou experiência em empreendimento. E fez dar certo." },
                  { icon: "🏆", title: "Líder no iFood no Nordeste", desc: "Não é sorte — é sistema, consistência e produto de qualidade." },
                  { icon: "🚀", title: "Expandindo para São Paulo", desc: "De Fortaleza para o maior mercado do Brasil. A história ainda está sendo escrita." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                    <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <div className="text-white font-bold text-sm mb-0.5">{item.title}</div>
                      <div className="text-[#555] text-xs leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote + values */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl p-8 flex-1" style={{ background: "rgba(230,57,70,0.07)", border: "1px solid rgba(230,57,70,0.15)" }}>
                  <div className="text-[#e63946] text-4xl font-black mb-4" style={{ fontFamily: "var(--font-playfair)" }}>"</div>
                  <p className="text-[#ccc] text-xl font-light leading-relaxed italic mb-6">
                    Eu sempre disse que quero ajudar as pessoas a mudarem de vida. Tenho esse coração.
                  </p>
                  <div className="text-[#555] text-[11px] font-bold tracking-widest uppercase">— Felipe · Empresário e fundador</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Heart, label: "Coração Amistoso", desc: "Conecta com as pessoas" },
                    { icon: BarChart3, label: "Perfil Analítico", desc: "Quer entender o porquê" },
                    { icon: Trophy, label: "Mentalidade de Líder", desc: "Foco em resultado" },
                    { icon: Sparkles, label: "Histórica Inspiradora", desc: "Matéria-prima de influência" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="rounded-xl p-4" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                      <Icon className="w-5 h-5 text-[#e63946] mb-2" />
                      <div className="text-white font-bold text-xs mb-0.5">{label}</div>
                      <div className="text-[#444] text-[10px]">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 2 — OPORTUNIDADE
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">02 · Pesquisa de Mercado</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter"
              style={{ fontFamily: "var(--font-playfair)" }}>
              O mercado está<br /><span className="text-[#e63946]">pronto</span> para você.
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light">Dados reais. Oportunidade concreta. Hora certa.</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: TrendingUp, value: "+280%", label: "Crescimento de Influenciadores Food", highlight: true,
                  desc: "Nicho de gastronomia e negócios foi o que mais cresceu em audiência e monetização nos últimos 2 anos.",
                  source: "Meta Business · 2025"
                },
                {
                  icon: Users, value: "48M", label: "Empreendedores no Brasil",
                  desc: "Público ansioso por histórias reais de sucesso. Felipe tem o que poucos têm: autenticidade + resultado comprovado.",
                  source: "SEBRAE · 2025"
                },
                {
                  icon: Globe, value: "R$ 9Bi", label: "Mercado de Creators no Brasil",
                  desc: "O Brasil é o 2º maior mercado de influenciadores do mundo. E o nicho de negócios ainda tem poucos nomes fortes.",
                  source: "ANBIMA / Kantar · 2025"
                },
              ].map((card, i) => (
                <div key={i} className={`rounded-2xl p-8 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-default ${card.highlight ? "red-glow" : ""}`}
                  style={{
                    background: card.highlight ? "rgba(230,57,70,0.1)" : "#1a1a1a",
                    border: card.highlight ? "1px solid rgba(230,57,70,0.35)" : "1px solid #242424"
                  }}>
                  <card.icon className={`w-8 h-8 mb-5 ${card.highlight ? "text-[#e63946]" : "text-[#444]"}`} />
                  <div className={`text-4xl md:text-5xl font-black mb-2 tracking-tighter ${card.highlight ? "text-[#e63946]" : "text-white"}`}
                    style={{ fontFamily: "var(--font-playfair)" }}>{card.value}</div>
                  <div className="text-white font-bold text-sm mb-3 uppercase tracking-wide">{card.label}</div>
                  <p className="text-[#555] text-sm leading-relaxed mb-4">{card.desc}</p>
                  <div className="text-[10px] text-[#333] font-mono tracking-wider border-t border-[#222] pt-3">FONTE: {card.source}</div>
                </div>
              ))}
            </div>

            {/* Bottom insight */}
            <div className="rounded-2xl p-6 flex items-center gap-6" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
              <div className="w-2 h-16 rounded-full flex-shrink-0" style={{ background: "#e63946" }} />
              <div>
                <div className="text-white font-bold mb-1">A janela de oportunidade está aberta agora.</div>
                <div className="text-[#555] text-sm">Criadores do nicho food + business ainda não dominaram o Nordeste e São Paulo simultaneamente.
                  Felipe tem a história, o resultado e o timing perfeito para se tornar referência nacional.</div>
              </div>
              <div className="hidden md:flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-lg text-[#e63946] font-bold text-xs tracking-widest uppercase"
                style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)" }}>
                <Zap className="w-4 h-4" /> Agora
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 3 — DIAGNÓSTICO
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">03 · Diagnóstico</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Onde você está <span className="text-[#555]">vs.</span><br /><span className="text-[#e63946]">onde pode chegar.</span>
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light">Diagnóstico honesto. Potencial real.</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Current state */}
              <div className="rounded-2xl p-8" style={{ background: "#1a1a1a", border: "1px solid #2d2d2d" }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#555]" />
                  <span className="text-[#555] text-xs font-bold tracking-widest uppercase">Situação Atual</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Presença Digital", value: 20, desc: "Sem estratégia de marca pessoal estruturada" },
                    { label: "Autoridade Online", value: 15, desc: "Reconhecimento local mas não nacional" },
                    { label: "Conteúdo Estratégico", value: 10, desc: "Ausência de calendário editorial e narrativa" },
                    { label: "Monetização da Influência", value: 5, desc: "Potencial inexplorado de parcerias e mentorias" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[#888] text-sm font-medium">{item.label}</span>
                        <span className="text-[#444] text-xs">{item.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "#242424" }}>
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, background: "#3d3d3d" }} />
                      </div>
                      <div className="text-[#333] text-[10px] mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Produza */}
              <div className="rounded-2xl p-8" style={{ background: "rgba(230,57,70,0.07)", border: "1px solid rgba(230,57,70,0.2)" }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
                  <span className="text-[#e63946] text-xs font-bold tracking-widest uppercase">Com a Produza</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Presença Digital", value: 90, desc: "Identidade, site, redes e estratégia consolidada" },
                    { label: "Autoridade Online", value: 85, desc: "Referência nacional no nicho food & business" },
                    { label: "Conteúdo Estratégico", value: 95, desc: "Calendário editorial com narrativa de alto impacto" },
                    { label: "Monetização da Influência", value: 80, desc: "Parcerias, palestras, cursos e mentorias ativos" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[#ccc] text-sm font-medium">{item.label}</span>
                        <span className="text-[#e63946] text-xs font-bold">{item.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "rgba(230,57,70,0.15)" }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: currentScreen === 3 ? `${item.value}%` : "0%", background: "linear-gradient(90deg, #c62828, #e63946, #ff6b6b)", boxShadow: "0 0 8px rgba(230,57,70,0.5)" }} />
                      </div>
                      <div className="text-[#555] text-[10px] mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 4 — METODOLOGIA
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">04 · Metodologia</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Como a <span className="text-[#e63946]">Produza</span><br />trabalha.
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light">Um processo testado. Uma entrega comprovada.</p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { step: "01", icon: Search, title: "Consultoria & Diagnóstico", desc: "Entendemos sua história, valores, público ideal e posicionamento. Definimos o arquétipo da sua marca pessoal." },
                { step: "02", icon: ShieldCheck, title: "Identidade & Estratégia", desc: "Criamos a base visual, o tom de voz, o posicionamento de nicho e o plano de conteúdo que vai te representar." },
                { step: "03", icon: Camera, title: "Execução & Conteúdo", desc: "Produzimos, editamos e publicamos tudo com precisão. Posts, stories, vídeos, site — cada peça com propósito." },
                { step: "04", icon: TrendingUp, title: "Crescimento & Métricas", desc: "Monitoramos, ajustamos e escalamos. Cada decisão baseada em dados. Cada ação com retorno mensurável." },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-6 group transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <div className="text-[11px] font-black text-[#e63946] tracking-widest mb-4">{item.step}</div>
                  <item.icon className="w-7 h-7 text-[#333] mb-4 group-hover:text-[#e63946] transition-colors duration-300" />
                  <div className="text-white font-bold text-sm mb-2 leading-tight">{item.title}</div>
                  <p className="text-[#444] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Differentials */}
            <div className="rounded-2xl p-6" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
              <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-5">Por que a Produza?</div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Award, title: "Especialistas em Pessoas", desc: "Não fazemos só marketing de empresa. Fazemos marcas pessoais com profundidade e intenção." },
                  { icon: Target, title: "Estratégia Antes da Criação", desc: "Todo conteúdo tem um porquê. Toda ação tem um objetivo. Nenhuma peça é produzida no piloto automático." },
                  { icon: PlayCircle, title: "Entrega Rápida e Comprovada", desc: "Clientes como Rudinei (B2B), Martins Monster (e-commerce) e outros receberam resultados reais." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="w-5 h-5 text-[#e63946] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white text-sm font-bold mb-1">{title}</div>
                      <div className="text-[#444] text-xs leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 5 — ECOSSISTEMA
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 5 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">05 · Ecossistema</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Cada pilar<br /><span className="text-[#e63946]">tem um papel.</span>
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light">Clique em cada item para entender o impacto.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, title: "Identidade Visual", desc: "A cara da sua marca.", detail: "Logo, paleta, tipografia e avatar que posicionam você como referência no nicho — não como mais um perfil do Instagram." },
                { icon: Globe, title: "Site Pessoal", desc: "Sua sede na internet.", detail: "Um hub com sua história, conquistas, contatos para mídia e clientes. Profissionalismo que se vê antes da conversa." },
                { icon: Camera, title: "Conteúdo & Reels", desc: "Sua voz amplificada.", detail: "Roteiros, edição e publicação estratégica de conteúdo que gera autoridade, seguidores e oportunidades." },
                { icon: Mic2, title: "Podcast", desc: "A profundidade da sua visão.", detail: "Episódios sobre empreendedorismo, franchising e vida real. O formato que mais fideliza audiência no Brasil em 2025." },
                { icon: MessageCircle, title: "Comunidade & Mentoria", desc: "Sua maior monetização.", detail: "Transforme conhecimento em renda. Grupo VIP, imersões presenciais ou mentorias online para quem quer o seu caminho." },
                { icon: Star, title: "Parcerias & Assessoria", desc: "Sua projeção nacional.", detail: "Colocamos seu nome em portais, podcasts e eventos. Quem conhece sua história, quer você no palco." },
              ].map((item, i) => (
                <div key={i} className="group rounded-2xl p-6 cursor-default transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 relative overflow-hidden"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ background: "linear-gradient(90deg, transparent, #e63946, transparent)" }} />
                  <item.icon className="w-7 h-7 text-[#333] mb-4 group-hover:text-[#e63946] transition-colors duration-300" />
                  <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                  <div className="text-[#444] text-xs mb-3">{item.desc}</div>
                  <div className="text-[#555] text-[11px] leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-24 overflow-hidden">
                    {item.detail}
                  </div>
                  <div className="text-[10px] text-[#e63946] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                    Passe o mouse para ver mais
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 6 — PLANO INFLUENCIADOR PRO
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 6 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <PlanSlide plan={PLAN_DETAILS.influenciador} planNumber="01" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 7 — PLANO AUTORIDADE
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 7 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <PlanSlide plan={PLAN_DETAILS.autoridade} planNumber="02" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 8 — PLANO PRESENÇA
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 8 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <PlanSlide plan={PLAN_DETAILS.presenca} planNumber="03" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TELA 9 — CONTRATAR
        ══════════════════════════════════════════════════════════════ */}
        <div className={`screen-slide absolute inset-0 flex flex-col items-center justify-center p-6 pb-20 overflow-y-auto transition-all duration-700 ${currentScreen === 9 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`}>
          <div className="w-full max-w-6xl">
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">10 · Próximo Passo</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tighter text-center"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Pronto para<br /><span className="text-[#e63946]">começar?</span>
            </h2>
            <p className="text-[#555] text-lg mb-10 font-light text-center">Escolha um plano e vamos construir o seu legado juntos.</p>

            {/* Comparison table */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {Object.entries(PLAN_DETAILS).reverse().map(([key, plan]) => (
                <div key={key} className="rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: plan.highlight ? "rgba(230,57,70,0.1)" : "#1a1a1a",
                    border: plan.highlight ? "1px solid rgba(230,57,70,0.35)" : "1px solid #242424",
                  }}>
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white mb-3"
                      style={{ background: "#e63946" }}>
                      <Star className="w-3 h-3" /> MAIS ESCOLHIDO
                    </div>
                  )}
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? "text-[#e63946]" : "text-[#555]"}`}>{plan.name}</div>
                  <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{plan.price}</div>
                  <div className="text-[#444] text-xs mb-4">{plan.installment}</div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-[#555] text-xs">{plan.delivery}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {plan.items.slice(0, 4).map((item) => (
                      <div key={item.label} className="flex items-start gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-[#e63946]" : "text-[#333]"}`} />
                        <span className="text-[#666] text-[11px] leading-tight">{item.label}</span>
                      </div>
                    ))}
                    {plan.items.length > 4 && (
                      <div className="text-[#444] text-[11px] pl-5">+ {plan.items.length - 4} entregáveis incluídos</div>
                    )}
                  </div>
                  <a href="https://wa.me/5548414179938?text=Oi!%20Vi%20a%20proposta%20do%20Felipe%20e%20quero%20contratar%20o%20plano%20" target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl text-center font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: plan.highlight ? "linear-gradient(135deg, #e63946, #c62828)" : "transparent",
                      color: plan.highlight ? "#fff" : "#555",
                      border: plan.highlight ? "none" : "1px solid #2d2d2d",
                    }}>
                    Contratar {plan.name} →
                  </a>
                </div>
              ))}
            </div>

            {/* CTA block */}
            <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "rgba(230,57,70,0.07)", border: "1px solid rgba(230,57,70,0.15)" }}>
              <div>
                <div className="text-white font-bold text-xl mb-1">Ficou com alguma dúvida?</div>
                <div className="text-[#555] text-sm">Fale diretamente com a equipe Produza. Sem compromisso.</div>
              </div>
              <a href="https://wa.me/5548414179938?text=Oi!%20Vi%20a%20proposta%20do%20Felipe%20e%20quero%20conversar." target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold tracking-wider uppercase text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
                style={{ background: "linear-gradient(135deg, #e63946, #c62828)" }}>
                <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// ══════════════════════════════════════════════════════════════
// PLAN SLIDE COMPONENT
// ══════════════════════════════════════════════════════════════
type PlanData = { name: string; tagline: string; price: string; installment: string; delivery: string; highlight: boolean; colorClass: string; accentClass: string; badgeBg: string; items: PlanItem[]; };
function PlanSlide({ plan, planNumber }: { plan: PlanData; planNumber: string }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">
        {String(Number(planNumber) + 5).padStart(2, "0")} · Plano {planNumber}
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left - Plan info */}
        <div className="md:col-span-2 flex flex-col">
          {plan.highlight && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white mb-4 self-start"
              style={{ background: "#e63946" }}>
              <Star className="w-3 h-3" /> MAIS RECOMENDADO
            </div>
          )}

          <h2 className="text-5xl md:text-6xl font-black text-white mb-2 leading-none tracking-tighter"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {plan.name}
          </h2>
          <p className="text-[#555] text-base mb-8">{plan.tagline}</p>

          {/* Price */}
          <div className="rounded-2xl p-6 mb-6"
            style={{
              background: plan.highlight ? "rgba(230,57,70,0.1)" : "#1a1a1a",
              border: plan.highlight ? "1px solid rgba(230,57,70,0.3)" : "1px solid #242424"
            }}>
            <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-2">Investimento</div>
            <div className={`text-4xl font-black mb-1 ${plan.highlight ? "text-[#e63946]" : "text-white"}`}
              style={{ fontFamily: "var(--font-playfair)" }}>
              {plan.price}
            </div>
            <div className="text-[#444] text-xs mb-4">PIX à vista · {plan.installment}</div>
            <div className="flex items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid #2d2d2d" }}>
              <Clock className="w-4 h-4 text-[#555]" />
              <span className="text-[#555] text-sm">Entrega em {plan.delivery}</span>
            </div>
            <div className="text-[#444] text-xs">após envio do briefing</div>
          </div>

          <a href="https://wa.me/5548414179938?text=Quero%20contratar%20o%20plano" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
            style={{ background: plan.highlight ? "linear-gradient(135deg, #e63946, #c62828)" : "#1a1a1a", border: plan.highlight ? "none" : "1px solid #2d2d2d", color: plan.highlight ? "#fff" : "#555" }}>
            <MessageCircle className="w-4 h-4" /> Contratar este plano
          </a>
        </div>

        {/* Right - Deliverables */}
        <div className="md:col-span-3">
          <div className="text-[11px] text-[#555] font-bold tracking-widest uppercase mb-4">
            Entregáveis — {plan.items.length} itens incluídos
          </div>
          <div className="space-y-3">
            {plan.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl p-4 group transition-all duration-300 hover:scale-[1.01]"
                style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-[#e63946]" : "text-[#333]"} group-hover:text-[#e63946] transition-colors`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider text-white"
                        style={{ background: plan.highlight ? "#e63946" : "#2d2d2d" }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[#444] text-xs mt-0.5 leading-relaxed">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
