import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

router.get("/", async(req, res) => {
  try{
    
    const result = await pool.query("select * from equipos");
    res.json(result.rows);

  }catch (err){
    console.error("DB ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
