import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';
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
import { Application } from '../../../../entities';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  getApplications(): Promise<Application[]> {
    return this.applicationService.findAll();
  }

  @Get('/:id')
  getApplicationById(@Param('id', ParseIntPipe) id: number): Promise<Application> {
    return this.applicationService.findOne(id);
  }

  @Post()
  @Header('Cache-Control', 'none')
  createApplication(@Body() dto: CreateApplicationDto): Promise<Application> {
    const promise = new Promise<Application>((resolve, reject) => {
      try {
        const application = this.applicationService
          .createApplication(dto)
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
  updateApplication(@Body() dto: UpdateApplicationDto): Promise<Application> {
    const promise = new Promise<Application>((resolve, reject) => {
      try {
        const application = this.applicationService
          .updateApplication(dto)
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
