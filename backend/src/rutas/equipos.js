import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

//GET todos los equipos
router.get("/", async(req, res) => {
  try{
    
    const result = await pool.query("select * from equipos");
    res.json(result.rows);

  }catch (err){
    console.error("DB ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/*
Borrar perfil
body:
{
  "id": id,
}
*/

router.delete("/", async(req, res) => {
    try {
      const { id } = req.body;
      await pool.query(`
        delete from equipos
        where id = $1`, [id]);

      return res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});

export default router;
