.PHONY: logs build ps local local-down local-restart prod prod-down nginx postgres api clean


# Levantar entorno local sin tunel Cloudflare para desarrollo
local:
	docker compose --profile dev up -d

local-down:
	docker compose --profile dev down

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
	docker compose build --no-cache api

ps:
	docker compose ps 

# Servicios individuales
nginx:
	docker compose --profile dev up -d nginx

postgres:
	docker compose --profile dev up -d postgres

api:
	docker compose --profile dev up -d api

clean:
	docker volume rm tp-ids_pgdata
	docker image rm tp-ids-api
