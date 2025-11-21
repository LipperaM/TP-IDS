const express = require("express");

const router = express.Router();

let usuarios = [];

/*
Crear nuevo usuario
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

router.post("/", (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const mail = req.body.mail;
  const pais = req.body.pais;
  const equipo = req.body.equipo;
  const nombreUsuario = req.body.nombreUsuario;
  const contrasenia = req.body.contrasenia;

  const ultimoUsuario = usuarios[usuarios.length - 1];
  let id = 1;
  if (ultimoUsuario !== undefined) {
    id = ultimoUsuario.id + 1;
  }

  const usuario = { id: id, nombre: nombre, apellido: apellido, mail: mail, pais: pais, equipo: equipo, nombreUsuario: nombreUsuario, contrasenia: contrasenia};

  usuarios.push(usuario);

  res.status(201).json(usuario);
});

//Traigo todos los usuarios

router.get("/", (req, res) => {
  res.json(usuarios);
});


//Mostrar usuario por id

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const usuario = usuarios.find((usuario) => {
    return usuario.id == id;
  });

  if (usuario === undefined) {
    return res.status(404).send("");
  }

  res.json(usuario);
});

/*
Editar usuario por id
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
Borrar usuario por id

body:
{
 "contrasenia": contasenia
}
*/

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const contasenia = req.body.contasenia

  const usuario = usuarios.find((usuario) => {
    if(usuario.contasenia == contasenia){
      return usuario.id == id;
    }

  });

  usuarios = usuarios.filter((usuario) => {
    return usuario.id != id;
  });

  if (usuario === undefined) {
    return res.status(404).send("");
  }

  res.json(usuario);
});

module.exports = router;