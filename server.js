const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔥 FIREBASE
const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🚨 WEBHOOK MERCADO PAGO
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("💰 PAGAMENTO RECEBIDO:", data);

    // ⚠️ SIMULAÇÃO (depois refinamos)
    const email = data?.payer?.email || "teste@gmail.com";

    const agora = Date.now();

    // ⏳ DEFINE TEMPO DO PLANO (AJUSTAR DEPOIS)
    let tempo = 1 * 24 * 60 * 60 * 1000; // 1 dia

    await db.collection("users").doc(email).set({
      expira: agora + tempo
    });

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// 🎮 AÇÃO ROBLOX
app.post("/acao", (req, res) => {
  const tipo = req.body.tipo;

  console.log("🎮 AÇÃO RECEBIDA:", tipo);

  // 👉 aqui depois conecta com Roblox

  res.send("ok");
});

app.listen(3000, () => console.log("🚀 Server rodando"));