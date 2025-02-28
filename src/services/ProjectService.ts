import AppDataSource from '../config/ormconfig';
import { Project } from '../entities/Project';
// import { Equal } from 'typeorm'; // Commented out until its usage is confirmed

interface PaginationParams {
  take?: number;
  skip?: number;
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
    pagination?: PaginationParams
  ): Promise<{ projects: Project[]; total: number }> {
    const [projects, total] = await this.projectRepo.findAndCount({
      where: { organization: { id: organizationId } },
      take: pagination?.take,
      skip: pagination?.skip,
      order: { createdAt: 'DESC' }
    });

    return { projects, total };
  }

  async getAllProjects(
    pagination?: PaginationParams
  ): Promise<{ projects: Project[]; total: number }> {
    const [projects, total] = await this.projectRepo.findAndCount({
      take: pagination?.take,
      skip: pagination?.skip,
      order: { createdAt: 'DESC' }
    });

    return { projects, total };
  }
}

export default ProjectService;
