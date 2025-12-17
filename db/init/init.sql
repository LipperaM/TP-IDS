--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- USUARIOS
CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    mail VARCHAR(150) UNIQUE NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    foto_url VARCHAR(255),
    pais VARCHAR(100),
    id_equipo INTEGER,
    administrador INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIAS
CREATE TABLE public.categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- POSTS
CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    texto TEXT NOT NULL,
    imagen_url VARCHAR(255),
    id_categoria INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id),
    CONSTRAINT posts_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id)
);

-- LIKES_POSTS
CREATE TABLE public.likes_posts (
    id SERIAL PRIMARY KEY,
    id_post INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_post, id_usuario),
    CONSTRAINT likes_posts_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.posts(id),
    CONSTRAINT likes_posts_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id)
);

-- COMENTARIOS
CREATE TABLE public.comentarios (
    id SERIAL PRIMARY KEY,
    id_post INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    texto TEXT NOT NULL,
    id_comentario_padre INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comentarios_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.posts(id),
    CONSTRAINT comentarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id),
    CONSTRAINT comentarios_id_comentario_padre_fkey FOREIGN KEY (id_comentario_padre) REFERENCES public.comentarios(id)
);

-- LIKES_COMENTARIOS
CREATE TABLE public.likes_comentarios (
    id SERIAL PRIMARY KEY,
    id_comentario INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_comentario, id_usuario),
    CONSTRAINT likes_comentarios_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentarios(id),
    CONSTRAINT likes_comentarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id)
);

-- EQUIPOS
CREATE TABLE public.equipos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    escudo_url VARCHAR(255),
    zona VARCHAR(1),
    activo BOOLEAN
);

-- TABLA_POSICIONES
CREATE TABLE public.tabla_posiciones (
    id SERIAL PRIMARY KEY,
    id_equipo INTEGER NOT NULL,
    posicion INTEGER NOT NULL,
    partidos_jugados INTEGER DEFAULT 0,
    partidos_ganados INTEGER DEFAULT 0,
    partidos_empatados INTEGER DEFAULT 0,
    partidos_perdidos INTEGER DEFAULT 0,
    puntos INTEGER DEFAULT 0,
    CONSTRAINT tabla_posiciones_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipos(id)
);

-- Datos mock para pruebas

-- Categorías
INSERT INTO public.categorias (nombre) VALUES 
('Champions'),
('Libertadores'),
('Liga Profesional');

-- Usuarios mock
INSERT INTO public.usuarios (usuario, nombre, apellido, mail, contrasenia, foto_url, pais, id_equipo) VALUES 
('JorgeVarsky23', 'Jorge', 'Varsky', 'varsky@mail.com', 'pass123', 'https://ejemplo.com/foto1.jpg', 'Argentina', NULL),
('Ronaldo', 'Cristiano', 'Ronaldo', 'cr7@mail.com', 'pass123', 'https://ejemplo.com/foto2.jpg', 'Portugal', NULL),
('MoristeEnMadrid420', 'Juan', 'Perez', 'juan@mail.com', 'pass123', 'https://ejemplo.com/foto3.jpg', 'Argentina', NULL);

-- Posts mock
INSERT INTO public.posts (id_usuario, texto, id_categoria, creado_en) VALUES 
(1, 'Allí la tiene Messi... ¡Messi, Messi, Messi! ¡Se va Messi, se va Messi, se va Messi! ¡Qué grande sos, Messi! ¡Genio, genio, genio! ¡Ta-ta-ta-ta-ta-ta-ta-ta...! ¡Gooooool! ¡Gooooool! ¡Quiero llorar! ¡Dios santo, viva el fútbol! ¡Golaaazo! ¡Golaaazo! ¡Golaaazo!', 1, '2024-06-20 14:30:00'),
(2, 'Losh dosh.', 1, '2024-01-22 10:30:00'),
(3, 'Increíble partido hoy, no puedo creer que ganamos así en el último minuto. Este equipo tiene corazón!', 1, '2024-12-11 20:15:00'),
(1, 'La final de la Libertadores va a ser épica, no me la pierdo por nada del mundo', 2, '2024-12-10 18:45:00'),
(2, 'SIUUUUU! Otro gol más para la colección', 3, '2024-12-09 16:20:00');

