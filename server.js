const express = require("express");
const app = express();

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

// HOME
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// 🔥 WEBHOOK
app.post("/webhook", async (req, res) => {

  console.log("💰 PAGAMENTO RECEBIDO:");
  console.log(req.body);

  try {

    // ⚠️ PEGAR ID DO PAGAMENTO
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    // 👉 SIMULAÇÃO (depois podemos melhorar)
    // Como Mercado Pago não manda email direto aqui,
    // vamos usar fallback manual por enquanto

    console.log("Pagamento ID:", paymentId);

    // 🔥 AQUI VOCÊ PODE FUTURAMENTE CONSULTAR API DO MP

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});