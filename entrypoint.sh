#!/bin/sh
set -e

# 1. Determina o perfil ativo (dev ou prod)
# SPRING_PROFILES_ACTIVE será injetado pelo docker-compose ou pelo Railway
export ACTIVE_PROFILE=${SPRING_PROFILES_ACTIVE:-dev}

echo "Iniciando aplicação no ambiente: ${ACTIVE_PROFILE}"

# 2. Leitura das Credenciais e HOST:
if [ "$ACTIVE_PROFILE" = "prod" ]; then
    # -- Ambiente Railway/Produção --
    # O Railway injeta as variáveis como DB_USER, DB_PASS, etc.
    # O HOST do DB será o nome do serviço no docker-compose (funciona na rede interna do Railway)
    DB_HOST="postgres-meuapp"
    DB_PORT="5432"
    SPRING_DATASOURCE_USERNAME="${DB_USER}"
    SPRING_DATASOURCE_PASSWORD="${DB_PASS}"
    DB_NAME="${DB_NAME}"
    
else
    # -- Ambiente Local/Desenvolvimento --
    # O Docker local lê as credenciais dos arquivos secretos mapeados.
    DB_HOST="postgres-meuapp"
    DB_PORT="5432"
    SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/pg_user)
    SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/pg_password)
    DB_NAME=$(cat /run/secrets/pg_db)
fi

# Exporta todas as variáveis para o ambiente do contêiner
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD
export DB_NAME
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Configurando a conexão com: ${DB_HOST}:${DB_PORT}/${DB_NAME}"

# 3. Construção dos Argumentos da JVM (CATALINA_OPTS)
# Injeta as propriedades diretamente na aplicação Spring Boot
export CATALINA_OPTS="$CATALINA_OPTS \
    -Dspring.profiles.active=${ACTIVE_PROFILE} \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    -Dspring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Injetando propriedades da JVM via CATALINA_OPTS..."

# 4. Executa o comando padrão do Tomcat
exec catalina.sh run