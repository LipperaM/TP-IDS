# Entidades base de datos
---------------------------------------------------

> Usamos el metodo de referencia a las *foreign key* por *CASCADE* para poder borrar todas las entradas de las tablas padres e hijas unidas a la vez.

### USUARIOS
TABLE public.usuarios
*    id SERIAL PRIMARY KEY,
*    usuario VARCHAR(50) UNIQUE NOT NULL,
*    nombre VARCHAR(100),
*    apellido VARCHAR(100),
*    mail VARCHAR(150) UNIQUE NOT NULL,
*    contrasenia VARCHAR(100) NOT NULL,
*    foto_url VARCHAR(255),
*    pais VARCHAR(100),
*    id_equipo INTEGER,
*    administrador INTEGER,
*    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### CATEGORIAS
TABLE public.categorias
*    id SERIAL PRIMARY KEY,
*    nombre VARCHAR(100) UNIQUE NOT NULL

### POSTS
TABLE public.posts
*    id SERIAL PRIMARY KEY,
*    id_usuario INTEGER NOT NULL,
*    texto TEXT NOT NULL,
*    imagen_url VARCHAR(255),
*    id_categoria INTEGER,
*    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
*    CONSTRAINT posts_id_usuario_fkey
      FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE,
*    CONSTRAINT posts_id_categoria_fkey
      FOREIGN KEY (id_categoria) REFERENCES public.categorias(id) ON DELETE SET NULL

### LIKES POSTS
TABLE public.likes_posts
*    id SERIAL PRIMARY KEY,
*    id_post INTEGER NOT NULL,
*    id_usuario INTEGER NOT NULL,
*    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
*    UNIQUE(id_post, id_usuario),
*    CONSTRAINT likes_posts_id_post_fkey
      FOREIGN KEY (id_post) REFERENCES public.posts(id) ON DELETE CASCADE,
*    CONSTRAINT likes_posts_id_usuario_fkey
      FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE

### COMENTARIOS
TABLE public.comentarios 
*    id SERIAL PRIMARY KEY,
*    id_post INTEGER NOT NULL,
*    id_usuario INTEGER NOT NULL,
*    texto TEXT NOT NULL,
*    id_comentario_padre INTEGER,
*    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
*    CONSTRAINT comentarios_id_post_fkey
      FOREIGN KEY (id_post) REFERENCES public.posts(id) ON DELETE CASCADE,
*    CONSTRAINT comentarios_id_usuario_fkey
      FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE,
*    CONSTRAINT comentarios_id_comentario_padre_fkey
      FOREIGN KEY (id_comentario_padre) REFERENCES public.comentarios(id) ON DELETE CASCADE

### LIKES COMENTARIOS
TABLE public.likes_comentarios
*    id SERIAL PRIMARY KEY,
*    id_comentario INTEGER NOT NULL,
*    id_usuario INTEGER NOT NULL,
*    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
*    UNIQUE(id_comentario, id_usuario),
*    CONSTRAINT likes_comentarios_id_comentario_fkey
      FOREIGN KEY (id_comentario) REFERENCES public.comentarios(id) ON DELETE CASCADE,
*    CONSTRAINT likes_comentarios_id_usuario_fkey
      FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE

### EQUIPOS
TABLE public.equipos
*    id SERIAL PRIMARY KEY,
*    nombre VARCHAR(100) UNIQUE NOT NULL,
*    escudo_url VARCHAR(255),
*    zona VARCHAR(1),
*    activo BOOLEAN

### TABLA POSICIONES
TABLE public.tabla_posiciones
*    id SERIAL PRIMARY KEY,
*    id_equipo INTEGER NOT NULL,
*    posicion INTEGER NOT NULL,
*    partidos_jugados INTEGER DEFAULT 0,
*    partidos_ganados INTEGER DEFAULT 0,
*    partidos_empatados INTEGER DEFAULT 0,
*    partidos_perdidos INTEGER DEFAULT 0,
*    puntos INTEGER DEFAULT 0,
*    CONSTRAINT tabla_posiciones_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipos(id)
