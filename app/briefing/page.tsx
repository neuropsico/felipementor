"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Check, Send, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useTelemetry } from "./useTelemetry";

const TOTAL_STEPS = 16; // 0 = Intro, 1-14 = Qs, 15 = Final

type AnswersState = {
  q1_origin: string;
  q2_enemy: string[];
  q3_product: string[];
  q4_energy: string;
  q5_archetype: string;
  q6_stage: string;
  q7_virtue: string;
  q8_fear: string;
  q9_impact: string;
  q10_personal: string;
  q11_spiritual: string;
  q12_balance: number;
  q13_legacy: string;
  q14_quote: string;
};

export default function BriefingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { recordStepChange, finalizeTelemetry } = useTelemetry();
  const router = useRouter();

  const [answers, setAnswers] = useState<AnswersState>({
    q1_origin: "",
    q2_enemy: [],
    q3_product: [],
    q4_energy: "",
    q5_archetype: "",
    q6_stage: "",
    q7_virtue: "",
    q8_fear: "",
    q9_impact: "",
    q10_personal: "",
    q11_spiritual: "",
    q12_balance: 50,
    q13_legacy: "",
    q14_quote: "",
  });

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      recordStepChange(currentStep);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      recordStepChange(currentStep);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSingleSelect = (field: keyof AnswersState, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setTimeout(nextStep, 350);
  };

  const handleMultiSelect = (field: keyof AnswersState, value: string, max: number = 2) => {
    setAnswers(prev => {
      const currentArr = (prev[field] as string[]) || [];
      if (currentArr.includes(value)) {
        return { ...prev, [field]: currentArr.filter(v => v !== value) };
      } else {
        if (currentArr.length >= max) return prev; // Limit reached
        return { ...prev, [field]: [...currentArr, value] };
      }
    });
  };

  const handleSubmit = async () => {
    recordStepChange(currentStep);
    setIsSubmitting(true);
    setError("");
    const telemetry = finalizeTelemetry();

    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, telemetry }),
      });
      if (!res.ok) throw new Error("Falha ao enviar");
      
      const responseData = await res.json();
      setSubmitted(true);
      
      // Redirect with a small delay for UX
      setTimeout(() => {
        router.push(`/briefing/report/${responseData.reportId}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard support (Enter only advances on non-select steps)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentStep > 0 && currentStep < TOTAL_STEPS - 1) {
        if (currentStep === 9 || currentStep === 10) nextStep(); // Slider & Text
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#e63946] rounded-full opacity-[0.05] blur-[80px]" />
        <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center animate-zoom-in relative z-10" style={{ border: "1px solid rgba(230,57,70,0.2)" }}>
          <div className="w-16 h-16 rounded-full bg-[#e63946]/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#e63946]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Gerando Dashboard...</h2>
          <p className="text-[#888] text-sm leading-relaxed mb-6">Mapeamento concluído. Redirecionando para o seu relatório analítico do Neurotipo...</p>
          <Loader2 className="w-6 h-6 text-[#e63946] animate-spin mx-auto" />
        </div>
      </main>
    );
  }

  // Helper renderer for steps
  const renderStep = (stepIndex: number, content: React.ReactNode) => {
    const isActive = currentStep === stepIndex;
    const isPast = currentStep > stepIndex;
    return (
      <div className={`transition-all duration-700 absolute w-full inset-x-0 flex flex-col justify-center px-6 max-h-[80vh] overflow-y-auto pb-24
        ${isActive ? "opacity-100 translate-x-0 z-10" : isPast ? "opacity-0 -translate-x-12 pointer-events-none z-0" : "opacity-0 translate-x-12 pointer-events-none z-0"}`}>
        {content}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#111] text-[#d0d0d0] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% -20%, rgba(230,57,70,0.08) 0%, transparent 80%)" }} />

      <header className="w-full pt-8 pb-4 px-6 md:px-12 flex flex-col gap-6 z-20">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div className="relative w-28 h-7">
            <Image src="/logo-produza.png" alt="Produza" fill className="object-contain object-left" />
          </div>
          <div className="text-[10px] font-bold tracking-widest text-[#555] uppercase">
            {currentStep > 0 && currentStep < TOTAL_STEPS - 1 ? `Passo ${currentStep} de 14` : "Briefing"}
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto h-1 bg-[#222] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#c62828] to-[#e63946] transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (TOTAL_STEPS - 1)) * 100}%` }} />
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 py-4 md:py-12 max-w-2xl mx-auto w-full z-10 relative">

        {/* 0. Intro */}
        {renderStep(0,
          <>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: "var(--font-playfair)" }}>
              Olá, <span className="text-[#e63946]">Felipe</span>.
            </h1>
            <div className="space-y-4 mb-10">
              <p className="text-base text-[#ddd] leading-relaxed">
                Esse é um grande momento, onde vamos desenvolver um projeto super especial. Em nossas conversas e mentorias não foi difícil perceber que você não é apenas um empreendedor de sucesso; claramente você quer <span className="text-[#e63946] font-semibold">transformar vidas</span> e impactar pessoas reais, famílias, funcionários e comunidades.
              </p>
              <p className="text-base text-[#ddd] leading-relaxed">
                Este briefing é o grande primeiro passo de um novo posicionamento para a sua jornada. Ele vai além de números e negócios; vamos mapear sua essência, origem, valores, impacto humano, dimensão espiritual e pessoal, para gradualmente lançá-lo como uma figura de influência na internet. Isso certamente atrairá aqueles que precisam ser atraídos pela sua história.
              </p>
              <p className="text-base text-[#999] leading-relaxed">
                O diagnóstico que você receberá será um resumo de tudo que trataremos, mas será tão único quanto a sua jornada.
              </p>
              <p className="text-sm text-[#666] italic">
                14 perguntas. Completamente honestas. Leva 5 minutos.
              </p>
            </div>
            <button onClick={nextStep} className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 rounded-xl text-white font-bold tracking-wider uppercase text-sm transition-all bg-[#e63946] hover:bg-[#c62828]">
              Iniciar Mapeamento <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* 1. Origem */}
        {renderStep(1, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">1. A Raiz</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Qual foi o combustível principal que te fez sair do zero?</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🛡️", val: "Sobrevivência: Precisava mudar de vida urgente" },
                { icon: "🦅", val: "Liberdade: Não nasci para ter chefe ou limite" },
                { icon: "🔥", val: "Ambição: O desejo incontrolável de crescer" },
                { icon: "👁️", val: "Visão: Eu via coisas que os outros não viam" }
              ].map(opt => (
                <button key={opt.val} onClick={() => handleSingleSelect("q1_origin", opt.val)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center gap-2 group
                    ${answers.q1_origin === opt.val ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className={`text-sm ${answers.q1_origin === opt.val ? "text-white font-semibold" : "text-[#888]"}`}>{opt.val}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 2. O Inimigo (Multi) */}
        {renderStep(2, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">2. O Inimigo Comum</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">O que mais te irrita no mercado hoje?</h2>
            <p className="text-[#555] text-xs mb-6 uppercase tracking-wider">Selecione até 2 opções</p>
            <div className="space-y-3">
              {[
                "Mentiras e 'Gurus' de palco sem resultado real",
                "Acomodação e preguiça mental das pessoas",
                "Falta de gestão e amadorismo nos negócios",
                "Produtos ruins vendidos como se fossem bons"
              ].map(opt => {
                const isSelected = answers.q2_enemy.includes(opt);
                return (
                  <button key={opt} onClick={() => handleMultiSelect("q2_enemy", opt, 2)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group
                      ${isSelected ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border
                      ${isSelected ? "border-[#e63946] bg-[#e63946]" : "border-[#555] group-hover:border-[#888]"}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm md:text-base ${isSelected ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                  </button>
                )
              })}
            </div>
            {answers.q2_enemy.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#222] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider transition-all">Avançar <ArrowRight className="w-4 h-4" /></button>
              </div>
            )}
          </>
        )}

        {/* 3. O Produto Oculto (Multi) */}
        {renderStep(3, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">3. O Produto Oculto</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Se você fosse dar uma Imersão/Mentoria, sobre o que seria?</h2>
            <p className="text-[#555] text-xs mb-6 uppercase tracking-wider">Selecione as 2 principais</p>
            <div className="space-y-3">
              {[
                "O Poder do iFood e Vendas Delivery",
                "Gestão e Escalabilidade de Franquias",
                "Liderança e Mentalidade Empreendedora",
                "Operação, Custos e Sobrevivência de Restaurantes"
              ].map(opt => {
                const isSelected = answers.q3_product.includes(opt);
                return (
                  <button key={opt} onClick={() => handleMultiSelect("q3_product", opt, 2)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group
                      ${isSelected ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border
                      ${isSelected ? "border-[#e63946] bg-[#e63946]" : "border-[#555] group-hover:border-[#888]"}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm md:text-base ${isSelected ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                  </button>
                )
              })}
            </div>
            {answers.q3_product.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#222] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider transition-all">Avançar <ArrowRight className="w-4 h-4" /></button>
              </div>
            )}
          </>
        )}

        {/* 4. Saúde Mental */}
        {renderStep(4, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">4. O Tanque de Energia</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Como empreendedor acelerado, como está sua saúde mental?</h2>
            <div className="space-y-3">
              {[
                { label: "Bateria 100%: Voando alto e com equilíbrio", color: "border-green-500/50" },
                { label: "Na reserva, mas rodando: Cansado, mas não paro", color: "border-yellow-500/50" },
                { label: "No limite: Quase um burnout, preciso delegar mais", color: "border-red-500/50" }
              ].map(opt => (
                <button key={opt.label} onClick={() => handleSingleSelect("q4_energy", opt.label)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4
                    ${answers.q4_energy === opt.label ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <div className={`w-3 h-3 rounded-full border ${opt.color} bg-current ${answers.q4_energy === opt.label ? "text-[#e63946]" : "text-transparent"}`} />
                  <span className={`text-sm md:text-base ${answers.q4_energy === opt.label ? "text-white font-semibold" : "text-[#888]"}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 5. Arquétipo */}
        {renderStep(5, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">5. Identidade & Arquétipo</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Com qual destas figuras você mais se identifica no dia a dia?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⚔️", title: "O Herói/Guerreiro", desc: "Supera desafios, foco em vencer." },
                { icon: "🦉", title: "O Sábio/Professor", desc: "Aprende, ensina, guia os outros." },
                { icon: "🤝", title: "O Cara Comum", desc: "Humilde, trabalhador, do povo." },
                { icon: "🎩", title: "O Mágico", desc: "Transforma caos em estrutura e ouro." }
              ].map(opt => (
                <button key={opt.title} onClick={() => handleSingleSelect("q5_archetype", opt.title)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center gap-2
                    ${answers.q5_archetype === opt.title ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className="text-4xl mb-1">{opt.icon}</span>
                  <span className={`text-sm font-bold ${answers.q5_archetype === opt.title ? "text-white" : "text-[#aaa]"}`}>{opt.title}</span>
                  <span className="text-[10px] text-[#666] leading-tight">{opt.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 6. Formato de Conteúdo */}
        {renderStep(6, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">6. O Palco Ideal</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Onde você se sente mais poderoso e confortável comunicando?</h2>
            <div className="space-y-3">
              {[
                "🎙️ Em um Podcast/Mesa redonda (Papo profundo)",
                "🏟️ Num palco para 1000 pessoas (Energia alta)",
                "📱 Nos Stories dentro do carro (Bastidores realistas)",
                "💼 Numa reunião fechada 1 a 1 (Mentoria premium)"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q6_stage", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 group
                    ${answers.q6_stage === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q6_stage === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 7. A Virtude */}
        {renderStep(7, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">7. O Caráter</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Seus franqueados e funcionários te respeitam mais por qual motivo?</h2>
            <div className="space-y-3">
              {[
                "Pelo meu Senso de Justiça e Honestidade inabalável",
                "Pela minha Visão Estratégica (eu sei para onde estamos indo)",
                "Pelo meu Coração Humano (eu escuto e ajudo eles)",
                "Pela minha Fome de Crescimento e Lucro (eu puxo todo mundo)"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q7_virtue", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 group
                    ${answers.q7_virtue === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${answers.q7_virtue === opt ? "border-[#e63946]" : "border-[#555]"}`}>
                    {answers.q7_virtue === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#e63946]" />}
                  </div>
                  <span className={`text-sm md:text-base ${answers.q7_virtue === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 8. Vulnerabilidade */}
        {renderStep(8, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">8. O Freio</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">O que te dá mais "receio" na alta exposição digital?</h2>
            <div className="space-y-3">
              {[
                "Haters e críticas vazias de quem não construiu nada",
                "Perder a privacidade e o tempo com a minha família",
                "Falar alguma besteira ou ser mal interpretado ('Cancelamento')",
                "Não ter tempo para gravar e administrar tudo isso"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q8_fear", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 group
                    ${answers.q8_fear === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q8_fear === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 9. Impacto Humano */}
        {renderStep(9,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">9. O Impacto Humano</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Qual seria o seu maior sonho em termos de transformação de vidas?</h2>
            <p className="text-[#666] text-sm mb-6">Não empresarial, pessoal. Real.</p>
            <div className="space-y-3">
              {[
                "Criar oportunidade de vida digna para gente que não teve chance",
                "Curar feridas emocionais e psicológicas em pessoas que conheco",
                "Estruturar comunidades inteiras para prosperar juntas",
                "Ser referência espiritual e de caráter para a próxima geração"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q9_impact", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4
                    ${answers.q9_impact === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q9_impact === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 10. Vida Pessoal */}
        {renderStep(10,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">10. A Vida Pessoal</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">O que você mais deseja equilibrar na sua vida pessoal?</h2>
            <div className="space-y-3">
              {[
                "Tempo de qualidade com família sem culpa",
                "Saúde física e mental duradoura",
                "Relacionamentos profundos e verdadeiros",
                "Descanso mental e repouso genuíno"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q10_personal", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4
                    ${answers.q10_personal === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q10_personal === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 11. Espiritualidade */}
        {renderStep(11,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">11. A Dimensão Espiritual</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Qual é seu entendimento sobre propósito e espiritualidade?</h2>
            <div className="space-y-3">
              {[
                "Fé inabalável em Deus e no plano divino",
                "Busca constante por significado e conexão",
                "Prático: resultado e caráter falam mais que religião",
                "Ainda explorando, mas sinto que há algo maior"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q11_spiritual", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4
                    ${answers.q11_spiritual === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q11_spiritual === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 12. Balança Comercial (Slider) */}
        {renderStep(12, 
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">12. A Balança da Vida</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">Qual a sua balança ideal entre Negócio e Humanidade?</h2>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 relative">
              <input
                type="range" min="0" max="100" step="10"
                value={answers.q12_balance}
                onChange={e => setAnswers(prev => ({...prev, q12_balance: parseInt(e.target.value)}))}
                className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#e63946]"
              />
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mt-6">
                <span className={answers.q12_balance < 50 ? "text-[#e63946]" : "text-[#555]"}>100% Lucro & Crescimento</span>
                <span className={answers.q12_balance > 50 ? "text-[#e63946]" : "text-[#555]"}>100% Impacto & Legado</span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-bold uppercase tracking-wider transition-all">Avançar <ArrowRight className="w-4 h-4" /></button>
            </div>
          </>
        )}

        {/* 10. A Frase (Text) */}
        {/* 13. Legado */}
        {renderStep(13,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">13. O Legado</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Quando olhar para trás, qual legado quer deixar?</h2>
            <div className="space-y-3">
              {[
                "Um império de negócios que emprega e transforma pessoas",
                "Uma família unida e pessoas ao meu redor impactadas",
                "Conhecimento compartilhado que inspira gerações",
                "Equilíbrio: sucesso profissional e paz pessoal/espiritual"
              ].map(opt => (
                <button key={opt} onClick={() => handleSingleSelect("q13_legacy", opt)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4
                    ${answers.q13_legacy === opt ? "border-[#e63946] bg-[#e63946]/10" : "border-[#333] bg-[#1a1a1a] hover:border-[#555]"}`}>
                  <span className={`text-sm md:text-base ${answers.q13_legacy === opt ? "text-white font-semibold" : "text-[#888]"}`}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 14. A Filosofia (Text) */}
        {renderStep(14,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">14. A Filosofia</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Qual é a frase, filosofia ou princípio que rege sua vida?</h2>
            <p className="text-[#666] text-sm mb-6">Algo que você vive todos os dias. Não precisa ser bonito, só precisa ser verdadeiro.</p>

            <textarea
              value={answers.q14_quote}
              onChange={(e) => setAnswers(prev => ({ ...prev, q14_quote: e.target.value }))}
              placeholder="Escreva naturalmente do seu jeito..."
              className="w-full h-32 bg-[#1a1a1a] border border-[#333] rounded-xl p-5 text-white focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition-all outline-none resize-none"
            />
            <div className="mt-6 flex justify-end">
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#e63946] hover:bg-[#c62828] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                Finalizar Diagnóstico <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* 15. Final Submit */}
        {renderStep(15,
          <>
            <div className="text-[11px] font-bold text-[#e63946] tracking-widest uppercase mb-3">Pronto!</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tudo consolidado.</h2>
            <p className="text-[#888] text-sm leading-relaxed mb-10">
              Obrigado pela sinceridade, Felipe. Com essas 14 respostas, cruzaremos seu Neurotipo, impacto humano, espiritualidade e visão de legado para gerar um diagnóstico que vai além de negócio — vai fundo na sua essência.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-500/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-bold tracking-widest uppercase text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_40px_rgba(230,57,70,0.2)]"
              style={{ background: "linear-gradient(135deg, #e63946, #c62828)" }}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Infográfico e Enviando...</>
              ) : (
                <>Enviar Dados e Ver Resultados <Send className="w-4 h-4" /></>
              )}
            </button>
          </>
        )}

      </div>

      {/* Persistent Navigation Footer */}
      <div className={`fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 transition-all duration-300 ${currentStep === 0 || currentStep >= TOTAL_STEPS - 1 ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <button onClick={prevStep} className="flex items-center gap-2 text-[#666] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333]">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <button onClick={nextStep} className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333]">
          Pular <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
