import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

console.log("=> cargando router /usuarios");

/*
Registrarse
body:
{"nombre": nombre,   
 "apellido": apellido,
 "mail": mail,
 "pais": pais,
 "equipo": equipo,
 "usuario": usuario,
 "contrasenia": contasenia
}
*/

router.post("/", async(req, res) => {
  try{
    //Validacion de datos despues lo agrego
    const query = `insert into usuarios (usuario, nombre, apellido, mail, contrasenia, foto_url, pais, equipo) 
                   values ('${req.body.usuario}', '${req.body.nombre}', '${req.body.apellido}', '${req.body.mail}', '${req.body.contrasenia}', 'b', '${req.body.pais}', '${req.body.equipo}')`;

    await pool.query(query);
    
    res.json();

  }catch(err){
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

router.get("/:nombreUsuario", async(req, res) => {
  try {
        const result = await pool.query(`select id, usuario, equipo, pais from usuarios where usuario = '${req.params.nombreUsuario}'`);
        console.log("=> GET /usuarios/:nombreUsuario :", req.params.nombreUsuario);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

/*
Login
body:
{"nombreUsuario": nombreUsuario,   
 "contrasenia": contasenia
}

router.get("/", async(req, res) => {
  try{
    const contrasenia_login = `select contrasenia from usuarios
                         where usuario = '${req.body.nombreUsuario}'`;
    const constrasenia = await pool.query(contrasenia_login);

    if(contrasenia == req.body.contrasenia){

      const query = `select id, usuario, equipo, pais from usuarios
                           where usuario = '${req.body.nombreUsuario}'`;
      
      await pool.query(query);
      res.json("Login exitoso");
    }
    else{
      res.json("Contrasenia incorrecta");
    }
  }catch (err){
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/*
Editar perfil
body:
{"nombre": nombre,   
 "apellido": apellido,
 "mail": mail,
 "pais": pais,
 "nombreUsuario": nombreUsuario,
 "contrasenia": contasenia
}


router.put("/:id", (req, res) => {
  
});

/*
Borrar perfil
body:
{
 "contrasenia": contasenia
}


router.delete("/:id", async(req, res) => {
  try{

    const contrasenia_para_borrar = `select contrasenia from usuarios
                               where id = '${req.params.id}'`;

    const contrasenia = await pool.query(contrasenia_para_borrar);
    
    if(contrasenia == req.body.contrasenia){
      const query = `delete from usuarios
                    where id = '${req.params.id}'`;

      await pool.query(query);
      res.json("Usuario borrado");
    }
    else {
    res.json("Contrasenia incorrecta");
    }

  }catch (err){
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});
*/

export default router;