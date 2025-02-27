import { Volunteer } from "../entities/Volunteer";
import AppDataSource from "../config/ormconfig";
import { DataSource, Repository } from "typeorm";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export default class VolunteerService {
  private volunteerRepo: Repository<Volunteer>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.volunteerRepo = dataSource.getRepository(Volunteer);
  }

  async createVolunteer(
    name: string,
    description: string,
    requirements: string,
    incentive: string,
    projectId: string
  ): Promise<Volunteer> {
    const volunteer = this.volunteerRepo.create({
      name,
      description,
      requirements,
      incentive,
      project: { id: projectId },
    });
    return this.volunteerRepo.save(volunteer);
  }

  async getVolunteerById(id: string): Promise<Volunteer | null> {
    return this.volunteerRepo.findOne({
      where: { id },
      relations: ["project"],
    });
  }

  async getVolunteersByProjectId(
    projectId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Volunteer>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [volunteers, total] = await this.volunteerRepo.findAndCount({
      where: { project: { id: projectId } },
      relations: ["project"],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: volunteers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllVolunteers(options: PaginationOptions = {}): Promise<PaginatedResponse<Volunteer>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [volunteers, total] = await this.volunteerRepo.findAndCount({
      relations: ["project"],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: volunteers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
