const express = require("express");
const app = express();

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

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

    // ⚠️ COMO NÃO TEM EMAIL AQUI
    // vamos liberar TEMPORÁRIO pra todos logados

    const snapshot = await db.collection("users").get();

    const tempo = 1 * 24 * 60 * 60 * 1000; // 1 DIA

    snapshot.forEach(async (doc) => {
      await db.collection("users").doc(doc.id).set({
        expira: Date.now() + tempo,
        plano: "auto"
      }, { merge: true });
    });

    console.log("🔥 ACESSO LIBERADO AUTOMATICAMENTE (1 DIA)");

    res.sendStatus(200);

  } catch (err) {
    console.error("ERRO:", err);
    res.sendStatus(500);
  }

});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});