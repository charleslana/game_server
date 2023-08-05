import * as bcrypt from 'bcrypt';
import { AuthDto } from '@/dto/AuthDto';
import { AuthService } from '@/services/AuthService';
import { CreateUserDto } from '@/dto/CreateUserDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { formatDate } from '@/utils/utils';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UpdateNamedDto } from '@/dto/UpdateNameDto';
import { UpdatePasswordDto } from '@/dto/UpdatePasswordDto';
import { User } from '@/entities/User';
import { UserRepository } from '@/repositories/UserRepository';
import { UserRoleDto } from '@/dto/UserRoleDto';
import { UserRoleService } from '@/services/UserRoleService';

export class UserService {
  private saltRounds = 10;
  private userRepository = new UserRepository();
  private userRoleService = new UserRoleService();
  private authService = new AuthService();

  async create(dto: CreateUserDto): Promise<SuccessResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ErrorResponse('user.email.exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    dto.password = passwordHash;
    const user = await this.userRepository.save(dto);
    const userRoleDto: UserRoleDto = {
      user: user,
    };
    await this.userRoleService.create(userRoleDto);
    return new SuccessResponse('user.register.success', 201);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async authenticateAndGenerateToken(dto: AuthDto): Promise<string> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ErrorResponse('user.email.password.invalid', 401);
    }
    if (user.bannedTime != null && user.bannedTime > new Date()) {
      throw new ErrorResponse('user.banned', 401, formatDate(user.bannedTime));
    }
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new ErrorResponse('user.email.password.invalid', 401);
    }
    const token = this.authService.generateToken(user);
    return token;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ErrorResponse('user.not.found');
    }
    return user;
  }

  async updatePassword(
    userId: number,
    dto: UpdatePasswordDto
  ): Promise<SuccessResponse> {
    const user = await this.getById(userId);
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new ErrorResponse('user.password.invalid');
    }
    const newPasswordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);
    user.password = newPasswordHash;
    await this.userRepository.save(user);
    return new SuccessResponse('user.password.updated');
  }

  async updateName(
    userId: number,
    dto: UpdateNamedDto
  ): Promise<SuccessResponse> {
    const user = await this.getById(userId);
    user.name = dto.name;
    await this.userRepository.save(user);
    return new SuccessResponse('user.name.updated');
  }
}
