#!/bin/sh
set -e

# 1. Determina o perfil ativo (dev ou prod)
# SPRING_PROFILES_ACTIVE será injetado pelo docker-compose ou pelo Railway
export ACTIVE_PROFILE=${SPRING_PROFILES_ACTIVE:-dev}

echo "Iniciando aplicação no ambiente: ${ACTIVE_PROFILE}"

# 2. Leitura das Credenciais e HOST:
if [ "$ACTIVE_PROFILE" = "prod" ]; then
    # -- Ambiente Railway/Produção --
    
    # Usamos as variáveis PG* que o Railway SEMPRE injeta.
    DB_HOST="${PGHOST}"
    DB_PORT="${PGPORT}"
    
    # 🛑 CRUCIAL: FORÇAMOS O NOME DO DB PARA O NOME CORRETO (meuapp)
    DB_NAME="meuapp" 
    
    # Usamos as credenciais que o Railway injetou (PGUSER, PGPASSWORD)
    SPRING_DATASOURCE_USERNAME="${PGUSER}"
    SPRING_DATASOURCE_PASSWORD="${PGPASSWORD}"
    
else
    # -- Ambiente Local/Desenvolvimento --
    DB_HOST="postgres-meuapp"
    DB_PORT="5432"
    SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/pg_user)
    SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/pg_password)
    DB_NAME=$(cat /run/secrets/pg_db)
fi

# Exporta todas as variáveis para o ambiente do contêiner
export DB_HOST
export DB_PORT
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD
export DB_NAME
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Configurando a conexão com: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"

# 3. Construção dos Argumentos da JVM (CATALINA_OPTS)
# A URL é construída AQUI para garantir o prefixo JDBC e o nome do DB correto.
export CATALINA_OPTS="$CATALINA_OPTS \
    -Dspring.profiles.active=${ACTIVE_PROFILE} \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    -Dspring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Injetando propriedades da JVM via CATALINA_OPTS..."

# 4. Executa o comando padrão do Tomcat
exec catalina.sh run