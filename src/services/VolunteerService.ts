import { Volunteer } from "../entities/Volunteer";
import AppDataSource from "../config/ormconfig";
import { DataSource, Repository } from "typeorm";

interface PaginationParams {
  take?: number;
  skip?: number;
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
    pagination?: PaginationParams
  ): Promise<{ volunteers: Volunteer[]; total: number }> {
    const [volunteers, total] = await this.volunteerRepo.findAndCount({
      where: { project: { id: projectId } },
      take: pagination?.take,
      skip: pagination?.skip,
      order: { createdAt: 'DESC' },
      relations: ["project"]
    });

    return { volunteers, total };
  }

  async getAllVolunteers(
    pagination?: PaginationParams
  ): Promise<{ volunteers: Volunteer[]; total: number }> {
    const [volunteers, total] = await this.volunteerRepo.findAndCount({
      take: pagination?.take,
      skip: pagination?.skip,
      order: { createdAt: 'DESC' },
      relations: ["project"]
    });

    return { volunteers, total };
  }
}
