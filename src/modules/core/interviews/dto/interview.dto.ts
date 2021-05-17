export interface InterviewDto {
  id: number;
  applicationId: number;
  datetime: Date;
  description?: string;
}

export type CreateInterviewDto = Partial<InterviewDto>;
export type UpdateInterviewDto = Partial<InterviewDto>;
