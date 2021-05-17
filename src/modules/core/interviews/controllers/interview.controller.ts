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
  UseGuards,
  Req,
} from '@nestjs/common';
import { Interview } from '../../../../entities';
import { InterviewService } from '../services/interview.service';
import { CreateInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/shared/roles/guards/role.guard';
import { UserRole } from '../../users/dto/user.dto';
import { Roles } from 'src/modules/shared/roles/decorators/role.decorator';

@Controller('interview')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  getInterviews(): Promise<Interview[]> {
    return this.interviewService.findAll();
  }

  @Get('/me')
  getInterviewsByCurrentUser(@Req() req): Promise<Interview[]> {
    const { username, role } = req.user;
    return this.interviewService.findFromCurrentUser(username, role);
  }

  @Get('/:id')
  getInterviewById(@Param('id', ParseIntPipe) id: number): Promise<Interview> {
    return this.interviewService.findOne(id);
  }

  @Post()
  @Roles(UserRole.COMPANY)
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
  @Roles(UserRole.COMPANY)
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
  @Roles(UserRole.COMPANY)
  removeInterviewById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.interviewService.remove(id);
  }
}
