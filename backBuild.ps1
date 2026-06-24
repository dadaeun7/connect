cd back
./gradlew clean build -x test
./gradlew bootJar
docker compose build --no-cache backend
cd ..