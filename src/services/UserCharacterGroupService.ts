import { delay, inject, injectable } from 'tsyringe';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { GroupService } from './GroupService';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';
import { UserCharacterGroupRepository } from '@/repositories/UserCharacterGroupRepository';

@injectable()
export class UserCharacterGroupService {
  constructor(
    @inject(UserCharacterGroupRepository)
    private repository: UserCharacterGroupRepository,
    @inject(delay(() => GroupService))
    private groupService: GroupService
  ) {}

  async create(dto: UserCharacterGroup): Promise<SuccessResponse> {
    await this.groupService.existById(dto.userCharacterGroup.id);
    await this.existsByCharacterId(dto.userCharacter.id);
    const exists = await this.repository.existsByCharacterIdAndGroupId(
      dto.userCharacter.id,
      dto.userCharacterGroup.id
    );
    if (exists) {
      throw new ErrorResponse('invite.group.exists');
    }
    await this.repository.save(dto);
    return new SuccessResponse('invite.group.success', 201);
  }

  async getAll(
    groupId: number,
    active: boolean
  ): Promise<UserCharacterGroup[]> {
    return await this.repository.findAllByGroupIdAndActive(groupId, active);
  }

  async existsByCharacterId(characterId: number): Promise<void> {
    const exists = await this.repository.countByCharacterId(characterId);
    if (exists) {
      throw new ErrorResponse('group.character.already.exists');
    }
  }

  async invite(
    id: number,
    characterId: number,
    active: boolean
  ): Promise<SuccessResponse> {
    const userCharacterGroup = await this.repository.findById(id);
    if (!userCharacterGroup) {
      throw new ErrorResponse('invite.group.not.found');
    }
    if (active) {
      userCharacterGroup.active = true;
      await this.repository.save(userCharacterGroup);
      await this.repository.deleteAllByCharacterId(characterId);
      return new SuccessResponse('invite.group.accept.success');
    }
    await this.repository.deleteById(id);
    return new SuccessResponse('invite.group.decline.success');
  }
}
