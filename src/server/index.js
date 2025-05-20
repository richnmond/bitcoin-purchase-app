const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/price", async (req, res) => {
  const resp = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
  const data = await resp.json();
  res.json(data);
});

app.post("/purchase", (req, res) => {
  // mock purchase processing
  console.log("User purchase:", req.body);
  res.json({ status: "success" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
