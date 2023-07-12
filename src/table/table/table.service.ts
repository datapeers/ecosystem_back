import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableInput } from './dto/create-table.input';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './entities/table.entity';
import { Model } from 'mongoose';
import { TableConfigService } from '../table-config/table-config.service';
import { FormsService } from 'src/forms/form/forms.service';
import { tableUtilities } from '../utilities/table.utilities';
import { AddTableJoinInput } from './dto/add-table-join.input';
import { ColumnGroup } from './entities/column-group';
import { RemoveTableJoinInput } from './dto/remove-table-join.input';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    private readonly tableConfigService: TableConfigService,
    private readonly formsService: FormsService,
  ) {}

  async create(data: CreateTableInput): Promise<Table> {
    const createdTable = await this.tableModel.create(data);
    if (!createdTable)
      throw new InternalServerErrorException(
        `Failed to create table with locator ${data.locator}`,
      );
    const initialConfigData = { name: 'Tabla', table: createdTable.id };
    const columns = await this.resolveTableColumns(createdTable);
    const initialConfig = await this.tableConfigService.createFromTable(
      columns,
      initialConfigData,
    );
    if (!initialConfig)
      throw new InternalServerErrorException(
        `Failed to create initial table configuration for table ${createdTable.id}`,
      );
    return createdTable;
  }

  async addTableJoin({ id, join }: AddTableJoinInput): Promise<Table> {
    const updatedTable = await this.tableModel.findByIdAndUpdate(
      id,
      { $addToSet: { joins: join } },
      { new: true, lean: true },
    );
    return updatedTable;
  }

  async removeTableJoin({ id, key }: RemoveTableJoinInput): Promise<Table> {
    const updatedTable = await this.tableModel.findByIdAndUpdate(
      id,
      { $pull: { joins: { key: key } } },
      { new: true, lean: true },
    );
    return updatedTable;
  }

  async findOne(filters: { _id?: string; locator?: string }): Promise<Table> {
    const table = await this.tableModel.findOne(filters);
    if (!table)
      throw new NotFoundException(`Couldn't find a table by the specified filters: ${filters}`);
    return table;
  }

  async resolveTableGroups(table: Omit<Table, 'columnGroups'>): Promise<ColumnGroup[]> {
    const tableJoins = table?.joins ?? [];
    const joinsColumns: Promise<ColumnGroup>[] = tableJoins.map(async join => {
      const joinForm = await this.formsService.findOne(join.form);
      const formComponents = JSON.parse(joinForm.formJson);
      const columns = tableUtilities.convertFormToColumns(formComponents.components, joinForm.documents, join.key);
      const extraColumns = (join?.extraColumns ?? []).map(extraColumn => {
        return {
          ...extraColumn,
          key: `${join.key}; ${extraColumn.key}`,
        };
      });
      return {
        name: joinForm.name,
        key: join.key,
        columns: columns.concat(extraColumns),
      };
    });
    const joins = await Promise.all(joinsColumns);
    return joins;
  }

  async resolveTableColumns(table: Omit<Table, 'columns'>) {
    const form = await this.formsService.findOne(table.form);
    const formComponents = JSON.parse(form.formJson);
    let columns = tableUtilities.convertFormToColumns(
      formComponents.components,
      form.documents,
    );
    if (table.locator.includes('experts phase '))
      columns.push(tableUtilities.columnStartupsExpert());
    if (table.locator.includes('communities')) {
      columns.push(...tableUtilities.columnsCommunities());
    }

    return columns;
  }
}
