# ============================================
# STAGE 1: Build do Frontend (Node/React)
# ============================================
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

# Copia e instala dependências e scripts do frontend
COPY frontend/package*.json ./
COPY frontend/ ./

# 🟩 Executa a regra otimizada "build:war"
# Esta regra compila e copia os arquivos estáticos para o local que o Maven espera.
RUN npm install
RUN npm run build:war 

# ============================================
# STAGE 2: Build do Backend (Spring Boot WAR)
# ============================================
FROM maven:3.9.9-eclipse-temurin-21 as meuapp-build
WORKDIR /app

# Copia o código completo do backend
COPY meuapp/ ./meuapp/ 

# Navega para a pasta do Maven
WORKDIR /app/meuapp 

# Copia o pom.xml (e instala dependências)
COPY meuapp/pom.xml .
RUN mvn dependency:go-offline -B

# 🟩 COPIA O OUTPUT ESTÁTICO DO FRONTEND (PASTA 'dist') DIRETAMENTE
# Garante que a pasta webapp do Maven exista
RUN mkdir -p src/main/webapp

# Copia os arquivos compilados (que o 'npm run build' gerou na pasta 'dist')
# O caminho final (onde os arquivos estáticos do front estão) é /app/frontend/dist/ no estágio anterior
COPY --from=frontend-build /app/frontend/dist/ ./src/main/webapp/

# Gera o WAR.
RUN mvn clean package -DskipTests

# ============================================
# STAGE 3: Tomcat Final (Runtime)
# ============================================
FROM tomcat:10.1.49-jre21
WORKDIR /usr/local/tomcat

# Remove apenas os apps padrão do Tomcat (ROOT etc)
RUN rm -rf webapps/*

# Copia o WAR completo (com front + WEB-INF) para a pasta webapps
COPY --from=meuapp-build /app/meuapp/target/meuapp.war webapps/meuapp.war

# ✅ CORREÇÃO 1: Copia o script para a pasta raiz do Tomcat (ou bin local)
# Vamos usar a pasta raiz do Tomcat para simplificar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080

# ✅ CORREÇÃO 2: Define o script como ENTRYPOINT/CMD
# Usar ENTRYPOINT garante que ele seja o primeiro comando a ser executado
ENTRYPOINT ["./entrypoint.sh"]
# O CMD deve ser um argumento do ENTRYPOINT (embora não seja usado aqui, é a convenção)
CMD ["run"] 