const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// 🔥 WEBHOOK MERCADO PAGO (FUTURO)
app.post("/webhook", (req, res) => {
  console.log("Pagamento recebido:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});