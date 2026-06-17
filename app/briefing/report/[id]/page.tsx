"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, ArrowLeft, Zap, Target, Heart, Lightbulb, Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ReportDashboard({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        setTimeout(() => {
          setData({
            answers: {
              q1_origin: "Ambição",
              q5_archetype: "O Guerreiro",
              q9_impact: "Criar oportunidade de vida digna",
              q10_personal: "Tempo de qualidade com família",
              q11_spiritual: "Fé inabalável em Deus",
              q12_balance: 70,
              q13_legacy: "Um império que emprega e transforma",
              q14_quote: "Quem trabalha com propósito...",
              q3_product: ["Gestão", "Vendas"],
              q7_virtue: "Visão Estratégica"
            },
            calculatedMetrics: {
              energyLevel: 80,
              commercialScore: 85,
              impactScore: 90,
              resilienceScore: 95,
              legacyAlignment: 85,
              diag: "Felipe é Guerreiro com propósito claro de impactar vidas.",
              archetype: "O Guerreiro"
            }
          });
          setLoading(false);
          setTimeout(() => setAnimate(true), 100);
        }, 1500);
        return;
      }

      try {
        const docRef = doc(db, "briefings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#e63946] animate-spin mb-4" />
        <p className="text-[#666] text-xs uppercase tracking-widest font-bold animate-pulse">Compilando Neurotipo...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <p>Relatório não encontrado.</p>
      </div>
    );
  }

  const { answers, calculatedMetrics } = data;
  const metrics = calculatedMetrics || {};

  const ScoreBar = ({ value, label, color }: any) => (
    <div className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold text-[#aaa] uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-[#e63946]">{value}%</span>
      </div>
      <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: animate ? `${value}%` : '0%' }} />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e63946] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-16 relative z-10">
        <Link href="/briefing" className="flex items-center gap-2 text-[#555] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <Image src="/logo-produza.png" alt="Produza" width={96} height={24} className="opacity-50" />
      </header>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* 1. TITLE & MAIN DIAGNOSIS */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500`}>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter" style={{ fontFamily: "var(--font-playfair)" }}>
            Mapa do <span className="text-[#e63946]">Neurotipo</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-[#666] mb-8">ANÁLISE DE IA CONCLUÍDA</p>

          <div className="bg-[#111] border border-[#333] rounded-2xl p-8 space-y-4">
            <h2 className="text-sm font-bold text-[#e63946] uppercase tracking-widest">Diagnóstico Principal</h2>
            <p className="text-lg text-[#ddd] leading-relaxed">{metrics.diag}</p>
          </div>
        </section>

        {/* 2. PERFORMANCE LATENTE (Scores) */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
              <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#e63946]" />
                Performance Latente
              </h2>
              <div className="space-y-6">
                <ScoreBar value={metrics.energyLevel || 0} label="🔋 Tanque de Energia" color="bg-gradient-to-r from-green-600 to-green-500" />
                <ScoreBar value={metrics.commercialScore || 0} label="⚡ Potencial Comercial" color="bg-gradient-to-r from-blue-600 to-blue-500" />
                <ScoreBar value={metrics.impactScore || 0} label="💎 Capacidade de Impacto" color="bg-gradient-to-r from-purple-600 to-purple-500" />
                <ScoreBar value={metrics.resilienceScore || 0} label="🛡️ Resiliência / Casca Grossa" color="bg-gradient-to-r from-orange-600 to-orange-500" />
                <ScoreBar value={metrics.legacyAlignment || 0} label="👑 Alinhamento com Legado" color="bg-gradient-to-r from-pink-600 to-pink-500" />
              </div>
            </div>

            {/* Arquétipo */}
            <div className="bg-[#111] border border-[#333] rounded-2xl p-8 flex flex-col justify-center">
              <h2 className="text-sm font-bold text-[#e63946] uppercase tracking-widest mb-6">Carta de Arquétipo</h2>
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {metrics.archetype?.includes("Guerreiro") ? "⚔️" : metrics.archetype?.includes("Sábio") ? "🦉" : "🤝"}
                </div>
                <h3 className="text-3xl font-black text-white mb-3">{metrics.archetype}</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  {metrics.archetype?.includes("Guerreiro") && "O DNA de sua marca gira em torno deste arquétipo: você supera desafios, o tom de voz é direto e a atração magnética é pelo seu poder de vencer."}
                  {metrics.archetype?.includes("Sábio") && "Seu poder está em ensinar. Você é o mentor que as pessoas buscam. Autoridade por conhecimento, não por bravata."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. NARRATIVA COMERCIAL CONSTRUÍDA */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-900`}>
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-[#e63946]" />
              Narrativa Comercial Construída
            </h2>
            <p className="text-[#ddd] leading-relaxed mb-4">
              Você não é apenas um empreendedor de sucesso. Você é alguém que <span className="font-semibold text-[#e63946]">constrói impérios que transformam vidas</span>.
            </p>
            <p className="text-[#ddd] leading-relaxed">
              Seu posicionamento como influenciador deve girar em torno disto: <span className="italic text-[#aaa]">"De zero para impacto: como dominar mercados saturados e criar estruturas que mudam pessoas, famílias e comunidades."</span>
            </p>
          </div>
        </section>

        {/* 4. MAPA DE CONTEÚDO RECOMENDADO */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-5 h-5 text-[#e63946]" />
              Mapa de Conteúdo Recomendado
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#333] rounded-lg p-5 bg-[#0a0a0a]">
                <h3 className="font-bold text-[#e63946] mb-3 text-sm uppercase">Pilar 1: Estrutura</h3>
                <p className="text-[#888] text-sm">Como escalar de 1 restaurante para N sem perder qualidade. Operação & Gestão de Franquias.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-5 bg-[#0a0a0a]">
                <h3 className="font-bold text-[#e63946] mb-3 text-sm uppercase">Pilar 2: Humanidade</h3>
                <p className="text-[#888] text-sm">Liderança que transforma. Como o seu caráter impactou funcionários, franqueados e comunidades.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-5 bg-[#0a0a0a]">
                <h3 className="font-bold text-[#e63946] mb-3 text-sm uppercase">Pilar 3: Legado</h3>
                <p className="text-[#888] text-sm">Além do lucro. A visão de criar oportunidade para gente real e mudar paradigmas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ANÁLISE DE CONTRADIÇÕES ESTRATÉGICAS */}
        {metrics.energyLevel && metrics.energyLevel < 50 && metrics.commercialScore && metrics.commercialScore > 70 && (
          <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
            <div className="bg-red-950/30 border border-red-500/50 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-3">
                ⚠️ Atenção: Contradição Estratégica
              </h2>
              <p className="text-[#ddd]">
                Seu tanque está em {metrics.energyLevel}%, mas sua ambição comercial é {metrics.commercialScore}%. Antes de viralizar como influenciador, você <span className="font-semibold">precisa estruturar um time</span> que tire o peso das operações. Influenciador sem delegação = garantia de burnout.
              </p>
            </div>
          </section>
        )}

        {/* 6. DIMENSÃO PESSOAL & ESPIRITUAL */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1100`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#e63946]" />
                Dimensão Pessoal
              </h2>
              <p className="text-[#888] text-sm mb-4 font-bold uppercase">Seu grande anseio:</p>
              <p className="text-[#ddd] leading-relaxed">{answers.q10_personal || "Equilíbrio entre sucesso e paz"}</p>
              <p className="text-[#666] text-xs mt-6 italic">Isso é seu ativo emocional. Mostrar que é possível prosperar E manter a família inteira é uma narrativa poderosa.</p>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                ✨ Dimensão Espiritual
              </h2>
              <p className="text-[#888] text-sm mb-4 font-bold uppercase">Seu entendimento:</p>
              <p className="text-[#ddd] leading-relaxed">{answers.q11_spiritual || "Busca por significado"}</p>
              <p className="text-[#666] text-xs mt-6 italic">
                {answers.q11_spiritual?.includes("Fé") && "Sua fé é um ativo. Não preguem, mas mostrem caráter. Isso ressoa mais que qualquer call-to-action."}
                {!answers.q11_spiritual?.includes("Fé") && "Use sua busca como ponte. Gente que deseja impacto identifica-se com propósito, não dogma."}
              </p>
            </div>
          </div>
        </section>

        {/* 7. ROADMAP DE 12 MESES */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1200`}>
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#e63946]" />
              Roadmap de 12 Meses
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-[#e63946] pl-6 py-3">
                <p className="text-sm font-bold text-[#e63946] uppercase">Mês 1-2: Estrutura de Vídeo & Posicionamento</p>
                <p className="text-[#888] text-sm">Identidade visual, tom de voz, primeira narrativa. Escolha 1 formato (Podcast, LinkedIn, ou Stories).</p>
              </div>
              <div className="border-l-2 border-[#999] pl-6 py-3">
                <p className="text-sm font-bold text-[#ccc] uppercase">Mês 3-4: Primeiros Conteúdos & Teste</p>
                <p className="text-[#888] text-sm">8-12 vídeos exploratórios. Mede: qual tema ressoa mais? Qual formato funciona?</p>
              </div>
              <div className="border-l-2 border-[#999] pl-6 py-3">
                <p className="text-sm font-bold text-[#ccc] uppercase">Mês 5-8: Aceleração & Comunidade</p>
                <p className="text-[#888] text-sm">Rotina consistente. Primeiros "fãs fiéis" aparecem. Começa a conversa (comentários, mensagens).</p>
              </div>
              <div className="border-l-2 border-[#999] pl-6 py-3">
                <p className="text-sm font-bold text-[#ccc] uppercase">Mês 9-12: Monetização & Estrutura</p>
                <p className="text-[#888] text-sm">Primeira oferta (workshop, masterclass, mentoria). Você tem base sólida para escalar. Agora entra a máquina.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TIPO DE PÚBLICO IDEAL */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1300`}>
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Target className="w-5 h-5 text-[#e63946]" />
              Seu Tipo de Público Ideal
            </h2>
            <p className="text-[#ddd] leading-relaxed mb-4">
              Seu público <span className="font-semibold text-[#e63946]">NÃO é qualquer empreendedor</span>. Você atrai:
            </p>
            <ul className="space-y-3 text-[#888]">
              <li className="flex gap-3">
                <span className="text-[#e63946]">▸</span>
                <span><span className="font-semibold text-[#ddd]">Franqueados em dúvida:</span> que querem um modelo que funcione, não teoria</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e63946]">▸</span>
                <span><span className="font-semibold text-[#ddd]">Restauradores que acham difícil:</span> enxergam em você a prova de que é possível</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e63946]">▸</span>
                <span><span className="font-semibold text-[#ddd]">Gente que quer aprender pelo exemplo:</span> não por slides, mas por histórias reais que machucam e depois crescem</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e63946]">▸</span>
                <span><span className="font-semibold text-[#ddd]">Pessoas buscando equilíbrio:</span> que sonham prosperar sem perder a alma</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 9. NEXT STEP - PROPOSAL ALERT */}
        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1400`}>
          <div className="bg-gradient-to-r from-[#e63946] to-[#c62828] rounded-2xl p-10 border border-[#e63946]/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-3">Parabéns, Felipe!</h2>
                <p className="text-white/95 leading-relaxed mb-4">
                  Temos agora <span className="font-bold">todas as informações necessárias</span> para fechar seu projeto orçamentário e desenhar a estratégia perfeita para você.
                </p>
                <p className="text-white/90 leading-relaxed">
                  <span className="block mb-3">Em alguns instantes, você receberá as <span className="font-bold">opções de proposta</span> para esse novo momento profissional da sua vida — com um <span className="font-bold">neuromarketing pessoal de alto valor</span>.</span>
                  <span className="block text-sm text-white/80 italic">Fique atento ao seu e-mail. A proposta é personalizada baseada neste diagnóstico.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FILOSOFIA DE VIDA */}        <section className={`${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1500 pb-12`}>
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8 text-center">
            <p className="text-[#666] text-xs uppercase tracking-widest font-bold mb-4">Sua Filosofia</p>
            <p className="text-2xl md:text-3xl font-black text-white italic leading-relaxed">
              "{answers.q14_quote || "Quem trabalha de verdade não tem tempo de ter sorte."}"
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
