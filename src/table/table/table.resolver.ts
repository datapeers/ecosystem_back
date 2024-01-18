import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';
import { CreateTableInput } from './dto/create-table.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import GraphQLJSON from 'graphql-type-json';
import { AddTableJoinInput } from './dto/add-table-join.input';
import { ColumnGroup } from './entities/column-group';
import { TableColumn } from 'src/shared/models/table-column';
import { RemoveTableJoinInput } from './dto/remove-table-join.input';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Table)
export class TableResolver {
  constructor(private readonly tableService: TableService) {}

  @Mutation(() => Table)
  createTable(
    @Args('createTableInput') createTableInput: CreateTableInput,
  ): Promise<Table> {
    return this.tableService.create(createTableInput);
  }

  @Mutation(() => Table)
  async addTableJoin(
    @Args('addTableJoinInput') addTableJoinInput: AddTableJoinInput,
  ): Promise<Table> {
    return await this.tableService.addTableJoin(addTableJoinInput);
  }

  @Mutation(() => Table)
  async removeTableJoin(
    @Args('removeTableJoinInput') removeTableJoinInput: RemoveTableJoinInput,
  ): Promise<Table> {
    return await this.tableService.removeTableJoin(removeTableJoinInput);
  }

  @Query(() => Table, { name: 'table' })
  findOne(
    @Args('locator', { type: () => String }) locator: string,
  ): Promise<Table> {
    return this.tableService.findOne({ locator });
  }

  @ResolveField('columns', () => [GraphQLJSON])
  async resolveColumns(
    @Parent() table: Omit<Table, 'columns'>,
  ): Promise<TableColumn[]> {
    return this.tableService.resolveTableColumns(table);
  }

  @ResolveField('columnGroups', () => [GraphQLJSON])
  async resolveColumnGroups(
    @Parent() table: Omit<Table, 'columnGroups'>,
  ): Promise<ColumnGroup[]> {
    return this.tableService.resolveTableGroups(table);
  }
}
