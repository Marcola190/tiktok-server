const { WebcastPushConnection } = require('tiktok-live-connector');
const admin = require("firebase-admin");

// 🔐 FIREBASE KEY
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 SEU TIKTOK (SEM @)
const username = "horadeanimaia";

const tiktok = new WebcastPushConnection(username);

// 🚀 CONECTAR
tiktok.connect().then(() => {
  console.log("✅ Conectado ao TikTok:", username);
}).catch(err => {
  console.error("❌ Erro ao conectar:", err);
});

// 🎁 EVENTO DE PRESENTE
tiktok.on('gift', async (data) => {
  console.log("🎁 Presente recebido:", data.giftName);

  try {
    await db.collection("gifts").add({
      user: data.uniqueId,
      gift: data.giftName,
      timestamp: new Date()
    });

    console.log("💾 Salvo no Firebase!");
  } catch (error) {
    console.error("❌ Erro ao salvar:", error);
  }
});