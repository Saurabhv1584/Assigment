import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('ingestion')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  // Trigger Ingestion
  // @Post(':id')
  // async trigger(@Param('id') id: number) {
  //   return this.ingestionService.triggerIngestion(id);
  // }

  // Get Ingestion Status
  @Get('status/:id')
  @UseGuards(RolesGuard)  
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "GET ingestion status"})
  @ApiOkResponse({
    description: "successfully find ingestion status"
  })
  @ApiNotFoundResponse({
    description: "No data found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async getStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }

}
