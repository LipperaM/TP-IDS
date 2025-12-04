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
    equipo VARCHAR(100),
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
    escudo_url VARCHAR(255)
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

--
-- PostgreSQL database dump complete
--