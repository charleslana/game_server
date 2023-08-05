import { ErrorResponse } from '@/helpers/ErrorResponse';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';
import { UserCharacterGroupRepository } from '@/repositories/UserCharacterGroupRepository';

export class UserCharacterGroupService {
  private repository = new UserCharacterGroupRepository();

  async create(dto: UserCharacterGroup): Promise<SuccessResponse> {
    const exists = await this.repository.existsByCharacterId(
      dto.userCharacter.id
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
}
