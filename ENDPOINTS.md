# API Endpoints
---------------------------------------------------

### COMENTARIOS
* *POST "/"* :
        Envia un comentario a un post por id por **body**.

* *GET "/post/:id_post"* :
        Lista los comentarios por id de un post por **path**.

* *PUT "/:id"* :
        Edita un comentario por id del comentario y usuario por **path**.

* *DELETE "/:id"* :
        Borra un comentario por id del comentario y usuario por **path**.


### EQUIPOS
* *GET "/"* :
        Trae todos los equipos que esten activos, en orden alfabetico.

*  *PUT "/"* :
        Actualiza el estado de un equipo por id por **body**.

*  *POST "/"* :
        Envia un equipo nuevo (nombre, escudo, zona) y si este ya existe pero esta inactivo se actualiza y/o activa. Tiene validaciones de cantidad de equipos y duplicados.


### LIKES
* *GET "/posts/:id"* :
        Trae todos los likes de un post por id por **path**.

* *POST "/posts/:id"* :
        Envia un like al post por id por **path**.

* *DELETE "/posts/:id"* :
        Deshace el like de un post por id por **path**.

* *GET "/posts/:id/me"* :
        Trae el like de un usuario por id del post por **path**.


### POSTS
* *POST "/"* :
        Envia un nuevo post con texto y categoria.

* *GET "/"* :
        Trae todos los posts de la db.

* *GET "/:id"* :
        Trae un post por id por **path**.

* *PUT "/"* :
        Edita un post propio por id por **body**.

* *DELETE "/"* :
        Borra un post por id por **body**.


### USUARIOS
* *POST "/"* :
        Crea un usuario nuevo.

* *POST "/login"* :
        Hace la request para iniciar sesion.

* *GET "/:id"* :
        Trae un usuario por id por **path**.

* *PUT "/"* :
        Edita los datos de un usuario.

* *DELETE "/"* :
        Borra un usuario por id por **body**.