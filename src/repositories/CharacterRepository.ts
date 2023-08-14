import AppDataSource from '@/orm';
import { Character } from '@/entities/Character';
import { Repository } from 'typeorm';

export class CharacterRepository {
  private repository: Repository<Character>;

  constructor() {
    this.repository = AppDataSource.manager.getRepository(Character);
  }

  async findById(id: number): Promise<Character | null> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async findAll(): Promise<Character[]> {
    return await this.repository.find({
      order: {
        id: 'ASC',
      },
    });
  }
}
