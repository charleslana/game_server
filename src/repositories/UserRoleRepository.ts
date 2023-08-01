import AppDataSource from '@/orm';
import { Repository } from 'typeorm';
import { UserRole } from '@/entities/UserRole';
import { UserRoleDto } from '@/dto/UserRoleDto';

export class UserRoleRepository {
  private userRoleRepository: Repository<UserRole>;

  constructor() {
    this.userRoleRepository = AppDataSource.manager.getRepository(UserRole);
  }

  async save(dto: UserRoleDto): Promise<UserRole> {
    const newUserRole = this.userRoleRepository.create(dto);
    return await this.userRoleRepository.save(newUserRole);
  }
}
