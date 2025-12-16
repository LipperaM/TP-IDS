import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

/*
Registrarse
body:
{"usuario": usuario,   
 "nombre": nombre,
 "apellido": apellido,
 "mail": mail,
 "contrasenia": contrasenia,
 "foto_url": foto_url,
 "pais": pais,
 "id_equipo": id_equipo
}
*/

router.post("/", async(req, res) => {
  try{
    const { usuario, nombre, apellido, mail, contrasenia, foto_url, pais, id_equipo } = req.body;

    //Validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!usuario || !nombre || !apellido || !mail || !contrasenia || !pais){
      return res.status(400).json("Todos los campos son obligatorios");
    }
    if(contrasenia.length < 8){
      return res.status(400).json("La contraseña debe tener al menos 8 caracteres");
    }
    if(!emailRegex.test(mail)){
      return res.status(400).json("Formato de mail invalido");
    }
    const verificacion_usuario = await pool.query(`select * from usuarios where usuario = $1`, [usuario]);
    if(verificacion_usuario.rows.length > 0){
      return res.status(400).json("El usuario ya existe");
    }
    const verificacion_mail = await pool.query(`select * from usuarios where mail = $1`, [mail]);
    if(verificacion_mail.rows.length > 0){
      return res.status(400).json("El mail ya fue registrado");
    }
    else{

    await pool.query(`insert into usuarios (usuario, nombre, apellido, mail, contrasenia, foto_url, pais, id_equipo) 
                                    values ($1, $2, $3, $4, $5, $6, $7, $8)`,
                                    [usuario, nombre, apellido, mail, contrasenia, foto_url, pais, id_equipo] 
                                  );
    return res.status(201).json({ ok: true });
    }
  }catch(err){
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

//Login

router.get("/:usuario/:contrasenia", async(req, res) => {
  try{
    //Validaciones
    const { usuario, contrasenia } = req.params;
    
     if(!usuario){
      return res.status(400).json("Ingrese el nombre de usuario");
    }

    const queryContrasenia = await pool.query(`select contrasenia from usuarios
                                               where usuario = $1`, [usuario]);

    if (queryContrasenia.rows.length === 0) {
      return res.json("Usuario no encontrado");
    }

    const contrasenia_login = queryContrasenia.rows[0].contrasenia;

    if(contrasenia_login === contrasenia){

      const queryDatos = await pool.query(`select u.id, u.usuario, e.nombre, u.pais, e.escudo_url from usuarios u
                                           inner join equipos e on u.id_equipo = e.id
                                           where usuario = $1`, [usuario]);
      
      return res.json(queryDatos.rows[0]); 
    }
    else{
      res.status(400).json("Contrasenia incorrecta");
    }
  }catch (err){
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

//GET un usuario

router.get("/:id", async(req, res) => {
  try{
    const { id } = req.params;
    const query = await pool.query(`select u.id, u.usuario, e.nombre, u.pais, e.escudo_url from usuarios u
                                    inner join equipos e on u.id_equipo = e.id
                                    where u.id = $1`, [id]);
      
    return res.json(query.rows[0]); 

  }catch (err){
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/*
Editar perfil
body:
{ "id": id,
 "nombre": nombre,   
 "apellido": apellido,
 "mail": mail,
 "pais": pais,
 "nombreUsuario": nombreUsuario,
 "contrasenia": contasenia
}
*/

router.put("/", async(req, res) => {
  try{
    const { id, usuario, nombre, apellido, mail, contrasenia, pais } = req.body;

    if (!id) {
      return res.status(400).json("Falta el id del usuario");
    }

    const datos = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (datos.rows.length === 0) {
      return res.status(404).json("Usuario no encontrado");
    }

    const actual = datos.rows[0];

    //Si lo manda vacio usa el que ya estaba en la db
    const nuevoUsuario = usuario || actual.usuario;
    const nuevoNombre = nombre || actual.nombre;
    const nuevoApellido = apellido || actual.apellido;
    const nuevoMail = mail || actual.mail;
    const nuevoPass = contrasenia || actual.contrasenia;
    const nuevoPais = pais || actual.pais;
    
    await pool.query(`update usuarios set usuario = $2, nombre = $3, apellido = $4, 
                                   mail = $5, contrasenia = $6, pais = $7 
                                   where id = $1`, [id, nuevoUsuario, nuevoNombre, nuevoApellido, nuevoMail, nuevoPass, nuevoPais]);

    return res.json({ ok: true });

  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});

/*
Borrar perfil
body:
{
  "id": id,
 "contrasenia": contasenia
}
*/

router.delete("/", async(req, res) => {
    try {
    //Validaciones
    const { id, contrasenia} = req.body;
    
    const query = await pool.query(`
      select contrasenia from usuarios
      where id = $1`, [id]);

    if(!contrasenia){
      return res.status(400).json("Todos los campos son obligatorios");
    }
    if (query.rows.length === 0) {
      return res.status(404).json("Usuario no encontrado");
    }
    const contraseniaDB = query.rows[0].contrasenia;

    if (contraseniaDB === contrasenia) {

      await pool.query(`
        delete from usuarios
        where id = $1`, [id]);

      return res.json({ ok: true });
    } else {
      return res.json("Contrasenia incorrecta");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }

});

export default router;