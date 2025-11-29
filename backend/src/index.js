const express = require("express");
const usuarios = require("./rutas/usuarios.js");

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/usuarios", usuarios);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});