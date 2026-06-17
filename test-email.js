const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const answers = {
  q1_origin: "Sobrevivência: Precisava mudar de vida urgente",
  q2_enemy: ["Mentiras e 'Gurus' de palco sem resultado real", "Acomodação e preguiça mental das pessoas"],
  q3_product: ["O Poder do iFood e Vendas Delivery", "Gestão e Escalabilidade de Franquias"],
  q4_energy: "Bateria 100%: Voando alto e com equilíbrio",
  q5_archetype: "O Mágico",
  q6_stage: "🎙️ Em um Podcast/Mesa redonda (Papo profundo)",
  q7_virtue: "Pela minha Visão Estratégica (eu sei para onde estamos indo)",
  q8_fear: "Falar alguma besteira ou ser mal interpretado ('Cancelamento')",
  q9_balance: 70,
  q10_quote: "Não existe sorte, existe trabalho bem feito enquanto ninguém está olhando."
};

const telemetry = {
  device: "Mobile",
  os: "iOS",
  resolution: "390x844",
  totalTimeSeconds: 124,
  reloads: 0,
  timePerStep: { 0: 5, 1: 12, 2: 15, 3: 8, 4: 20, 5: 10, 6: 14, 7: 15, 8: 10, 9: 15 }
};

const energyLevel = 90;
const commercialScore = 85; 
const resilienceScore = 95; 

const diag = "Felipe tem um perfil forte e pronto para monetização agressiva. Como Arquétipo 'O Mágico', ele transforma caos em estrutura e lucro. Possui bateria cheia e visão estratégica clara.";

const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #111111; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background: #111111; padding: 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px;">Mapeamento de <span style="color: #e63946;">Neurotipo</span></h1>
    <p style="color: #888888; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Cliente: Felipe</p>
  </div>

  <div style="padding: 40px;">
    <!-- Resumo Analítico -->
    <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">1. Diagnóstico da IA Produza</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #333333; background: #f9f9f9; padding: 20px; border-left: 4px solid #e63946; border-radius: 0 8px 8px 0;">
      ${diag}
    </p>

    <!-- Gráficos de Barra -->
    <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-top: 40px;">2. Infográfico de Performance</h2>
    
    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #555;">
        <span>Tanque de Energia (Saúde Mental)</span>
        <span style="float: right;">${energyLevel}%</span>
      </div>
      <div style="background: #eeeeee; height: 10px; border-radius: 5px; overflow: hidden; clear: both;">
        <div style="background: ${energyLevel > 60 ? '#10b981' : energyLevel > 30 ? '#f59e0b' : '#ef4444'}; width: ${energyLevel}%; height: 100%;"></div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #555;">
        <span>Potencial Comercial (Produtos)</span>
        <span style="float: right;">${commercialScore}%</span>
      </div>
      <div style="background: #eeeeee; height: 10px; border-radius: 5px; overflow: hidden; clear: both;">
        <div style="background: #3b82f6; width: ${commercialScore}%; height: 100%;"></div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #555;">
        <span>Resiliência (História/Origem)</span>
        <span style="float: right;">${resilienceScore}%</span>
      </div>
      <div style="background: #eeeeee; height: 10px; border-radius: 5px; overflow: hidden; clear: both;">
        <div style="background: #8b5cf6; width: ${resilienceScore}%; height: 100%;"></div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #555;">
        <span>Balança: Monetização vs Impacto</span>
        <span style="float: right;">${answers.q9_balance < 50 ? 'Mais Comercial' : 'Mais Legado'} (${answers.q9_balance}/100)</span>
      </div>
      <div style="background: #111111; height: 10px; border-radius: 5px; overflow: hidden; clear: both;">
        <div style="background: #e63946; width: ${answers.q9_balance}%; height: 100%;"></div>
      </div>
    </div>

    <!-- Dados Completos -->
    <h2 style="font-size: 14px; color: #e63946; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-top: 40px;">3. Perfil de Marca</h2>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 35%;">Origem (Raiz)</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q1_origin}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Arquétipo Base</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q5_archetype}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Virtude (Caráter)</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q7_virtue}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">O Palco (Formato)</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q6_stage}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Medo (Freio)</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q8_fear}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">O "Inimigo"</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q2_enemy.join(' / ')}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Potenciais Palestras</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #111;">${answers.q3_product.join('<br>')}</td></tr>
    </table>

    <div style="background: #111111; color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; font-style: italic;">
      "${answers.q10_quote}"
    </div>

    <!-- Telemetria -->
    <h2 style="font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 50px;">4. Telemetria do Usuário</h2>
    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 12px; color: #666; font-family: monospace;">
      Dispositivo: ${telemetry.device} | OS: ${telemetry.os} | Resolução: ${telemetry.resolution}<br>
      Tempo Total: ${telemetry.totalTimeSeconds} segundos | Recarregamentos: ${telemetry.reloads}<br>
      Tempos por tela: ${Object.entries(telemetry.timePerStep).map(([k,v]) => `Q${k}:${v}s`).join(', ')}
    </div>

  </div>
</div>
`;

async function send() {
  console.log("Sending email to neuropsicobiomed@gmail.com...");
  const { data, error } = await resend.emails.send({
    from: 'Produza ProLab <admin@inpb.com.br>',
    to: ['neuropsicobiomed@gmail.com'],
    subject: '🔥 DIAGNÓSTICO (TESTE): Neurotipo de Felipe',
    html: htmlContent,
  });

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Data:", data);
  }
}

send();
