import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../application/dtos/create-customer.dto';
import { CustomerResponseDto } from '../../application/dtos/customer-response.dto';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { FindCustomerUseCase } from '../../application/use-cases/find-customer.use-case';
import { ListCustomersUseCase } from '../../application/use-cases/list-customers.use-case';

@ApiTags('Customers')
@Controller('api/customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerUseCase.execute(dto);
    return CustomerResponseDto.fromDomain(customer);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.listCustomersUseCase.execute();
    return customers.map(CustomerResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find customer by ID' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.findCustomerUseCase.execute(id);
    return CustomerResponseDto.fromDomain(customer);
  }
}
