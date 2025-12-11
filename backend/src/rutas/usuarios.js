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
                   values ('${req.body.usuario}', '${req.body.nombre}', '${req.body.apellido}', '${req.body.mail}', '${req.body.contrasenia}', 'a', '${req.body.pais}', '${req.body.equipo}')`;

    await pool.query(query);
    
    return res.status(201).json({ ok: true });

  }catch(err){
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

/*
Login
body:
{"nombreUsuario": nombreUsuario,   
 "contrasenia": contasenia
}
*/

router.get("/:nombreUsuario/:contrasenia", async(req, res) => {
  try{
    const queryContrasenia = await pool.query(`select contrasenia from usuarios
                                    where usuario = '${req.params.nombreUsuario}'`);

    if (queryContrasenia.rows.length === 0) {
      return res.json("Usuario no encontrado");
    }

    const contrasenia_login = queryContrasenia.rows[0].contrasenia;

    if(contrasenia_login === req.params.contrasenia){

      const queryDatos = await pool.query(`select id, usuario, equipo, pais from usuarios
                           where usuario = '${req.params.nombreUsuario}'`);
      
      return res.json(queryDatos.rows[0]); 
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


Borrar perfil
body:
{
  "id": id,
 "contrasenia": contasenia
}
*/

router.delete("/", async(req, res) => {
    try {
    const contrasenia  = req.body.contrasenia;

    const query_contrasenia_borrar = await pool.query(`
      select contrasenia from usuarios
      where id = '${req.body.id}'`);

    if (query_contrasenia_borrar.rows.length === 0) {
      return res.json("Usuario no encontrado");
    }

    const contrasenia_borrar = query_contrasenia_borrar.rows[0].contrasenia;

    if (contrasenia_borrar === contrasenia) {

      await pool.query(`
        delete from usuarios
        where id = '${req.body.id}'`);

      return res.json("Usuario eliminado");
    } else {
      return res.json("Contrasenia incorrecta");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});


export default router;