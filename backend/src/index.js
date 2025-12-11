import express from "express";
import cors from "cors";
import usuarios from "./rutas/usuarios.js";

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());

console.log("CARGÓ INDEX NUEVO");

app.get("/", (req, res) => {
  res.send("API funcionando");
});


app.use("/usuarios", usuarios);

app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`);
});
