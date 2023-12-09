start_db:
	docker-compose up -d

stop_db:
	docker-compose down

server:
	yarn dev

migrate_db:
	npx prisma migrate dev --name init
	npx prisma migration diff --from-empty --to-schema-data-model prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
	npx prisma db push
	npx prisma generate

.PHONEY: start_db stop_db server migrate_db