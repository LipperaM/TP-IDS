import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

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
    //Validaciones
    const query_verificacion_usuario = await pool.query(`select * from usuarios where usuario = '${req.body.usuario}'`);
    const query_verificacion_mail = await pool.query(`select * from usuarios where mail = '${req.body.mail}'`);

    let verificacionUsuario = req.body.usuario;
    let verificacionNombre = req.body.nombre;
    let verificacionApellido = req.body.apellido;
    let verificacionMail = req.body.mail;
    let verificacionPass = req.body.contrasenia;
    let verificacionPais = req.body.pais;
    let verificacionEquipo = req.body.equipo;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(verificacionUsuario === "" || verificacionNombre === "" || verificacionApellido === "" || verificacionMail === "" || verificacionPass === "" || verificacionPais === "" || verificacionEquipo === ""){
      return res.json("Todos los campos son obligatorios");
    }
    if(query_verificacion_usuario.rows.length > 0){
      return res.json("El usuario ya existe");
    }
    if(query_verificacion_mail.rows.length > 0){
      return res.json("El mail ya fue registrado");
    }
    if(verificacionPass.length < 8){
      return res.json("La contraseña debe tener al menos 8 caracteres");
    }
    if(!emailRegex.test(verificacionMail)){
      return res.json("Formato de mail invalido");
    }
    else{

    const query = `insert into usuarios (usuario, nombre, apellido, mail, contrasenia, foto_url, pais, equipo) 
                   values ('${req.body.usuario}', '${req.body.nombre}', '${req.body.apellido}', '${req.body.mail}', '${req.body.contrasenia}', 'a', '${req.body.pais}', '${req.body.equipo}')`;

    await pool.query(query);
    
    return res.status(201).json({ ok: true });
    }
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
    //Validaciones
    let verificacionUsuario = req.params.nombreUsuario;
    
     if(verificacionUsuario === ""){
      return res.json("Ingrese el nombre de usuario");
    }

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
    let nuevoUsuario = req.body.usuario;
    let nuevoNombre = req.body.nombre;
    let nuevoApellido = req.body.apellido;
    let nuevoMail = req.body.mail;
    let nuevoPass = req.body.contrasenia;
    let nuevoPais = req.body.pais;

    const datos = await pool.query(`select * from usuarios
                                    where id = '${req.body.id}'`);

    const usuario = datos.rows[0];
    
    //Validaciones (si lo manda vacio no lo actualizo)
    if(nuevoUsuario === "") nuevoUsuario = usuario.usuario;
    if(nuevoNombre === "") nuevoNombre = usuario.nombre;
    if(nuevoApellido === "") nuevoApellido = usuario.apellido;
    if(nuevoMail === "") nuevoMail = usuario.mail;
    if(nuevoPass === "") nuevoPass = usuario.contrasenia;
    if(nuevoPais === "") nuevoPais = usuario.pais;
    
    const query = `update usuarios set usuario = '${nuevoUsuario}', nombre = '${nuevoNombre}', apellido = '${nuevoApellido}', 
                                   mail = '${nuevoMail}', contrasenia = '${nuevoPass}', pais = '${nuevoPais}' 
                   where id = '${req.body.id}'`;
    
    await pool.query(query);

    return res.json("Usuario actualizado");

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