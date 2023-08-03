import { CreateUserCharacterDto } from '@/dto/CreateUserCharacterDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { formatDate, generateRandomString } from '@/utils/utils';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UpdateUserCharacterNameDto } from '@/dto/UpdateUserCharacterNameDto';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserCharacterRepository } from '@/repositories/UserCharacterRepository';

export class UserCharacterService {
  private userCharacterRepository = new UserCharacterRepository();
  private characterMaxAmount = 3;
  private hourOfNameTime = 1;

  async create(dto: CreateUserCharacterDto): Promise<SuccessResponse> {
    const count = await this.countUserCharacters(dto.user.id);
    if (count >= this.characterMaxAmount) {
      throw new ErrorResponse('user.character.max.amount');
    }
    await this.checkCharacterNameExists(dto.name);
    await this.userCharacterRepository.save(dto);
    return new SuccessResponse('user.character.success', 201);
  }

  async inactivate(userId: number, id: number): Promise<SuccessResponse> {
    const userCharacter = await this.userCharacterRepository.findByIdAndUserId(
      userId,
      id
    );
    if (!userCharacter) {
      throw new ErrorResponse('user.character.not.found');
    }
    userCharacter.active = false;
    userCharacter.name = generateRandomString();
    await this.userCharacterRepository.save(userCharacter);
    return new SuccessResponse('user.character.inactivated');
  }

  async getAll(userId: number): Promise<UserCharacter[]> {
    return await this.userCharacterRepository.findAllByUserId(userId);
  }

  async getByIdAndUserId(userId: number, id: number): Promise<UserCharacter> {
    const userCharacter = await this.userCharacterRepository.findByIdAndUserId(
      userId,
      id
    );
    if (!userCharacter) {
      throw new ErrorResponse('user.character.not.found');
    }
    return userCharacter;
  }

  async getById(id: number): Promise<UserCharacter> {
    const userCharacter = await this.userCharacterRepository.findById(id);
    if (!userCharacter) {
      throw new ErrorResponse('user.character.not.found');
    }
    return userCharacter;
  }

  async updateImage(
    userId: number,
    characterId: number,
    image: string
  ): Promise<SuccessResponse> {
    const userCharacter = await this.getByIdAndUserId(userId, characterId);
    userCharacter.image = image;
    await this.userCharacterRepository.save(userCharacter);
    return new SuccessResponse('user.character.image.updated');
  }

  async updateName(
    userId: number,
    characterId: number,
    dto: UpdateUserCharacterNameDto
  ): Promise<SuccessResponse> {
    const userCharacter = await this.getByIdAndUserId(userId, characterId);
    if (userCharacter.nameTime != null && userCharacter.nameTime > new Date()) {
      throw new ErrorResponse(
        'user.character.name.time',
        400,
        formatDate(userCharacter.nameTime)
      );
    }
    await this.checkCharacterNameExistsForOtherPlayer(dto.name, characterId);
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + this.hourOfNameTime);
    userCharacter.name = dto.name;
    userCharacter.nameTime = currentDate;
    await this.userCharacterRepository.save(userCharacter);
    return new SuccessResponse('user.character.name.updated');
  }

  private async checkCharacterNameExistsForOtherPlayer(
    name: string,
    characterId: number
  ): Promise<void> {
    const nameExists =
      await this.userCharacterRepository.existsByNameAndNotCharacterId(
        name,
        characterId
      );

    if (nameExists) {
      throw new ErrorResponse('user.character.name.exists');
    }
  }

  private async checkCharacterNameExists(name: string): Promise<void> {
    const nameExists = await this.userCharacterRepository.existsByName(name);
    if (nameExists) {
      throw new ErrorResponse('user.character.name.exists');
    }
  }

  private async countUserCharacters(userId: number): Promise<number> {
    return await this.userCharacterRepository.countByUserId(userId);
  }
}
