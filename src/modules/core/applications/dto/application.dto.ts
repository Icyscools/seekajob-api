export enum ApplicationStatus {
  WAITING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export interface ApplicationDto {
  id: number;
  jobId: number;
  workerId: number;
  resume: string;
  approved_status: ApplicationStatus;
}

export type CreateApplicationDto = Partial<ApplicationDto>;
export type UpdateApplicationDto = Partial<ApplicationDto>;
