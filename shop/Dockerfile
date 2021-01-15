FROM maven:3.6-openjdk-8
#WORKDIR /usr/src/project
#COPY . /usr/src/project
#RUN  cd /usr/src/project && mvn -Dmaven.test.skip package
#WORKDIR /usr/src/java-app
#RUN cp /usr/src/project/target/*.jar ./app.jar
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-jar", "/usr/src/java-app/app.jar"]

WORKDIR /usr/src/java-app
COPY . .
EXPOSE 8090
# CMD ["mvn", "spring-boot:run", "-X"]