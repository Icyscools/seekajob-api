export interface InterviewDto {
  id: number;
  applicationId: number;
  datetime: Date;
}

export type CreateInterviewDto = Partial<InterviewDto>;
export type UpdateInterviewDto = Partial<InterviewDto>;
