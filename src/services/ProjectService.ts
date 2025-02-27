import AppDataSource from '../config/ormconfig';
import { Project } from '../entities/Project';
// import { Equal } from 'typeorm'; // Commented out until its usage is confirmed

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

class ProjectService {
  private projectRepo = AppDataSource.getRepository(Project);

  async createProject(
    name: string,
    description: string,
    location: string,
    startDate: Date,
    endDate: Date,
    organizationId: string
  ): Promise<Project> {
    const project = this.projectRepo.create({
      name,
      description,
      location,
      startDate,
      endDate,
      // organization: { id: organizationId }, // Commented out because it depends on the Organization entity
    });
    return this.projectRepo.save(project);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { id }, // Removed Equal to simplify for now
      // relations: ['organization'], // Commented out because it depends on the Organization entity
    });
  }

  async getProjectsByOrganizationId(
    organizationId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Project>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.projectRepo.findAndCount({
      where: {},  // Add organization filter when implemented
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllProjects(options: PaginationOptions = {}): Promise<PaginatedResponse<Project>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.projectRepo.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default ProjectService;
