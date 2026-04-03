const { WebcastPushConnection } = require('tiktok-live-connector');
const admin = require('firebase-admin');

// 🔐 FIREBASE KEY (VAMOS CONFIGURAR DEPOIS)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 MUDA AQUI PRO SEU @
const username = "horadeanimaia";

const tiktok = new WebcastPushConnection(username);

tiktok.connect().then(() => {
  console.log("✅ Conectado ao TikTok:", username);
});

// 🎁 EVENTO DE PRESENTE
tiktok.on('gift', async (data) => {
  console.log("🎁 Presente recebido:", data.giftName);

  await db.collection("eventos").add({
    gift: data.giftName,
    user: data.uniqueId,
    timestamp: Date.now()
  });
});