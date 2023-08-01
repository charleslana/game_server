import { CreateUserCharacterDto } from '@/dto/CreateUserCharacterDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { generateRandomString } from '@/utils/utils';
import { SuccessResponse } from '@/helpers/SuccessResponse';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserCharacterRepository } from '@/repositories/UserCharacterRepository';

export class UserCharacterService {
  private userCharacterRepository = new UserCharacterRepository();
  private characterMaxAmount = 3;

  async create(dto: CreateUserCharacterDto): Promise<SuccessResponse> {
    const count = await this.countUserCharacters(dto.user.id);
    if (count >= this.characterMaxAmount) {
      throw new ErrorResponse('user.character.max.amount');
    }
    const nameExists = await this.userCharacterRepository.existsByName(
      dto.name
    );
    if (nameExists) {
      throw new ErrorResponse('user.character.name.exists');
    }
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

  async getByIdAndUserId(
    userId: number,
    id: number
  ): Promise<UserCharacter | null> {
    const userCharacter = await this.userCharacterRepository.findByIdAndUserId(
      userId,
      id
    );
    if (!userCharacter) {
      throw new ErrorResponse('user.character.not.found');
    }
    return userCharacter;
  }

  async getById(id: number): Promise<UserCharacter | null> {
    const userCharacter = await this.userCharacterRepository.findById(id);
    if (!userCharacter) {
      throw new ErrorResponse('user.character.not.found');
    }
    return userCharacter;
  }

  private async countUserCharacters(userId: number): Promise<number> {
    return await this.userCharacterRepository.countByUserId(userId);
  }
}
