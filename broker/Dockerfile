# Базовый образ, содержащий openjdk 8 и maven 3.6
FROM maven:3.6-openjdk-8
WORKDIR /usr/src/java-app
COPY . .
EXPOSE 8091
# Электронная почта поддержки
# MAINTAINER tyaa@ukr.net

# Путь в файловой системе жесткого диска внутри контейнера для размещения файлов проекта
# WORKDIR /usr/src/project

# COPY . /usr/src/project/

# RUN mvn package

# WORKDIR /usr/src/java-app

# RUN cp /usr/src/project/target/*.jar ./app.jar

# Открытие порта 8090 для доступа вне контейнера
# EXPOSE 8090

# CMD ["java", "-jar", "app.jar"]