import { UserRole } from '@/entities/UserRole';
import { UserRoleDto } from '@/dto/UserRoleDto';
import { UserRoleRepository } from '@/repositories/UserRoleRepository';

export class UserRoleService {
  private userRoleRepository = new UserRoleRepository();

  async create(dto: UserRoleDto): Promise<UserRole> {
    return await this.userRoleRepository.save(dto);
  }
}
