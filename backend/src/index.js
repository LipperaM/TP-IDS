import express from "express";
import cors from "cors";
import usuarios from "./rutas/usuarios.js";
import posts from "./rutas/posts.js";
import comentarios from "./rutas/comentarios.js";


const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

console.log("CARGÓ INDEX NUEVO");

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/usuarios", usuarios);
app.use("/posts", posts);
app.use("/comentarios", comentarios);


app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`);
});

