import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePolicyDto } from '../../application/dtos/create-policy.dto';
import { TransitionPolicyDto } from '../../application/dtos/transition-policy.dto';
import { PolicyResponseDto } from '../../application/dtos/policy-response.dto';
import { CreatePolicyUseCase } from '../../application/use-cases/create-policy.use-case';
import { TransitionPolicyUseCase } from '../../application/use-cases/transition-policy.use-case';
import { FindPolicyUseCase } from '../../application/use-cases/find-policy.use-case';
import { ListPoliciesUseCase } from '../../application/use-cases/list-policies.use-case';
import { PolicyStatus } from '../../domain/enums/policy-status.enum';

@ApiTags('Policies')
@Controller('api/policies')
export class PoliciesController {
  constructor(
    private readonly createPolicyUseCase: CreatePolicyUseCase,
    private readonly transitionPolicyUseCase: TransitionPolicyUseCase,
    private readonly findPolicyUseCase: FindPolicyUseCase,
    private readonly listPoliciesUseCase: ListPoliciesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create/quote a new insurance policy' })
  @ApiResponse({ status: 201, type: PolicyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid branch, strategy, or risk profile' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async create(@Body() dto: CreatePolicyDto): Promise<PolicyResponseDto> {
    const policy = await this.createPolicyUseCase.execute(dto);
    return PolicyResponseDto.fromDomain(policy);
  }

  @Get()
  @ApiOperation({ summary: 'List all policies' })
  @ApiResponse({ status: 200, type: [PolicyResponseDto] })
  async findAll(): Promise<PolicyResponseDto[]> {
    const policies = await this.listPoliciesUseCase.execute();
    return policies.map(PolicyResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find policy by ID' })
  @ApiResponse({ status: 200, type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PolicyResponseDto> {
    const policy = await this.findPolicyUseCase.execute(id);
    return PolicyResponseDto.fromDomain(policy);
  }

  @Patch(':id/transition')
  @ApiOperation({ summary: 'Transition policy to a new status' })
  @ApiResponse({ status: 200, type: PolicyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async transition(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: TransitionPolicyDto,
  ): Promise<PolicyResponseDto> {
    const policy = await this.transitionPolicyUseCase.execute(
      id,
      dto.status as PolicyStatus,
    );
    return PolicyResponseDto.fromDomain(policy);
  }
}
