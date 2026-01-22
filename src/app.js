const express = require("express");
const morgan = require("morgan");

const webhookRoutes = require("./routes/webhook.routes");
const apiRoutes = require("./routes/api.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/webhook", webhookRoutes);
app.use("/api", apiRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
