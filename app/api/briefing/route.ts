import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { answers, telemetry } = data;

    // Scoring baseado nas 14 perguntas
    const energyLevel = answers.q4_energy.includes("100%") ? 90 : answers.q4_energy.includes("reserva") ? 50 : 20;
    const commercialScore = answers.q3_product.length > 0 ? 85 : 40;
    const impactScore = answers.q9_impact ? 80 : 60;
    const resilienceScore = answers.q11_spiritual.includes("Fé") || answers.q11_spiritual.includes("significado") ? 95 : 75;
    const legacyAlignment = answers.q12_balance > 50 ? 90 : 60;

    // Narrativa contextualizada
    let diag = "Felipe é um empreendedor com visão holística — quer crescer E impactar.";

    // Análise por dimensão
    const isHighBurnout = energyLevel < 40;
    const isMentorArchetype = answers.q5_archetype.includes("Sábio");
    const isWarriorArchetype = answers.q5_archetype.includes("Herói") || answers.q5_archetype.includes("Guerreiro");
    const hasClearImpact = answers.q9_impact && answers.q9_impact.length > 0;
    const leaksTowardLegacy = answers.q12_balance > 60;

    if (isHighBurnout) {
      diag = "⚠️ ATENÇÃO: Seu tanque está baixo. Antes de escalar como influenciador, estruture um time que tire o peso. Influenciador sem delegação = garantia de burnout.";
    } else if (isMentorArchetype && hasClearImpact) {
      diag = "Felipe é um Mentor com propósito claro. Seu melhor caminho é educação + transformação. Infoprodutos, masterclasses e comunidades são seu playground.";
    } else if (isWarriorArchetype) {
      diag = "Felipe é um Guerreiro que adora o desafio. Sua narrativa deve contar as batalhas reais: de zero com iFood, dominando o Nordeste, escalando para SP. Controvérsia saudável é seu ativo.";
    }

    // Cruzar impacto com espiritualidade
    if (answers.q11_spiritual.includes("Fé")) {
      diag += " Sua fé é um ativo. Use isso na narrativa — não para pregar, mas para mostrar o caráter.";
    }

    if (leaksTowardLegacy) {
      diag += " Você está pronto para transcender negócio e pensar legado. Isso ressoa mais que sales.";
    }

    const calculatedMetrics = {
      energyLevel,
      commercialScore,
      impactScore,
      resilienceScore,
      legacyAlignment,
      diag,
      archetype: answers.q5_archetype,
      balance: answers.q12_balance,
      legacy: answers.q13_legacy,
      philosophy: answers.q14_quote
    };

    let reportId = `felipe-${Date.now()}`; // fallback ID

    // Tenta salvar no Firebase se estiver configurado
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        const docRef = await addDoc(collection(db, "briefings"), {
          answers,
          telemetry,
          calculatedMetrics,
          createdAt: new Date().toISOString()
        });
        reportId = docRef.id;
      } else {
        console.warn("Firebase não configurado no .env.local. Usando ID gerado localmente para o teste.");
      }
    } catch (dbError) {
      console.error("Erro ao salvar no Firebase:", dbError);
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #111111; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        
        <div style="background: #111111; padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px;">Mapeamento de <span style="color: #e63946;">Neurotipo</span></h1>
          <p style="color: #888888; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Cliente: Felipe</p>
          <a href="https://felipementor.vercel.app/briefing/report/${reportId}" style="display: inline-block; margin-top: 20px; background: #e63946; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">VER DASHBOARD COMPLETO</a>
        </div>

        <div style="padding: 40px;">
          <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">1. Diagnóstico Principal</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #333333; background: #f9f9f9; padding: 20px; border-left: 4px solid #e63946; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
            ${diag}
          </p>

          <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">2. Performance Latente</h2>
          <div style="margin-top: 20px; space-y: 15px;">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; font-weight: bold; text-transform: uppercase;">🔋 Tanque de Energia</p>
              <div style="background: #f0f0f0; border-radius: 6px; height: 8px; overflow: hidden;">
                <div style="background: #27ae60; height: 100%; width: ${energyLevel}%;"></div>
              </div>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">${energyLevel}% — ${energyLevel > 75 ? 'Ótimo' : energyLevel > 50 ? 'Moderado' : 'Crítico'}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; font-weight: bold; text-transform: uppercase;">⚡ Potencial Comercial</p>
              <div style="background: #f0f0f0; border-radius: 6px; height: 8px; overflow: hidden;">
                <div style="background: #3498db; height: 100%; width: ${commercialScore}%;"></div>
              </div>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">${commercialScore}% — Pronto para monetizar</p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; font-weight: bold; text-transform: uppercase;">💎 Capacidade de Impacto</p>
              <div style="background: #f0f0f0; border-radius: 6px; height: 8px; overflow: hidden;">
                <div style="background: #9b59b6; height: 100%; width: ${impactScore}%;"></div>
              </div>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">${impactScore}% — Transformação real de vidas</p>
            </div>
          </div>

          <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">3. Seu Arquétipo</h2>
          <p style="font-size: 15px; color: #444; margin-top: 15px; font-weight: bold;">
            ${answers.q5_archetype}
          </p>

          <p style="color: #999; font-size: 13px; margin-top: 20px; font-style: italic;">
            O dashboard completo com análises de narrativa comercial, roadmap de 12 meses, e recomendações de parcerias estratégicas está disponível no painel web.
          </p>
        </div>
      </div>
    `;

    // Tenta enviar o e-mail via Resend
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Produza ProLab <admin@inpb.com.br>',
          to: ['neuropsicobiomed@gmail.com'],
          subject: '🔥 Novo Diagnóstico de Neurotipo - Felipe',
          html: htmlContent,
        });
      }
    } catch (emailError) {
      console.error("Erro ao enviar e-mail via Resend:", emailError);
    }

    return NextResponse.json({ success: true, reportId });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
