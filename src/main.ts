import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("APP_PORT") || 3000;

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("User Management API")
    .setDescription("API documentation for User Management")
    .setVersion("1.0")
    .addBearerAuth(
      {
        description: "Please add the token in following format : <jwt_token>",
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "access-token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  await app.listen(port);
}
bootstrap();
