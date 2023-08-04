import { CreateGroupDto } from '@/dto/CreateGroupDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { Group } from '@/entities/Group';
import { GroupRepository } from '@/repositories/GroupRepository';
import { PageDto } from '@/dto/PageDto';
import { PaginatedResultDto } from '@/dto/PaginatedResultDto';
import { SearchGroupDto } from '@/dto/SearchGroupDto';
import { SuccessResponse } from '@/helpers/SuccessResponse';

export class GroupService {
  private repository = new GroupRepository();

  async create(dto: CreateGroupDto): Promise<SuccessResponse> {
    const nameExists = await this.repository.existsByName(dto.name);
    if (nameExists) {
      throw new ErrorResponse('group.name.exists');
    }
    const tagExists = await this.repository.existsByTag(dto.tag);
    if (tagExists) {
      throw new ErrorResponse('group.tag.exists');
    }
    await this.repository.save(dto);
    return new SuccessResponse('group.success', 201);
  }

  async findPaginated(dto: PageDto): Promise<PaginatedResultDto<Group>> {
    const itemsPerPage = 10;
    const paginatedResult = await this.repository.findPaginated(
      dto.page,
      itemsPerPage
    );
    return paginatedResult;
  }

  async search(dto: SearchGroupDto): Promise<Group[]> {
    const searchResults = await this.repository.search(dto.query);
    return searchResults;
  }
}
