import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

console.log("=> cargando router /comentarios");

// Crear comentario
router.post("/", async (req, res) => {
  try {
    const { id_post, id_usuario, texto, id_comentario_padre } = req.body;
    const result = await pool.query(
      `INSERT INTO comentarios (id_post, id_usuario, texto, id_comentario_padre)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_post, id_usuario, texto, id_comentario_padre || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando comentario" });
  }
});

// Listar comentarios  x post
router.get("/post/:id_post", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.usuario
       FROM comentarios c
       JOIN usuarios u ON c.id_usuario = u.id
       WHERE c.id_post = $1
       ORDER BY c.creado_en ASC`,
      [req.params.id_post]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo comentarios" });
  }
});

// Editar un comentario
router.put("/:id", async (req, res) => {
  try {
    const { texto } = req.body;
    const result = await pool.query(
      `UPDATE comentarios SET texto=$1 WHERE id=$2 RETURNING *`,
      [texto, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Comentario no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error editando comentario" });
  }
});

// Eliminar comentario
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM comentarios WHERE id=$1`, [req.params.id]);
    res.json({ mensaje: "Comentario borrado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error borrando comentario" });
  }
});

export default router;

