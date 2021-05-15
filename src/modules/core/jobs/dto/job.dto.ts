export interface Job {
  id: number;
  companyId: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  recruit_amount: number;
  welfare: string;
}

export type CreateJobDto = Partial<Job>;
export type UpdateJobDto = Partial<Job>;
