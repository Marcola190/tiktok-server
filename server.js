<!DOCTYPE html>
<html>
<head>
<title>MARCOLADEVGAMES</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<style>
body {
  background: url("https://i.imgur.com/b97JmyJ.jpeg") no-repeat center center fixed;
  background-size: cover;
  color: white;
  text-align: center;
  font-family: Arial;
}

@keyframes glow {
  0% {box-shadow:0 0 10px #00ff88;}
  50% {box-shadow:0 0 40px #00ff88;}
  100% {box-shadow:0 0 10px #00ff88;}
}

@keyframes textGlow {
  0% {text-shadow:0 0 5px #00ff88;}
  50% {text-shadow:0 0 20px #00ff88;}
  100% {text-shadow:0 0 5px #00ff88;}
}

.home {
  margin-top:80px;
  padding:40px;
  border-radius:20px;
  width:90%;
  max-width:600px;
  margin:auto;
  border:1px solid #00ff88;
  animation: glow 2s infinite;
}

.titulo {
  animation: textGlow 2s infinite;
}

.login-btn, .neon-btn {
  background:#00ff88;
  padding:14px;
  border-radius:10px;
  border:none;
  font-weight:bold;
  cursor:pointer;
  margin:5px;
  animation: glow 2s infinite;
}

.card {
  padding:30px;
  border-radius:20px;
  width:90%;
  max-width:700px;
  margin:auto;
  margin-top:40px;
  background:rgba(0,0,0,0.85);
}

.planos {
  display:flex;
  justify-content:center;
  flex-wrap:wrap;
}

.plano {
  border:1px solid #00ff88;
  padding:20px;
  margin:10px;
  border-radius:15px;
  width:180px;
  animation: glow 2s infinite;
}

.preco {
  color:#00ff88;
  font-size:22px;
  font-weight:bold;
}
</style>
</head>

<body>

<h1 class="titulo">MARCOLADEVGAMES</h1>

<div id="home" class="home">
  <h2 class="titulo">🎮 Área do Streamer</h2>
  <button class="login-btn" onclick="login()">Login com Google</button>
</div>

<div id="painel" style="display:none;">
  <div class="card">

    <h2>Game Interativo Roblox</h2>
    <div id="status">🔒 Acesso bloqueado</div>

    <div class="planos">

      <div class="plano">
        <h3>🔥 Diário</h3>
        <div class="preco">R$ 12,00</div>
        <button onclick="comprar('dia')">Comprar</button>
      </div>

      <div class="plano">
        <h3>💎 Mensal</h3>
        <div class="preco">R$ 59,90</div>
        <button onclick="comprar('mes')">Comprar</button>
      </div>

      <div class="plano">
        <h3>🚀 Anual</h3>
        <div class="preco">R$ 525,40</div>
        <button onclick="comprar('ano')">Comprar</button>
      </div>

    </div>

    <br>

    <input id="robloxId" placeholder="Seu ID Roblox" disabled><br>
    <input id="tiktokUser" placeholder="@seu_tiktok" disabled><br>

    <button id="btnConectar" class="neon-btn" disabled>Conectar</button>

    <div id="admin" style="display:none; margin-top:30px;">
      <h3>🔧 ADMIN</h3>

      <input id="adminEmail" placeholder="Email do usuário"><br>

      <select id="adminPlano">
        <option value="dia">1 DIA</option>
        <option value="mes">MENSAL</option>
        <option value="ano">ANUAL</option>
      </select>

      <br><br>
      <button onclick="liberarManual()">LIBERAR</button>
    </div>

  </div>
</div>

<script>
const firebaseConfig = {
  apiKey: "AIzaSyDeXVPnwMHQPUrNj0upozFb45m_hVT2rng",
  authDomain: "marcoladevgames.firebaseapp.com",
  projectId: "marcoladevgames"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "unterawolfcontato@gmail.com";

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider).then(() => {
    document.getElementById("home").style.display = "none";
    document.getElementById("painel").style.display = "block";
  });
}

function comprar(plano){

  const user = auth.currentUser;

  if(!user){
    alert("Faça login primeiro");
    return;
  }

  const email = user.email;

  if(plano === "dia"){
    window.location.href = "https://mpago.la/2A9waDH?email=" + email;
  }

  if(plano === "mes"){
    window.location.href = "https://mpago.la/2CwS7FG?email=" + email;
  }

  if(plano === "ano"){
    window.location.href = "https://mpago.la/1YRYAc2?email=" + email;
  }
}

function liberarArea() {
  document.getElementById("status").innerText = "✅ Acesso liberado";
  document.getElementById("robloxId").disabled = false;
  document.getElementById("tiktokUser").disabled = false;
  document.getElementById("btnConectar").disabled = false;
}

function bloquearArea() {
  document.getElementById("status").innerText = "🔒 Acesso bloqueado";
}

function liberarManual(){

  const user = auth.currentUser;

  if(!user || user.email !== ADMIN_EMAIL){
    alert("Acesso negado");
    return;
  }

  const email = document.getElementById("adminEmail").value;
  const plano = document.getElementById("adminPlano").value;

  let tempo = 0;

  if(plano === "dia") tempo = 86400000;
  if(plano === "mes") tempo = 2592000000;
  if(plano === "ano") tempo = 31536000000;

  db.collection("users").doc(email).set({
    expira: Date.now() + tempo
  });

  alert("Liberado!");
}

auth.onAuthStateChanged((user) => {

  if (!user) return;

  if(user.email === ADMIN_EMAIL){
    document.getElementById("admin").style.display = "block";
  }

  db.collection("users").doc(user.email)
    .onSnapshot((doc) => {
      if (doc.exists && doc.data().expira > Date.now()) {
        liberarArea();
      } else {
        bloquearArea();
      }
    });

});
</script>

</body>
</html>