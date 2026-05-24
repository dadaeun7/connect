cd back
./gradlew clean build
./gradlew bootJar
docker compose build --no-cache backend
cd ..