-- Equipos mock
    INSERT INTO public.equipos (id, nombre, escudo_url, zona, activo) VALUES
    (1,'Aldosivi','https://i.pinimg.com/originals/b1/0a/1a/b10a1ab67ae68da296c4a1d011193a41.png', 'B', true),
    (2,'Argentinos Juniors','https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Asociacion_Atletica_Argentinos_Juniors.svg/1024px-Asociacion_Atletica_Argentinos_Juniors.svg.png', 'B', true),
    (3,'Atletico Tucuman','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Escudo_del_Club_Atletico_Tucuman.svg/1746px-Escudo_del_Club_Atletico_Tucuman.svg.png', 'B', true),
    (4,'Barracas Central','https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Barracas_central_logo.svg/800px-Barracas_central_logo.svg.png', 'B', true),
    (5,'Banfield','https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/CA_Banfield_%282014%29.svg/800px-CA_Banfield_%282014%29.svg.png', 'B', true),
    (6,'Belgrano','https://upload.wikimedia.org/wikipedia/commons/8/85/Escudo_Oficial_del_Club_Atl%C3%A9tico_Belgrano.png', 'B', true),
    (7,'Boca Juniors','https://upload.wikimedia.org/wikipedia/commons/c/c9/Boca_escudo.png', 'A', true),
    (8,'Central Cordoba','https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Central_Cordoba_SdE_crest_%282025%29.svg/1024px-Central_Cordoba_SdE_crest_%282025%29.svg.png', 'A', true),
    (9,'Defensa y Justicia','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Escudo_del_Club_Defensa_y_Justicia.svg/800px-Escudo_del_Club_Defensa_y_Justicia.svg.png', 'A', true),
    (10,'Deportivo Riestra','https://i.pinimg.com/originals/b1/0a/1a/b10a1ab67ae68da296c4a1d011193a41.png', 'A', true),
    (11,'Estudiantes La Plata','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Estudiantes_de_la_Plata_crest_%282025%29.svg/1024px-Estudiantes_de_la_Plata_crest_%282025%29.svg.png', 'A', true),
    (12,'Estudiantes Rio Cuarto','https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Escudo_Asociacion_Atl%C3%A9tica_Estudiantes_de_R%C3%ADo_Cuarto.svg/960px-Escudo_Asociacion_Atl%C3%A9tica_Estudiantes_de_R%C3%ADo_Cuarto.svg.png', 'B', true),
    (13,'Gimnasia La Plata','https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9.png', 'B', true),
    (14,'Gimnasia Mendoza','https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Escudo_Club_Atl%C3%A9tico_Gimnasia_y_Esgrima_Mendoza.png/250px-Escudo_Club_Atl%C3%A9tico_Gimnasia_y_Esgrima_Mendoza.png', 'A', true),
    (15,'Huracan','https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg/800px-Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg.png', 'B', true),
    (16,'Independiente','https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/1945px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png', 'A', true),
    (17,'Independiente Rivadavia','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Escudo_del_Club_Independiente_Rivadavia.svg/1024px-Escudo_del_Club_Independiente_Rivadavia.svg.png', 'B', true),
    (18,'Instituto','https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Instituto_Atletico_Central_Cordoba.svg/929px-Instituto_Atletico_Central_Cordoba.svg.png', 'A', true),
    (19,'Lanus','https://i.pinimg.com/originals/2f/20/3a/2f203a027a20ccb98370b679300d8984.png', 'A', true),
    (20,'Newells Old Boys','https://upload.wikimedia.org/wikipedia/commons/6/69/Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys_de_Rosario.svg', 'A', true),
    (21,'Platense','https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo_platense.png', 'A', true),
    (22,'Racing','https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/800px-Escudo_de_Racing_Club_%282014%29.svg.png', 'B', true),
    (23,'River Plate','https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Escudo_del_C_A_River_Plate.svg/1653px-Escudo_del_C_A_River_Plate.svg.png', 'B', true),
    (24,'Rosario Central','https://upload.wikimedia.org/wikipedia/commons/2/22/RosarioCentral.png', 'B', true),
    (25,'San Lorenzo','https://upload.wikimedia.org/wikipedia/commons/6/62/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.png', 'A', true),
    (26,'Sarmiento','https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Escudo_del_Club_Atl%C3%A9tico_Sarmiento_de_Jun%C3%ADn.svg/250px-Escudo_del_Club_Atl%C3%A9tico_Sarmiento_de_Jun%C3%ADn.svg.png', 'B', true),
    (27,'Talleres','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Escudo_Talleres_2015.svg/250px-Escudo_Talleres_2015.svg.png', 'A', true),
    (28,'Tigre','https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Escudo_del_Club_Atl%C3%A9tico_Tigre_-_2019.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Tigre_-_2019.svg.png', 'B', true),
    (29,'Union','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Escudo_club_Atl%C3%A9tico_Uni%C3%B3n_de_santa_fe.svg/1024px-Escudo_club_Atl%C3%A9tico_Uni%C3%B3n_de_santa_fe.svg.png', 'A', true),
    (30,'Velez Sarsfield','https://upload.wikimedia.org/wikipedia/commons/3/36/Escudo_V%C3%A9lez_Sarsfield.png', 'A', true);

--
-- PostgreSQL database dump complete
--