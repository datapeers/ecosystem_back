import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';
import { CreateTableInput } from './dto/create-table.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import GraphQLJSON from 'graphql-type-json';
import { FormsService } from 'src/forms/form/forms.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Table)
export class TableResolver {
  constructor(
    private readonly tableService: TableService,
  ) {}

  @Mutation(() => Table)
  createTable(@Args('createTableInput') createTableInput: CreateTableInput) {
    return this.tableService.create(createTableInput);
  }

  @Query(() => Table, { name: 'table' })
  findOne(@Args('locator', { type: () => String }) locator: string) {
    return this.tableService.findOne({ locator });
  }

  @ResolveField('columns', () => [GraphQLJSON])
  async resolveColumns(@Parent() table: Omit<Table, 'columns'>) {
    return this.tableService.resolveTableColumns(table);
  }
}
