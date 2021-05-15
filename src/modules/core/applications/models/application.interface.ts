enum ApplicationStatus {
  WAITIGN = 0,
  APPROVED = 1,
  REJECTED = 2,
}

interface Application {
  id: number;
  job_id: number;
  worker_id: number;
  resume: string;
  approved_status: ApplicationStatus;
}
