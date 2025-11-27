# ============================
# STAGE 1: Build do frontend
# ============================
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

# Copia e instala dependências
COPY frontend/package*.json ./
RUN npm install

# Copia o código e faz o build
COPY frontend/ ./
RUN npm run build

# ============================
# STAGE 2: Build do backend (Spring Boot WAR)
# ============================
FROM maven:3.9.9-eclipse-temurin-21 as meuapp-build
WORKDIR /app/meuapp

# Copia o pom.xml primeiro para aproveitar cache
COPY meuapp/pom.xml ./
RUN mvn dependency:go-offline -B

# Copia o código completo do backend
COPY meuapp/ ./

# 🟩 Copia o build do React para dentro do webapp (sem apagar WEB-INF)
# Criamos a pasta, caso não exista, e só adicionamos os arquivos do front
RUN mkdir -p src/main/webapp/
COPY --from=frontend-build /app/frontend/dist/ ./src/main/webapp/

# Gera o WAR com o front embutido e WEB-INF preservado
RUN mvn clean package -DskipTests

# ============================
# STAGE 3: Tomcat final
# ============================
FROM tomcat:10.1.49-jre21
WORKDIR /usr/local/tomcat

# Remove apenas os apps padrão do Tomcat (ROOT etc)
RUN rm -rf webapps/*

# Copia o WAR completo (com front + WEB-INF)
COPY --from=meuapp-build /app/meuapp/target/meuapp.war webapps/meuapp.war

# 1. Copia o script entrypoint.sh da sua máquina Host para um local executável no container
COPY entrypoint.sh /usr/local/bin/entrypoint.sh 
# 2. Garante a permissão de execução
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080
# 3. Define o CMD para rodar o script entrypoint.sh
# Nosso script agora assume a função de comando principal e executa o Tomcat no final.
CMD ["/usr/local/bin/entrypoint.sh"]
