FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -B -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre
ARG JAR_PATH=target/*.jar
RUN adduser --disabled-password --gecos "" appuser \
    && mkdir /app \
    && chown appuser /app
COPY --from=builder /workspace/${JAR_PATH} /app/app.jar
WORKDIR /app
USER appuser
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]