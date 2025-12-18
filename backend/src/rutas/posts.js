import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

console.log("=> cargando router /posts");

// Crear post
router.post("/", async function(req, res) {
  try {
    const query = `INSERT INTO posts (id_usuario, texto, id_categoria, creado_en) 
                   VALUES ($1, $2, $3, NOW())`;
    await pool.query(query, [req.body.id_usuario, req.body.texto, req.body.id_categoria]);
    res.json({ mensaje: "Post creado" });
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Listar todos los posts
router.get("/", async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        p.id,
        p.id_usuario,
        p.texto,
        p.imagen_url,
        p.id_categoria,
        p.creado_en,
        u.usuario,
        c.nombre AS categoria,
        COUNT(com.id) AS cantidad_comentarios
      FROM posts p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN comentarios com ON com.id_post = p.id
      GROUP BY 
        p.id,
        p.id_usuario,
        p.texto,
        p.imagen_url,
        p.id_categoria,
        p.creado_en,
        u.usuario,
        c.nombre
      ORDER BY p.creado_en DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// Obtener post por ID
router.get("/:id", async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, id_usuario, texto, imagen_url, id_categoria, creado_en
       FROM posts WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;

