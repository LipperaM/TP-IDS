--
-- PostgreSQL database dump
--

\restrict jfBledROxZVq2lTYwtc7pfdXJ0t3YKYEx1YgufLLla0H0xc201HzzqyFDJ2HB5l

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

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

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categorias OWNER TO admin;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO admin;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: comentarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    id_post integer NOT NULL,
    id_usuario integer NOT NULL,
    texto text NOT NULL,
    id_comentario_padre integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comentarios OWNER TO admin;

--
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarios_id_seq OWNER TO admin;

--
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- Name: likes_comentarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.likes_comentarios (
    id integer NOT NULL,
    id_comentario integer NOT NULL,
    id_usuario integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.likes_comentarios OWNER TO admin;

--
-- Name: likes_comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.likes_comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_comentarios_id_seq OWNER TO admin;

--
-- Name: likes_comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.likes_comentarios_id_seq OWNED BY public.likes_comentarios.id;


--
-- Name: likes_post; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.likes_post (
    id integer NOT NULL,
    id_post integer NOT NULL,
    id_usuario integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.likes_post OWNER TO admin;

--
-- Name: likes_post_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.likes_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_post_id_seq OWNER TO admin;

--
-- Name: likes_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.likes_post_id_seq OWNED BY public.likes_post.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    texto text NOT NULL,
    imagen_url character varying(255),
    id_categoria integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.posts OWNER TO admin;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO admin;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(50) NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    mail character varying(150) NOT NULL,
    foto_url character varying(255),
    pais character varying(100),
    equipo character varying(100),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- Name: likes_comentarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_comentarios ALTER COLUMN id SET DEFAULT nextval('public.likes_comentarios_id_seq'::regclass);


--
-- Name: likes_post id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_post ALTER COLUMN id SET DEFAULT nextval('public.likes_post_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categorias (id, nombre) FROM stdin;
\.


--
-- Data for Name: comentarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.comentarios (id, id_post, id_usuario, texto, id_comentario_padre, created_at) FROM stdin;
\.


--
-- Data for Name: likes_comentarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.likes_comentarios (id, id_comentario, id_usuario, created_at) FROM stdin;
\.


--
-- Data for Name: likes_post; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.likes_post (id, id_post, id_usuario, created_at) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.posts (id, id_usuario, texto, imagen_url, id_categoria, created_at) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.usuarios (id, usuario, nombre, apellido, mail, foto_url, pais, equipo, creado_en) FROM stdin;
\.


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.categorias_id_seq', 1, false);


--
-- Name: comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.comentarios_id_seq', 1, false);


--
-- Name: likes_comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.likes_comentarios_id_seq', 1, false);


--
-- Name: likes_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.likes_post_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- Name: categorias categorias_nombre_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nombre_key UNIQUE (nombre);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- Name: likes_comentarios likes_comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_comentarios
    ADD CONSTRAINT likes_comentarios_pkey PRIMARY KEY (id);


--
-- Name: likes_post likes_post_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_post
    ADD CONSTRAINT likes_post_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_mail_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_mail_key UNIQUE (mail);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- Name: comentarios comentarios_id_comentario_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_id_comentario_padre_fkey FOREIGN KEY (id_comentario_padre) REFERENCES public.comentarios(id);


--
-- Name: comentarios comentarios_id_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.posts(id);


--
-- Name: comentarios comentarios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- Name: likes_comentarios likes_comentarios_id_comentario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_comentarios
    ADD CONSTRAINT likes_comentarios_id_comentario_fkey FOREIGN KEY (id_comentario) REFERENCES public.comentarios(id);


--
-- Name: likes_comentarios likes_comentarios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_comentarios
    ADD CONSTRAINT likes_comentarios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- Name: likes_post likes_post_id_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_post
    ADD CONSTRAINT likes_post_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.posts(id);


--
-- Name: likes_post likes_post_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.likes_post
    ADD CONSTRAINT likes_post_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- Name: posts posts_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id);


--
-- Name: posts posts_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict jfBledROxZVq2lTYwtc7pfdXJ0t3YKYEx1YgufLLla0H0xc201HzzqyFDJ2HB5l

