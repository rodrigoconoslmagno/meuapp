#!/bin/sh
set -e

# 1. Leitura dos Secrets: USER e PASSWORD (Já existiam)
export SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/pg_user)
export SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/pg_password)

# 2. Leitura do DB Name: (Adicionado na última etapa)
export DB_NAME=$(cat /run/secrets/pg_db) 

echo "Secrets do DB (User, Password, Name) lidos e injetados no ambiente."

# Exporta a variável DDL-AUTO (que vem do docker-compose)
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO}"

# 2. Construção dos Argumentos da JVM (CATALINA_OPTS)
# Isso garante que as variáveis do contêiner sejam lidas como System Properties (-D)
# e sobreponham TUDO que estiver no application.properties do WAR.

export CATALINA_OPTS="$CATALINA_OPTS \
    -Dspring.profiles.active=prod \
    -Dspring.datasource.url=jdbc:postgresql://postgres_meuapp:5432/${DB_NAME} \
    -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    -Dspring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Injetando propriedades da JVM via CATALINA_OPTS..."

# 4. Executa o comando padrão do Tomcat
exec catalina.sh run
