import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

//GET todos los equipos
router.get("/", async(req, res) => {
  try{
    
    const result = await pool.query("select * from equipos where activo = true");
    res.json(result.rows);

  }catch (err){
    console.error("DB ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/*
Desactivar equipo
body:
{
  "id": id,
}
*/

router.put("/", async(req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json("ID requerido");
      }

      await pool.query(
        `update equipos set activo = false where id = $1`,
        [id]
      );

    return res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});

/*
Post Equipo
body:
{"nombre": nombre,   
 "escudo": escudo,
 "zona": zona
}

UPDATE usuarios
SET id_equipo = 34
WHERE id_equipo = 7;

*/

router.post("/", async(req, res) => {
  try{
    const { nombre, escudo, zona } = req.body;

    if (!nombre || !escudo || !zona) {
      return res.status(400).json("Todos los campos son obligatorios");
    }

    if (zona.length !== 1 || !["A", "B"].includes(zona.toUpperCase())) {
      return res.status(400).json("La zona debe ser A o B");
    }

    const zonaMayus = zona.toUpperCase();

    const total = await pool.query(`select count(*) from equipos`);
    const cantZona = await pool.query(
      `select count(*) from equipos where zona = $1`,
      [zonaMayus]
    );

    const equiposTotales = parseInt(total.rows[0].count);
    const equiposZona = parseInt(cantZona.rows[0].count);

    if (equiposTotales >= 30) {
      return res.status(400).json("No se pueden sumar mas equipos");
    }

    if (equiposZona >= 15) {
      return res.status(400).json(`No se pueden sumar mas equipos a la zona ${zonaMayus}`);
    }

    await pool.query(
      `insert into equipos (nombre, escudo_url, zona, activo) values ($1, $2, $3, true)`,
      [nombre, escudo, zonaMayus]
    );

    return res.status(201).json({ ok: true });

  }catch(err){
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

export default router;
