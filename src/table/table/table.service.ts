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

  async findOne(filters: { _id?: string; locator?: string }): Promise<Table> {
    const table = await this.tableModel.findOne(filters);
    if (!table)
      throw new NotFoundException(
        `Couldn't find a table by the specified filters: ${filters}`,
      );
    return table;
  }

  async resolveTableColumns(table: Table) {
    const form = await this.formsService.findOne(table.form);
    const formComponents = JSON.parse(form.formJson);
    const columns = tableUtilities.convertFormToColumns(
      formComponents.components,
    );
    return columns;
  }
}
