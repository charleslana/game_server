import AppDataSource from '@/orm';
import { CreateUserCharacterDto } from '@/dto/CreateUserCharacterDto';
import { ILike, Not, Repository } from 'typeorm';
import { UserCharacter } from '@/entities/UserCharacter';

export class UserCharacterRepository {
  private userCharacterRepository: Repository<UserCharacter>;

  constructor() {
    this.userCharacterRepository =
      AppDataSource.manager.getRepository(UserCharacter);
  }

  async save(dto: CreateUserCharacterDto): Promise<UserCharacter> {
    const newUserCharacter = this.userCharacterRepository.create(dto);
    return await this.userCharacterRepository.save(newUserCharacter);
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.userCharacterRepository.count({
      where: {
        user: {
          id: userId,
        },
        active: true,
      },
    });
  }

  async findByIdAndUserId(
    userId: number,
    id: number
  ): Promise<UserCharacter | null> {
    return await this.userCharacterRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: id,
        active: true,
      },
    });
  }

  async findAllByUserId(userId: number): Promise<UserCharacter[]> {
    return await this.userCharacterRepository.find({
      where: {
        user: {
          id: userId,
        },
        active: true,
      },
      order: {
        id: 'DESC',
      },
      relations: ['character'],
    });
  }

  async findById(id: number): Promise<UserCharacter | null> {
    return await this.userCharacterRepository.findOne({
      where: {
        id: id,
        active: true,
      },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const existingCharacter = await this.userCharacterRepository.findOne({
      where: { name: ILike(name) },
    });
    return !!existingCharacter;
  }

  async existsByNameAndNotCharacterId(
    name: string,
    characterId: number
  ): Promise<boolean> {
    const existingCharacter = await this.userCharacterRepository.findOne({
      where: { name: ILike(name), id: Not(characterId) },
    });
    return !!existingCharacter;
  }
}
