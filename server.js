const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Payment } = require('mercadopago');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Configuração Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({ 
    accessToken: "APP_USR-3844650912716831-040313-d52df8a677925eae421301efd8bda6e7-527461417" 
});
const payment = new Payment(client);

app.get("/", (req, res) => {
  res.send("Servidor TikTok Game Rodando 🚀");
});

app.post("/webhook", async (req, res) => {
  try {
    // 1. Responde IMEDIATAMENTE pro Mercado Pago para evitar o "carregando" infinito
    res.sendStatus(200); 

    const { body } = req;
    const paymentId = body?.data?.id;

    // Verifica se é uma notificação de pagamento
    if (body.type === "payment" || body.action?.includes("payment")) {
      
      if (!paymentId) return;

      // 2. Busca os detalhes usando a SDK v2
      const data = await payment.get({ id: paymentId });
      
      console.log(`🔎 Status do Pagamento ${paymentId}: ${data.status}`);

      if (data.status === "approved") {
        // 🚨 O PULO DO GATO: Use o external_reference ou o ID do pagamento se o email falhar
        // No seu site, ao criar o pagamento, envie o ID do usuário do TikTok no 'external_reference'
        const userId = data.external_reference || data.payer?.email;

        if (!userId) {
          console.log("❌ Não foi possível identificar o usuário (sem email ou external_reference)");
          return;
        }

        // 3. Salva no Firebase
        await db.collection("users").doc(userId).set({
          status: "gold",
          pago: true,
          paymentId: paymentId,
          expira: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }, { merge: true });

        console.log("🔥 GAME LIBERADO PARA:", userId);
      }
    }

  } catch (err) {
    console.error("❌ ERRO NO WEBHOOK:", err.message);
    // Não enviamos erro aqui pois já demos o sendStatus(200) lá em cima
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor bombando na porta ${PORT}`);
});