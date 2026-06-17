"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, ArrowLeft, Zap, Target, Shield, HeartPulse } from "lucide-react";
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
        // Modo demonstração (fallback se não tiver Firebase configurado)
        setTimeout(() => {
          setData({
            answers: {
              q1_origin: "Ambição: O desejo incontrolável de crescer",
              q5_archetype: "O Guerreiro",
              q9_balance: 30,
              q10_quote: "Vencer não é opção, é obrigação.",
              q3_product: ["Gestão de Franquias", "Sobrevivência de Restaurantes"],
              q7_virtue: "Pela minha Visão Estratégica"
            },
            calculatedMetrics: {
              energyLevel: 80,
              commercialScore: 90,
              resilienceScore: 95,
              diag: "Felipe tem um perfil forte e pronto para monetização agressiva. Como O Guerreiro, ele é movido pelo desafio."
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
        } else {
          console.error("Relatório não encontrado");
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

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e63946] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12 relative z-10">
        <Link href="/briefing" className="flex items-center gap-2 text-[#555] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="relative w-24 h-6">
          <Image src="/logo-produza.png" alt="Produza" fill className="object-contain object-right opacity-50" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Coluna Esquerda: Diagnóstico e Arquétipo */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className={`transition-all duration-1000 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Mapa do <span className="text-[#e63946]">Neurotipo</span>
            </h1>
            <p className="text-[#888] text-sm uppercase tracking-widest mb-8">Análise de IA Concluída</p>
            
            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e63946]/50 to-transparent opacity-50" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e63946]/10 flex items-center justify-center text-2xl border border-[#e63946]/20 shadow-[0_0_20px_rgba(230,57,70,0.2)] group-hover:scale-110 transition-transform">
                  🧠
                </div>
                <div>
                  <div className="text-[10px] text-[#e63946] font-bold uppercase tracking-widest">Diagnóstico Principal</div>
                  <div className="text-lg font-bold">Perfil Aprovado</div>
                </div>
              </div>
              
              <p className="text-[#a0a0a0] leading-relaxed text-sm">
                {calculatedMetrics.diag}
              </p>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative bg-gradient-to-b from-[#111] to-[#0a0a0a]">
              <div className="text-[10px] text-[#888] font-bold uppercase tracking-widest mb-6 text-center">Carta de Arquétipo</div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 animate-float">{answers.q5_archetype.includes("Sábio") ? "🦉" : answers.q5_archetype.includes("Cara") ? "🤝" : answers.q5_archetype.includes("Mágico") ? "🎩" : "⚔️"}</div>
                <h3 className="text-2xl font-black mb-2 text-white">{answers.q5_archetype}</h3>
                <p className="text-[#666] text-xs">O DNA da sua marca pessoal gravita em torno deste arquétipo, ditando o tom de voz e a atração magnética do seu público.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Coluna Direita: Infográficos e Barras */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <div className={`glass-panel p-8 md:p-10 rounded-3xl border border-white/5 transition-all duration-1000 delay-300 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Target className="w-5 h-5 text-[#e63946]" /> Performance Latente
            </h3>

            <div className="space-y-8">
              {/* Barra 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3 text-[#888]">
                  <span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-green-500" /> Tanque de Energia (Mental)</span>
                  <span className="text-white">{calculatedMetrics.energyLevel}%</span>
                </div>
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(74,222,128,0.5)]" 
                       style={{ width: animate ? `${calculatedMetrics.energyLevel}%` : "0%" }} />
                </div>
              </div>

              {/* Barra 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3 text-[#888]">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Potencial Comercial</span>
                  <span className="text-white">{calculatedMetrics.commercialScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(96,165,250,0.5)]" 
                       style={{ width: animate ? `${calculatedMetrics.commercialScore}%` : "0%" }} />
                </div>
              </div>

              {/* Barra 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3 text-[#888]">
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-purple-500" /> Resiliência / Casca Grossa</span>
                  <span className="text-white">{calculatedMetrics.resilienceScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(167,139,250,0.5)]" 
                       style={{ width: animate ? `${calculatedMetrics.resilienceScore}%` : "0%" }} />
                </div>
              </div>

            </div>
          </div>

          <div className={`glass-panel p-8 rounded-3xl border border-white/5 transition-all duration-1000 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h3 className="text-xl font-bold mb-6">A Balança: Impacto vs Lucro</h3>
            <div className="relative pt-6 pb-2">
              <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden border border-[#222] flex">
                <div className="h-full bg-gradient-to-r from-[#e63946] to-[#ff4d5a] transition-all duration-[1500ms] ease-out"
                     style={{ width: animate ? `${answers.q9_balance}%` : "0%" }} />
                <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-[1500ms] ease-out"
                     style={{ width: animate ? `${100 - answers.q9_balance}%` : "100%" }} />
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-[#e63946]">{answers.q9_balance}% Comercial</span>
                <span className="text-blue-500">{100 - answers.q9_balance}% Legado</span>
              </div>
            </div>
          </div>

          <div className={`glass-panel p-8 rounded-3xl border border-[#e63946]/20 bg-[#e63946]/5 transition-all duration-1000 delay-500 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-[10px] text-[#e63946] font-bold uppercase tracking-widest mb-2">Frase de Efeito</div>
            <p className="text-xl text-white font-light italic" style={{ fontFamily: "var(--font-playfair)" }}>
              "{answers.q10_quote}"
            </p>
          </div>

        </div>

      </div>

      <style jsx global>{`
        .glass-panel {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
