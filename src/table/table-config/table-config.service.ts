import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTableConfigInput } from './dto/create-table-config.input';
import { TableConfig } from './entities/table-config.entity';
import { FormsService } from 'src/forms/form/forms.service';
import { RowConfigColumn } from '../models/row-config-column';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class TableConfigService {
  constructor(
    @InjectModel(TableConfig.name)
    private readonly tableConfigModel: Model<TableConfig>,
    private readonly formsService: FormsService,
  ) {}

  /**
   * find table config by table
   */
  async findMany(table: string): Promise<TableConfig[]> {
    const tableConfigs = await this.tableConfigModel
      .find({ table, deletedAt: null })
      .lean();
    return tableConfigs;
  }

  /**
   * find table config by id
   */
  async findOne(id: string): Promise<TableConfig> {
    const tableConfig = await this.tableConfigModel.findById(id).lean();
    if (!tableConfig)
      throw new NotFoundException(
        `Couldn't find a table config by the specified id: ${id}`,
      );
    return tableConfig;
  }

  /**
   * create a new table config
   */
  async createFromTable(
    columns: RowConfigColumn[],
    data: CreateTableConfigInput,
  ) {
    const createdTableConfig = await this.tableConfigModel.create({
      ...data,
      columns,
    });
    return createdTableConfig;
  }

  /**
   * update a table config
   */
  async update(id: string, data: Partial<TableConfig>) {
    const updatedTableConfig = await this.tableConfigModel
      .findByIdAndUpdate(id, { ...data }, { new: true })
      .lean();
    return updatedTableConfig;
  }

  /**
   * soft delete a table config
   */
  async delete(id: string) {
    const updateResult = await this.tableConfigModel.updateOne(
      { _id: id },
      { deletedAt: Date.now() },
    );
    return updateResult;
  }
}
