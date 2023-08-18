import AppDataSource from '@/orm';
import { DeleteResult, Repository } from 'typeorm';
import { UserCharacterItem } from '@/entities/UserCharacterItem';

export class UserCharacterItemRepository {
  private userCharacterItemRepository: Repository<UserCharacterItem>;

  constructor() {
    this.userCharacterItemRepository =
      AppDataSource.manager.getRepository(UserCharacterItem);
  }

  async save(userCharacterItem: UserCharacterItem): Promise<UserCharacterItem> {
    const newUserCharacter =
      this.userCharacterItemRepository.create(userCharacterItem);
    return await this.userCharacterItemRepository.save(newUserCharacter);
  }

  async countByCharacterId(characterId: number): Promise<number> {
    return await this.userCharacterItemRepository.count({
      where: {
        userCharacter: {
          id: characterId,
        },
      },
    });
  }

  async findByIdAndCharacterId(
    characterId: number,
    id: number
  ): Promise<UserCharacterItem | null> {
    return await this.userCharacterItemRepository.findOne({
      where: {
        userCharacter: {
          id: characterId,
        },
        id: id,
      },
      relations: ['item'],
    });
  }

  async findAllByCharacterId(
    characterId: number
  ): Promise<UserCharacterItem[]> {
    return await this.userCharacterItemRepository.find({
      where: {
        userCharacter: {
          id: characterId,
        },
      },
      order: {
        id: 'DESC',
      },
      relations: ['item'],
    });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.userCharacterItemRepository.delete({
      id: id,
    });
  }
}
