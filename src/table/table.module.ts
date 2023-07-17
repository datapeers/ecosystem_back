import { Module, forwardRef } from '@nestjs/common';
import { TableResolver } from './table/table.resolver';
import { TableConfigResolver } from './table-config/table-config.resolver';
import { TableService } from './table/table.service';
import { TableConfigService } from './table-config/table-config.service';
import { Table, TableSchema } from './table/entities/table.entity';
import { TableConfig, TableConfigSchema } from './table-config/entities/table-config.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { FormsModule } from 'src/forms/forms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema },
      { name: TableConfig.name, schema: TableConfigSchema },
    ]),
    AuthModule,
    UsersModule,
    forwardRef(() => FormsModule),
  ],
  providers: [
    TableResolver,
    TableConfigResolver,
    TableService,
    TableConfigService,
  ],
  exports: [
    TableConfigService,
  ],
})
export class TableModule {}
