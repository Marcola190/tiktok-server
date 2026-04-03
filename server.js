app.post("/create-payment", async (req, res) => {
  try {
    const { uid, plano } = req.body;

    let valor = 1;
    let dias = 1;

    if (plano === "mes") {
      valor = 10;
      dias = 30;
    }

    if (plano === "ano") {
      valor = 50;
      dias = 365;
    }

    const payment_data = {
      transaction_amount: valor,
      description: "Plano " + plano,
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      },
      notification_url: "https://tiktok-server-434n.onrender.com/webhook",
      metadata: {
        uid: uid,
        dias: dias
      }
    };

    const payment = await mercadopago.payment.create(payment_data);

    // 🔥 ISSO QUE FALTAVA
    res.json({
      url: payment.body.point_of_interaction.transaction_data.ticket_url
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Erro pagamento");
  }
});