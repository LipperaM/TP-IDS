# TP Final de Introduccion al Desarrollo Software.
---------------------------------------------------

> **Que es Fydem?**
> Es una red social que viene a suplir la necesidad de un foro de futbol, con libre expresión y sin distracciones. Cualquiera puede crear un usuario y dar su opinion (menos Moretti) así como también estar al tanto de las novedades de los partidos y puntajes de los torneos actuales.

---------------------------------------------------

## INSTRUCCIONES DE USO PARA DESARROLLO

### Requisitos previos
- Tener Docker y Docker Compose instalados.
- Tener Make instalado.

### Configuracion inicial

- Renombrar y completar el `.env.example` a `.env`.
- La base de datos toma el archivo `init.sql` como plantilla inicial al crearse el contenedor por   primera vez. Este archivo tiene todas las tablas y entidades vacias.
- El proyecto tiene dos modos de despliegue, *dev* para desarollo local sin el tunel de Cloudflare, y *prod* para produccion incluyendo el tunel.

### Instrucciones makefile

**Desarrollo local:**
- `make local` - Levantar frontend, API y base de datos
- `make local-down` - Detener todos los servicios
- `make local-restart` - Reiniciar servicios

**Producción:**
- `make prod` - Levantar todo con túnel Cloudflare (solo en servidor)
- `make prod-down` - Detener contenedores de producción

**Servicios individuales:**
- `make nginx` - Levantar solo el frontend
- `make postgres` - Levantar solo la base de datos
- `make api` - Levantar solo la API

**Utilidades:**
- `make logs` - Ver logs en tiempo real
- `make build` - Construir/reconstruir imágenes sin cache previo
- `make ps` - Ver estado de los contenedores
- `make clean` - Limpia la imagen antigua junto al volumen utilizado por la db

### Acceso
- **Frontend**: http://localhost:80/
- **API**: http://localhost:3000/
- **Base de datos**: localhost:5432