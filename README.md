# TP-IDS
TP Final de Introduccion al Desarrollo Software

--FORO DE FUTBOL
  *PAGINAS: HOME, POST, USUARIO; CATEGORIA
  *ENTIDADES:
    USUARIOS: id, nombre, mail, contraseña, hincha, pais, id_post, id_like, id_comentario.
    POST: id, texto, usuario_id, categoria_id, id_like_usuario, id_comentario, id_like_post, etiqueta, fecha, hora.
    LIKES: id, id_usuario.
    CATEGORIA: id, nombre.
    COMENTARIOS: id, id_usuario, id_like, id_comentario, fecha, hora.   
    
--MERCADO LIBRE
  *PAGINAS: HOME, PUBLICAR, PERFIL, CARRITO
  *ENTIDADES:
    USUARIO: id, nombre, apellido, usuario, mail, contraseña, direccion, id_preguntas, id_publicaciones, id_compras.
    PUBLICACIONES: id, titulo, id_categoria, precio, id_preguntas, imagen, id_usuario.
    PREGUNTAS: id, id_usuario, id_publicacion, contenido, horario, fecha.
    CATEGORIA: id, nombre, etiqueta.

--FORO NOTICIAS FIUBA
  *PAGINAS: HOME, EVENTOS, NOTICIAS IMPORTANTES, TU PERFIL
  *ENTIDADES:
    Usuario: id, nombre, apellido, padron, mail_institucional, contraseña, id_eventos, tipo_usuario.
    Eventos: id, contenido, id_comentario, titulo, id_usuario, fecha, hora, alumnos_anotados, imagen, fecha, hora.
    Noticias importantes: id, titulo, contenido, etiqueta, id_comentario, imagen, fecha, hora.
    Comentarios: id, id_usuario, id_comentario, contenido, fecha, hora.
    
    
    


  
