# TP Final de Introduccion al Desarrollo Software.
---------------------------------------------------

## FORO DE FUTBOL
  * *PAGINAS*: 
    HOME, TABLA, USUARIO 
  
  * *ENTIDADES*:

    *USUARIOS*: id, usuario, nombre, apellido, mail, contrasenia, foto_url, pais, equipo, creado_en.

    *POSTS*: id, id_usuario, texto, imagen_url, id_categoria, creado_en.

    *LIKES_POSTS*: id, id_post, id_usuario, creado_en.

    *LIKES_COMENTARIOS*: id, id_comentario, id_usuario, creado_en.

    *EQUIPOS*: id, nombre, escudo_url.

    *CATEGORIAS*: id, nombre.

    *COMENTARIOS*: id, id_post, id_usuario, texto, id_comentario_padre, creado_en.

    *TABLA_POSICIONES*: id, id_equipo, posicion, partidos_jugados, partidos_ganados, partidos_empatados, partidos_perdidos, puntos.

## INSTRUCCIONES DE USO 

### Requisitos previos
- Docker y Docker Compose instalados
- Make instalado

### Configuracion inicial

- Renombrar y completar el .env.example a .env
- La db toma el archivo init.sql como plantilla inicial al crearse el contenedor por   primera vez. Este archivo tiene todas las tablas y entidades vacias. La db guarda los datos en ./db/data.

### Instrucciones makefile

**Desarrollo local:**
- `make local` - Levantar frontend, API y base de datos
- `make local-down` - Detener todos los servicios
- `make local-restart` - Reiniciar servicios

**Producción:**
- `make prod` - Levantar todo con túnel Cloudflare (solo en servidor)
- `make prod-down` - Detener producción

**Servicios individuales:**
- `make nginx` - Levantar solo el frontend
- `make postgres` - Levantar solo la base de datos
- `make api` - Levantar solo la API

**Utilidades:**
- `make logs` - Ver logs en tiempo real
- `make build` - Construir/reconstruir imágenes
- `make ps` - Ver estado de los contenedores

### Acceso
- **Frontend**: http://localhost/
- **API**: http://localhost:3000/
- **Base de datos**: localhost:5432