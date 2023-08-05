import AppDataSource from '@/orm';
import GroupRoleEnum from '@/enum/GroupRoleEnum';
import { Repository } from 'typeorm';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';

export class UserCharacterGroupRepository {
  private repository: Repository<UserCharacterGroup>;

  constructor() {
    this.repository = AppDataSource.manager.getRepository(UserCharacterGroup);
  }

  async save(dto: UserCharacterGroup): Promise<UserCharacterGroup> {
    const newUserCharacterGroup = this.repository.create(dto);
    return await this.repository.save(newUserCharacterGroup);
  }

  async existsByCharacterId(characterId: number): Promise<boolean> {
    const existingCharacter = await this.repository.findOne({
      where: {
        userCharacter: {
          id: characterId,
        },
      },
    });
    return !!existingCharacter;
  }

  async findAllByGroupIdAndActive(
    groupId: number,
    active: boolean
  ): Promise<UserCharacterGroup[]> {
    const queryBuilder =
      this.repository.createQueryBuilder('userCharacterGroup');
    const results = await queryBuilder
      .leftJoinAndSelect('userCharacterGroup.userCharacter', 'userCharacter')
      .where('userCharacterGroup.userCharacterGroup.id = :id', { id: groupId })
      .andWhere('userCharacterGroup.active = :active', { active: active })
      .orderBy('userCharacterGroup.id', 'DESC')
      .getMany();
    const sortedResults = results.sort((a, b) => {
      return this.getGroupRoleId(a.role) - this.getGroupRoleId(b.role);
    });
    return sortedResults;
  }

  private getGroupRoleId(groupRole: GroupRoleEnum): number {
    switch (groupRole) {
      case GroupRoleEnum.Leader:
        return 1;
      case GroupRoleEnum.Captain:
        return 2;
      default:
        return 3;
    }
  }
}