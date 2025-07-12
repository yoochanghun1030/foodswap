# Step 1: 베이스 이미지 선택 (Java 21 사용)
FROM eclipse-temurin:21-jdk

# Step 2: 워킹 디렉토리 생성
WORKDIR /app

# Step 3: 프로젝트 파일 복사
COPY . .

# Step 4: 실행 권한 부여
RUN chmod +x mvnw

# Step 5: 빌드 실행
RUN ./mvnw clean package -DskipTests

# Step 6: 앱 실행
CMD ["java", "-jar", "target/foodswap-0.0.1-SNAPSHOT.jar"]
