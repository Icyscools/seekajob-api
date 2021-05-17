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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Application } from '../../../../entities';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';
import { RolesGuard } from '../../../shared/roles/guards/role.guard';
import { Roles } from '../../../shared/roles/decorators/role.decorator';
import { UserRole } from '../../users/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('application')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  getApplications(): Promise<Application[]> {
    return this.applicationService.findAll();
  }

  @Get('/me')
  getApplicationsFromCurrentUser(@Req() req): Promise<Application[]> {
    const { username, role } = req.user;
    return this.applicationService.findFromCurrentUser(username, role);
  }

  @Get('/:id')
  getApplicationById(@Param('id', ParseIntPipe) id: number): Promise<Application> {
    return this.applicationService.findOne(id);
  }

  @Post()
  @Roles(UserRole.WORKER)
  @Header('Cache-Control', 'none')
  @UseInterceptors(FileInterceptor('resume'))
  createApplication(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() resumeFile: Express.Multer.File,
  ): Promise<Application> {
    const promise = new Promise<Application>((resolve, reject) => {
      try {
        const application = this.applicationService
          .createApplication(dto, resumeFile)
          .then((Application) => Application)
          .catch((err) => {
            throw err;
          });
        resolve(application);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((Application) => Application);
  }

  @Patch()
  @Header('Cache-Control', 'none')
  @UseInterceptors(FileInterceptor('resume'))
  updateApplication(
    @Body() dto: UpdateApplicationDto,
    @UploadedFile() resumeFile: Express.Multer.File,
  ): Promise<Application> {
    const promise = new Promise<Application>((resolve, reject) => {
      try {
        const application = this.applicationService
          .updateApplication(dto, resumeFile)
          .then((Application) => Application)
          .catch((err) => {
            throw err;
          });
        resolve(application);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((application) => application);
  }

  @Delete('/:id')
  removeApplicationById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.applicationService.remove(id);
  }
}
