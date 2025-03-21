"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get("APP_PORT") || 3000;
    const config = new swagger_1.DocumentBuilder()
        .setTitle("User Management API")
        .setDescription("API documentation for User Management")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    }, "access-token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map