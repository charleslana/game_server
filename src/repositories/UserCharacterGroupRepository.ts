import AppDataSource from '@/orm';
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
}
