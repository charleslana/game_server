import { ErrorResponse } from '@/helpers/ErrorResponse';
import { ItemService } from '@/services/ItemService';
import { UserCharacterItem } from '@/entities/UserCharacterItem';
import { UserCharacterItemRepository } from '@/repositories/UserCharacterItemRepository';

export class UserCharacterItemService {
  private userCharacterItemRepository = new UserCharacterItemRepository();
  private itemService = new ItemService();

  async create(userCharacterItem: UserCharacterItem): Promise<void> {
    const maxAmount = 50;
    const count = await this.userCharacterItemRepository.countByCharacterId(
      userCharacterItem.userCharacter.id
    );
    if (count >= maxAmount) {
      throw new ErrorResponse('user.character.item.max.amount');
    }
    await this.itemService.getById(userCharacterItem.item.id);
    await this.userCharacterItemRepository.save(userCharacterItem);
  }

  async getAll(characterId: number): Promise<UserCharacterItem[]> {
    return await this.userCharacterItemRepository.findAllByCharacterId(
      characterId
    );
  }

  async getByIdAndCharacterId(
    characterId: number,
    id: number
  ): Promise<UserCharacterItem> {
    const userCharacter =
      await this.userCharacterItemRepository.findByIdAndCharacterId(
        characterId,
        id
      );
    if (!userCharacter) {
      throw new ErrorResponse('user.character.item.not.found');
    }
    return userCharacter;
  }

  async exclude(characterId: number, id: number): Promise<void> {
    await this.userCharacterItemRepository.findByIdAndCharacterId(
      characterId,
      id
    );
    await this.userCharacterItemRepository.deleteById(id);
  }
}
