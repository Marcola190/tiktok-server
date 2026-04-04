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

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.post("/webhook", async (req, res) => {

  try {
    console.log("💰 PAGAMENTO:", req.body);

    const paymentId = req.body?.data?.id;

    if (!paymentId) return res.sendStatus(200);

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_TOKEN}`
        }
      }
    );

    const pagamento = response.data;

    console.log("🔎 DETALHES:", pagamento);

    if (pagamento.status !== "approved") {
      return res.sendStatus(200);
    }

    const email = pagamento.payer?.email;

    console.log("EMAIL:", email);

    if (!email) {
      console.log("❌ SEM EMAIL");
      return res.sendStatus(200);
    }

    await db.collection("users").doc(email).set({
      expira: Date.now() + (24 * 60 * 60 * 1000)
    }, { merge: true });

    console.log("🔥 LIBERADO:", email);

    res.sendStatus(200);

  } catch (err) {
    console.error("ERRO:", err.message);
    res.sendStatus(500);
  }

});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});