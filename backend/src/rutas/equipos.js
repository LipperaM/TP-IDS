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
Borrar equipo
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

/*
Post Equipo
body:
{"nombre": nombre,   
 "escudo": escudo,
 "zona": zona
}
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
      `insert into equipos (nombre, escudo_url, zona) values ($1, $2, $3)`,
      [nombre, escudo, zonaMayus]
    );

    return res.status(201).json({ ok: true });

  }catch(err){
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

export default router;
