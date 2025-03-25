import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { ResponseDto } from 'src/user/dto/reponse.dto';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';

jest.mock('../../src/user/user.service.ts');

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ userId: '123' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [
        {
          email: 'teasdasdast@gmail.com',
          firstName: 'test',
          lastName: '111',
          id: '6304330d-491b-4185-8d61-359aa6868e1e',
          roles: [UserRole.VIEWER],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'test123@gmail.com',
          firstName: 'test123',
          lastName: '123',
          id: '6304330d-486b-4185-8d61-359aa6868e1e',
          roles: [UserRole.VIEWER],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      const response = await controller.findAll();
      expect(response).toEqual(
        new ResponseDto(HttpStatus.OK, 'Users fetched successfully', result),
      );
    });
  });


  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const createUser = {
        email: "teasdasdast@gmail.com",
        firstName: "test",
        lastName: "111",
        id: "6304330d-491b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(createUser);

      const result = await controller.findOne('6304330d-491b-4185-8d61-359aa6868e1e');
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, 'User fetched successfully', createUser));
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updatedUser = { lastName: 'Doe' };
      const newUser = {
        email: "teasdasdast@gmail.com",
        firstName: "test",
        lastName: "Doe",
        id: "6304330d-491b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(newUser);

      const result = await controller.update('6304330d-491b-4185-8d61-359aa6868e1e', updatedUser);
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, 'User detail updated successfully', newUser));
    });
  });

  describe('updateRole', () => {
    it('should update user roles', async () => {
        const existingUser = {
            id: '6304330d-491b-4185-8d61-359aa6868e1e',
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            roles: [UserRole.VIEWER],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const updatedUser = {
            ...existingUser,
            roles: [UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN],
          };
      jest.spyOn(service, 'updateRole').mockResolvedValue(updatedUser);

      const result = await controller.updateRole('6304330d-491b-4185-8d61-359aa6868e1e', { roles: [UserRole.EDITOR, UserRole.ADMIN] });
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, 'User role updated successfully', updatedUser));
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      const result = await controller.remove('6304330d-491b-4185-8d61-359aa6868e1e');
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, 'User with ID 6304330d-491b-4185-8d61-359aa6868e1e deleted successfully', null));
    });
  });
});
