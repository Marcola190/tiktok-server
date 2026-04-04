const express = require("express");
const app = express();

app.use(express.json());

// 🔥 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// 🔥 WEBHOOK DO MERCADO PAGO (ESSA FALTAVA)
app.post("/webhook", (req, res) => {

  console.log("💰 PAGAMENTO RECEBIDO:");
  console.log(req.body);

  // aqui depois vamos liberar no Firebase automático

  res.sendStatus(200);
});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});