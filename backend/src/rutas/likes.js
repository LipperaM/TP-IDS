import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

console.log("=> cargando router /likes");


// Contar likes 
router.get("/posts/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const result = await pool.query(
      "SELECT COUNT(*) AS likes FROM public.likes_posts WHERE id_post = $1",
      [postId]
    );
    res.json({ likes: parseInt(result.rows[0].likes) });
  } catch (err) {
    console.error("SQL ERROR (GET likes):", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});


// Likear
router.post("/posts/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const id_usuario = parseInt(req.body.id_usuario, 10);

    if (!id_usuario) return res.status(400).json({ error: "Falta id_usuario" });

    await pool.query(
      "INSERT INTO public.likes_posts (id_post, id_usuario) VALUES ($1, $2)",
      [postId, id_usuario]
    );

    res.json({ mensaje: "Like agregado" });
  } catch (err) {
    if (err.code === "23505") { // clave única violada
      return res.status(409).json({ error: "El usuario ya dio like" });
    }
    console.error("SQL ERROR (POST like):", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// deslikear
router.delete("/posts/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const id_usuario = parseInt(req.body.id_usuario, 10);

    const result = await pool.query(
      "DELETE FROM public.likes_posts WHERE id_post = $1 AND id_usuario = $2",
      [postId, id_usuario]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Like no encontrado" });
    }

    res.json({ mensaje: "Like eliminado" });
  } catch (err) {
    console.error("SQL ERROR (DELETE like):", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});


// likeado por el usuario
router.get("/posts/:id/me", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const id_usuario = parseInt(req.query.id_usuario, 10);

    if (!id_usuario) return res.status(400).json({ error: "Falta id_usuario" });

    const result = await pool.query(
      "SELECT 1 FROM public.likes_posts WHERE id_post = $1 AND id_usuario = $2",
      [postId, id_usuario]
    );

    res.json({ like: result.rowCount > 0 });
  } catch (err) {
    console.error("SQL ERROR (GET me):", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

export default router;

