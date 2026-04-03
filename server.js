const express = require("express");
const mercadopago = require("mercadopago");
const admin = require("firebase-admin");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
app.use(express.json());

// 🔐 FIREBASE
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔐 MERCADO PAGO
mercadopago.configure({
  access_token: "APP_USR-3844650912716831-040313-d52df8a677925eae421301efd8bda6e7-527461417"
});

// 🔥 TIKTOK (MULTI USUÁRIO)
const conexoes = {};

// 🔥 CONECTAR TIKTOK
app.post("/connect-tiktok", async (req, res) => {
  const { username, uid } = req.body;

  const tiktok = new WebcastPushConnection(username);

  tiktok.connect().then(() => {
    console.log("✅ Conectado:", username);
  });

  tiktok.on("gift", async (data) => {
    console.log("🎁", data.giftName);

    await db.collection("eventos").add({
      gift: data.giftName,
      user: data.uniqueId,
      dono: uid,
      timestamp: Date.now()
    });
  });

  conexoes[uid] = tiktok;

  res.send({ status: "ok" });
});

// 🔥 CRIAR PAGAMENTO PIX
app.post("/create-payment", async (req, res) => {
  const { uid } = req.body;

  const payment_data = {
    transaction_amount: 5,
    description: "Acesso Game Roblox",
    payment_method_id: "pix",
    payer: {
      email: "teste@teste.com"
    },
    notification_url: "https://marcoladevgameshraanima.netlify.app/",
    metadata: {
      uid: uid
    }
  };

  const payment = await mercadopago.payment.create(payment_data);

  res.json({
    qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
    qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64
  });
});

// 🔥 WEBHOOK (LIBERA USUÁRIO)
app.post("/webhook", async (req, res) => {
  try {
    const payment = req.body.data;

    const result = await mercadopago.payment.findById(payment.id);

    if (result.body.status === "approved") {
      const uid = result.body.metadata.uid;

      await db.collection("users").doc(uid).set({
        paid: true
      }, { merge: true });

      console.log("🔥 LIBERADO:", uid);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("🔥 Server rodando"));