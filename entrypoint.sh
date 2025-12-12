#!/bin/sh
set -e

echo "--- VARIÁVEIS DE AMBIENTE INJETADAS ---"
printenv
echo "---------------------------------------"

export ACTIVE_PROFILE=${SPRING_PROFILES_ACTIVE:-dev}

echo "Iniciando aplicação no ambiente: ${ACTIVE_PROFILE}"

if [ "$ACTIVE_PROFILE" = "prod" ]; then
    DB_HOST="${DB_HOST}"
    BD_PORT="${DB_PORT}"
    
    DB_NAME="${DB_NAME}" 

    SPRING_DATASOURCE_USERNAME="${DB_USER}"
    SPRING_DATASOURCE_PASSWORD="${DB_PASS}"
    JWT_SECRET_KEY="${JWT_SECRET_KEY}"
    
else
    DB_HOST="postgres-meuapp"
    DB_PORT="5432"
    SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/pg_user)
    SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/pg_password)
    DB_NAME=$(cat /run/secrets/pg_db)
    JWT_SECRET_KEY=$(cat /run/secrets/jwt_key)
fi

export DB_HOST
export DB_PORT
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD
export DB_NAME
export JWT_SECRET_KEY
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Configurando a conexão com: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"

export CATALINA_OPTS="$CATALINA_OPTS \
    -Dspring.profiles.active=${ACTIVE_PROFILE} \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    -Dspring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO} \
    -Djwt.secret-key=${JWT_SECRET_KEY}"

echo "Injetando propriedades da JVM via CATALINA_OPTS..."

exec catalina.sh run