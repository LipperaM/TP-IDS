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

/*
Mostrar usuario por id
body:
{"id": id}
*/

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

// Traigo todos los usuarios
router.get("/", (req, res) => {
  res.json(usuarios);
});

/*
Borrar usuario
body:
{"nombreUsuario": nombreUsuario,   
 "contrasenia": contrasenia,
}
*/
router.delete("/:nombreUsuario", (req, res) => {
  const nombreUsuario = req.params.nombreUsuario;
  const usuario = usuarios.find((usuario) => {
    return usuario.nombreUsuario == nombreUsuario;
  });
  usuarios = usuarios.filter((usuario) => {
    return usuario.nombreUsuario != nombreUsuario;
  });

  if (usuario === undefined) {
    return res.status(404).send("");
  }

  res.json(usuario);
});

module.exports = router;