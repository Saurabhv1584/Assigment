import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from 'src/document/document.controller';
import { DocumentService } from 'src/document/document.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { JwtService } from 'src/auth/jwt/jwt.service';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocumentService = {
    getFile: jest.fn((id) => {
      return { id, name: 'test-file' };
    }),
    deleteFile: jest.fn((id) => {
      return { message: 'File deleted successfully' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ userId: '123' }),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFile', () => {
    it('should return a file', async () => {
      const id = 1;
      const result = await controller.getFile(id);
      expect(result).toEqual({ id, name: 'test-file' });
      expect(service.getFile).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const id = 1;
      const result = await controller.deleteFile(id);
      expect(result).toEqual({ message: 'File deleted successfully' });
      expect(service.deleteFile).toHaveBeenCalledWith(id);
    });
  });
});