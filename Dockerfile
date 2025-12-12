FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/ ./

RUN npm install
RUN npm run build:war 

FROM maven:3.9.9-eclipse-temurin-21 as meuapp-build
WORKDIR /app

COPY meuapp/ ./meuapp/ 

WORKDIR /app/meuapp 

COPY meuapp/pom.xml .
RUN mvn dependency:go-offline -B

RUN mkdir -p src/main/webapp

COPY --from=frontend-build /app/frontend/dist/ ./src/main/webapp/

RUN mvn clean package -DskipTests

FROM tomcat:10.1.49-jre21
WORKDIR /usr/local/tomcat

RUN rm -rf webapps/*

COPY --from=meuapp-build /app/meuapp/target/meuapp.war webapps/meuapp.war

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]

CMD ["run"] 