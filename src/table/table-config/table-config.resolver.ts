import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateTableConfigInput } from './dto/create-table-config.input';
import { TableConfig } from './entities/table-config.entity';
import { TableConfigService } from './table-config.service';
import { TableService } from '../table/table.service';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AuthUser } from 'src/auth/types/auth-user';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateTableConfigInput } from './dto/update-table-config.input';
/**
 * @ignore
 */
@Resolver(() => TableConfig)
export class TableConfigResolver {
  constructor(
    private readonly tableConfigService: TableConfigService,
    private readonly tableService: TableService,
  ) {}

  @Query(() => TableConfig, { name: 'tableConfig' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.tableConfigService.findOne(id);
  }

  @Query(() => [TableConfig], { name: 'tableConfigs' })
  findMany(@Args('table', { type: () => String }) table: string) {
    return this.tableConfigService.findMany(table);
  }

  @Mutation(() => TableConfig)
  async createTableConfig(
    @Args('createTableConfigInput')
    createTableConfigInput: CreateTableConfigInput,
  ) {
    const table = await this.tableService.findOne({
      _id: createTableConfigInput.table,
    });
    const columns = await this.tableService.resolveTableColumns(table);
    return this.tableConfigService.createFromTable(
      columns,
      createTableConfigInput,
    );
  }

  @Mutation(() => TableConfig)
  updateTableConfig(
    @Args('updateTableConfigInput')
    updateTableConfigInput: UpdateTableConfigInput,
  ) {
    return this.tableConfigService.update(
      updateTableConfigInput._id,
      updateTableConfigInput,
    );
  }

  @Mutation(() => UpdateResultPayload)
  deleteTableConfig(@Args('id') id: string) {
    return this.tableConfigService.delete(id);
  }
}
