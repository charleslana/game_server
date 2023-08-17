import AppDataSource from '@/orm';
import { Item } from '@/entities/Item';
import { Repository } from 'typeorm';

export class ItemRepository {
  private repository: Repository<Item>;

  constructor() {
    this.repository = AppDataSource.manager.getRepository(Item);
  }

  async findById(id: number): Promise<Item | null> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async findAll(): Promise<Item[]> {
    return await this.repository.find({
      order: {
        id: 'ASC',
      },
    });
  }
}
