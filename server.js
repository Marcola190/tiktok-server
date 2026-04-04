const express = require("express");
const axios = require("axios");
const app = express();

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

// 🔑 COLOCA SEU TOKEN AQUI
const MP_TOKEN = "APP_USR-3844650912716831-040313-d52df8a677925eae421301efd8bda6e7-527461417";

// 🔥 HOME
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// 🔥 WEBHOOK MERCADO PAGO
app.post("/webhook", async (req, res) => {

  console.log("💰 PAGAMENTO RECEBIDO:");
  console.log(req.body);

  try {

    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    // 🔥 BUSCA DETALHES DO PAGAMENTO NO MERCADO PAGO
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_TOKEN}`
        }
      }
    );

    const payment = response.data;

    console.log("🔎 DETALHES:", payment);

    // ✅ PEGA EMAIL DO COMPRADOR
    const email = payment?.payer?.email;

    if (!email) {
      console.log("❌ EMAIL NÃO ENCONTRADO");
      return res.sendStatus(200);
    }

    // ⏱️ LIBERA 1 DIA AUTOMÁTICO
    const tempo = 1 * 24 * 60 * 60 * 1000;

    await db.collection("users").doc(email).set({
      expira: Date.now() + tempo,
      plano: "auto"
    }, { merge: true });

    console.log("🔥 LIBERADO PARA:", email);

    res.sendStatus(200);

  } catch (err) {
    console.error("ERRO:", err.response?.data || err.message);
    res.sendStatus(500);
  }

});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});