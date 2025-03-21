import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Logger,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentService } from "./document.service";
import { JwtGuard } from "src/auth/jwt/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/auth/roles/roles.decorator";
import { UserRole } from "src/user/entities/user.entity";
import { RolesGuard } from "src/auth/roles/roles.guard";
import { Request } from "express";

@Controller("files")
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post("upload")
  @UseGuards(RolesGuard)  
  @Roles(UserRole.EDITOR)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("title") title: string,
    @Req() req: any
  ) {
    Logger.log("Received request to upload file " + file);
    const userId = req?.user?.id;

    return this.documentService.uploadFile(file, title, userId);
  }

  @Get("list")
  @UseGuards(RolesGuard)  
  @Roles(UserRole.ADMIN)
  async listFiles(): Promise<any> {
    Logger.log("Listing content of bucket ");
    return this.documentService.listFiles();
  }

  @Get(":id")
  @UseGuards(RolesGuard)  
  @Roles(UserRole.VIEWER, UserRole.EDITOR)
  async getFile(@Param("id") id: number): Promise<any> {
    Logger.log("Get file from s3 bucket with id " + id);
    return this.documentService.getFile(id);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)  
  @Roles(UserRole.ADMIN)
  async deleteFile(@Param("id") id: number): Promise<any> {
    Logger.log("Deleting file from s3 bucket with id " + id);
    await this.documentService.deleteFile(id);
    return { message: "File deleted successfully" };
  }
}
