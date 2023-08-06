import GroupRoleEnum from '@/enum/GroupRoleEnum';
import { CreateGroupDto } from '@/dto/CreateGroupDto';
import { delay, inject, injectable } from 'tsyringe';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { Group } from '@/entities/Group';
import { GroupRepository } from '@/repositories/GroupRepository';
import { PageDto } from '@/dto/PageDto';
import { PaginatedResultDto } from '@/dto/PaginatedResultDto';
import { SearchGroupDto } from '@/dto/SearchGroupDto';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';
import { UserCharacterGroupService } from '@/services/UserCharacterGroupService';

@injectable()
export class GroupService {
  constructor(
    @inject(GroupRepository)
    private repository: GroupRepository,
    @inject(delay(() => UserCharacterGroupService))
    private userCharacterGroupService: UserCharacterGroupService
  ) {}

  async create(dto: CreateGroupDto): Promise<SuccessResponse> {
    const nameExists = await this.repository.existsByName(dto.name);
    if (nameExists) {
      throw new ErrorResponse('group.name.exists');
    }
    const tagExists = await this.repository.existsByTag(dto.tag);
    if (tagExists) {
      throw new ErrorResponse('group.tag.exists');
    }
    await this.userCharacterGroupService.existsByCharacterId(
      dto.userCharacter.id
    );
    const group = await this.repository.save(dto);
    const userCharacterGroup = new UserCharacterGroup();
    const userCharacter = new UserCharacter();
    userCharacter.id = dto.userCharacter.id;
    userCharacterGroup.userCharacter = userCharacter;
    userCharacterGroup.userCharacterGroup = group;
    userCharacterGroup.active = true;
    userCharacterGroup.role = GroupRoleEnum.Leader;
    await this.userCharacterGroupService.create(userCharacterGroup);
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

  async existById(id: number): Promise<void> {
    const exists = await this.repository.countById(id);
    if (!exists) {
      throw new ErrorResponse('group.not.found');
    }
  }
}
