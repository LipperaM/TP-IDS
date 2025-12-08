const express = require("express");

const router = express.Router();

let usuarios = [];

/*
Registrarse
body:
{"nombre": nombre,   
 "apellido": apellido,
 "mail": mail,
 "pais": pais,
 "equipo": equipo,
 "nombreUsuario": nombreUsuario,
 "contrasenia": contasenia
}
*/

router.post("/", async(req, res) => {
  try{
    //Validacion de datos despues lo agrego
    const query = `insert into usuarios (usuario, nombre, apellido, mail, contrasenia, foto_url, pais, equipo) 
                   values ('${req.body.usuario}', '${req.body.nombre}', '${req.body.apellido}', '${req.body.mail}', '${req.body.contrasenia}', '', '${req.body.pais}', '${req.body.equipo}')`;

    await pool.query(query);
    
    res.json();

  }catch(err){
    console.error(err);
    res.status(500).json({ error: "DB error"});
  }
});

/*
Login
body:
{"nombreUsuario": nombreUsuario,   
 "contrasenia": contasenia
}
*/
router.get("/", async(req, res) => {
  try{
    const contrasenia = `select contrasenia from usuarios
                         where usuario = '${req.body.nombreUsuario}'`;
    await pool.query(contrasenia);

    if(contrasenia == req.body.contrasenia){

      const query = `select usuario, equipo, pais from usuarios
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
*/

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const nuevoNombre = req.body.nombre;
  const nuevoApellido = req.body.apellido;
  const nuevoMail = req.body.mail;
  const nuevoPais = req.body.pais;
  const nuevoNombreUsuario = req.body.nombreUsuario;
  const nuevaContrasenia = req.body.contrasenia;
  let user_index = undefined;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id == id) {
      user_index = i;
      if(nuevoNombre != undefined) usuarios[i].nombre = nuevoNombre;
      if(nuevoApellido != undefined) usuarios[i].apellido = nuevoApellido;
      if(nuevoMail != undefined) usuarios[i].mail = nuevoMail;
      if(nuevoPais != undefined) usuarios[i].pais = nuevoPais;
      if(nuevoNombreUsuario != undefined) usuarios[i].nombreUsuario = nuevoNombreUsuario;
      if(nuevaContrasenia != undefined) usuarios[i].contrasenia = nuevaContrasenia;
    }
  }

  if (user_index === undefined) {
    return res.status(404).send("");
  }

  res.json(usuarios[user_index]);
});

/*
Borrar perfil
body:
{
 "contrasenia": contasenia
}
*/

router.delete("/:id", async(req, res) => {
  try{

    const contrasenia_para_borrar = `select contrasenia from usuarios
                               where id = '${req.params.id}'`;

    if(contrasenia_para_borrar == req.body.contrasenia){
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

module.exports = router;