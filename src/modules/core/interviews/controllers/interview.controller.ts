import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { Interview } from '../../../../entities';
import { InterviewService } from '../services/interview.service';
import { CreateInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  getInterviews(): Promise<Interview[]> {
    return this.interviewService.findAll();
  }

  @Get('/:id')
  getInterviewById(@Param('id', ParseIntPipe) id: number): Promise<Interview> {
    return this.interviewService.findOne(id);
  }

  @Post()
  @Header('Cache-Control', 'none')
  createInterview(@Body() dto: CreateInterviewDto): Promise<Interview> {
    const promise = new Promise<Interview>((resolve, reject) => {
      try {
        const interview = this.interviewService
          .createInterview(dto)
          .then((interview) => interview)
          .catch((err) => {
            throw err;
          });
        resolve(interview);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((interview) => interview);
  }

  @Patch()
  @Header('Cache-Control', 'none')
  updateInterview(@Body() dto: UpdateInterviewDto): Promise<Interview> {
    const promise = new Promise<Interview>((resolve, reject) => {
      try {
        const interview = this.interviewService
          .updateInterview(dto)
          .then((interview) => interview)
          .catch((err) => {
            throw err;
          });
        resolve(interview);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((interview) => interview);
  }

  @Delete('/:id')
  removeInterviewById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.interviewService.remove(id);
  }
}
