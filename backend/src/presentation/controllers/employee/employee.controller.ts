import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeLoginUseCase } from '../../../application/use-cases/employee/employee-login.use-case';
import { EmployeeLoginRequestDto } from '../../dto/employee/employee-login-request.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeLoginUseCase: EmployeeLoginUseCase,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: EmployeeLoginRequestDto) {
    return this.employeeLoginUseCase.execute(dto);
  }
}
