import AppDataSource from '@/orm';
import { CreateGroupDto } from '@/dto/CreateGroupDto';
import { Group } from '@/entities/Group';
import { ILike, Like, Not, Repository } from 'typeorm';
import { PaginatedResultDto } from '@/dto/PaginatedResultDto';

export class GroupRepository {
  private repository: Repository<Group>;

  constructor() {
    this.repository = AppDataSource.manager.getRepository(Group);
  }

  async save(dto: CreateGroupDto): Promise<Group> {
    const newGroup = this.repository.create(dto);
    return await this.repository.save(newGroup);
  }

  async findById(id: number): Promise<Group | null> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async findPaginated(
    page: number,
    itemsPerPage: number
  ): Promise<PaginatedResultDto<Group>> {
    const [groups, totalCount] = await this.repository.findAndCount({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const hasNextPage = page < totalPages;
    const paginatedResult = new PaginatedResultDto(
      groups,
      totalCount,
      totalPages,
      page,
      hasNextPage
    );
    return paginatedResult;
  }

  async search(query: string): Promise<Group[]> {
    return await this.repository.find({
      where: [{ name: Like(`%${query}%`) }, { tag: Like(`%${query}%`) }],
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { name: ILike(name) },
    });
    return !!existing;
  }

  async existsByTag(tag: string): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { tag: ILike(tag) },
    });
    return !!existing;
  }

  async existsByNameAndNotId(name: string, id: number): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { name: ILike(name), id: Not(id) },
    });
    return !!existing;
  }

  async existsByTagAndNotId(tag: string, id: number): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { tag: ILike(tag), id: Not(id) },
    });
    return !!existing;
  }

  async countById(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id: id } });
    return count > 0;
  }
}
