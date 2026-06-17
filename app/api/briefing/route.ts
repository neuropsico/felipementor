import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { answers, telemetry } = data;

    const energyLevel = answers.q4_energy.includes("100%") ? 90 : answers.q4_energy.includes("reserva") ? 50 : 20;
    const commercialScore = answers.q3_product.length > 0 ? 85 : 40; 
    const resilienceScore = 95; 
    
    let diag = "Felipe tem um perfil forte e pronto para monetização agressiva.";
    if (energyLevel < 40) {
      diag = "Felipe está no limite (Burnout Risk). O projeto de influenciador precisa de uma equipe que tire o peso dele, senão ele não grava.";
    } else if (answers.q5_archetype.includes("Sábio")) {
      diag = "Felipe possui perfil forte de Mentor. O foco primário do lançamento deve ser educacional e infoprodutos high-ticket.";
    } else if (answers.q5_archetype.includes("Guerreiro")) {
      diag = "Felipe é movido pelo desafio. A narrativa deve focar em como ele dominou o iFood no Nordeste e as batalhas que venceu.";
    }

    const calculatedMetrics = {
      energyLevel,
      commercialScore,
      resilienceScore,
      diag
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
          <a href="http://localhost:3000/briefing/report/${reportId}" style="display: inline-block; margin-top: 20px; background: #e63946; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">VER DASHBOARD COMPLETO</a>
        </div>

        <div style="padding: 40px;">
          <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">1. Diagnóstico da IA Produza</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333333; background: #f9f9f9; padding: 20px; border-left: 4px solid #e63946; border-radius: 0 8px 8px 0;">
            ${diag}
          </p>

          <!-- O resto do HTML foi omitido aqui para manter o código limpo, já que o foco é o redirecionamento para o dashboard -->
          <p style="color: #666; font-size: 14px;">As respostas completas e o gráfico de performance detalhado estão disponíveis no painel web. Clique no botão vermelho acima para acessar o relatório animado.</p>
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
