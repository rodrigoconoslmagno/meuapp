#!/bin/sh
set -e

# 1. Determina o perfil ativo (dev ou prod)
# SPRING_PROFILES_ACTIVE será injetado pelo docker-compose ou pelo Railway
export ACTIVE_PROFILE=${SPRING_PROFILES_ACTIVE:-dev}

echo "Iniciando aplicação no ambiente: ${ACTIVE_PROFILE}"

# 2. Leitura das Credenciais e HOST:
if [ "$ACTIVE_PROFILE" = "prod" ]; then
    # -- Ambiente Railway/Produção --
    # Nenhuma variável local precisa ser definida. As variáveis SPRING_DATASOURCE_URL, USER, PASS, etc.
    # já são injetadas no ambiente pela UI do Railway.
    
    # Se a variável SPRING_DATASOURCE_URL existir (injecao da UI), use-a para construir o argumento.
    if [ -n "$SPRING_DATASOURCE_URL" ]; then
        DATASOURCE_URL_ARG="-Dspring.datasource.url=${SPRING_DATASOURCE_URL}"
    else
        # 🛑 FALLBACK (APENAS SE O SPRING_DATASOURCE_URL FALHAR)
        # Use as variáveis PGUSER, PGPASSWORD e PGHOST, que são sempre injetadas.
        DATASOURCE_URL_ARG="-Dspring.datasource.url=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}"
        SPRING_DATASOURCE_USERNAME="${PGUSER}"
        SPRING_DATASOURCE_PASSWORD="${PGPASSWORD}"
        
        echo "Aviso: SPRING_DATASOURCE_URL VAZIA. Usando variaveis padrao PGH*."
    fi
else
    # -- Ambiente Local/Desenvolvimento -- (Mantenha inalterado)
    DB_HOST="postgres-meuapp"
    DB_PORT="5432"
    SPRING_DATASOURCE_USERNAME=$(cat /run/secrets/pg_user)
    SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/pg_password)
    DB_NAME=$(cat /run/secrets/pg_db)

    # Constrói o argumento para DEV
    DATASOURCE_URL_ARG="-Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Exporta todas as variáveis para o ambiente do contêiner
export SPRING_DATASOURCE_USERNAME
export SPRING_DATASOURCE_PASSWORD
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Configurando a conexão com: ${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Condicionalmente, injeta o URL completo se ele existir (modo prod)
if [ "$SPRING_DATASOURCE_URL" ]; then
    # Usa a URL completa injetada pelo Railway. Isso sobrescreve a lógica do host/port/db
    DATASOURCE_URL_ARG="-Dspring.datasource.url=${SPRING_DATASOURCE_URL}"
else
    # Se não for injetado (modo dev), constrói a URL manualmente
    DATASOURCE_URL_ARG="-Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# 3. Construção dos Argumentos da JVM (CATALINA_OPTS)
# Injeta as propriedades diretamente na aplicação Spring Boot
export CATALINA_OPTS="$CATALINA_OPTS \
    -Dspring.profiles.active=${ACTIVE_PROFILE} \
    ${DATASOURCE_URL_ARG} \
    -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    -Dspring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}"

echo "Injetando propriedades da JVM via CATALINA_OPTS..."

# 4. Executa o comando padrão do Tomcat
exec catalina.sh run