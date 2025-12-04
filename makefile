.PHONY: up down restart logs build ps local prod


# Levantar entorno local sin tunel Cloudflare para desarrollo
local:
	docker compose --profile dev up -d

local-down:
	docker compose down

local-restart:
	docker compose --profile dev restart


# Levantar entorno para produccion con tunel Cloudflare
prod:
	docker compose --profile prod up -d

prod-down:
	docker compose --profile prod down


# Comandos generales
logs:
	docker compose logs -f

build:
	docker compose build

ps:
	docker compose ps 

# Servicios individuales
nginx:
	docker compose up -d nginx

postgres:
	docker compose up -d postgres
