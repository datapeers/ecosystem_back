import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrepreneurService } from './entrepreneur.service';
import { EntrepreneurResolver } from './entrepreneur.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import {
  Entrepreneur,
  EntrepreneurSchema,
} from './entities/entrepreneur.entity';
import { BusinessModule } from 'src/business/business.module';
import { StartupModule } from 'src/startup/startup.module';
import { ExpertModule } from 'src/expert/expert.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entrepreneur.name, schema: EntrepreneurSchema },
    ]),
    AuthModule,
    UsersModule,
    forwardRef(() => BusinessModule),
    forwardRef(() => StartupModule),
    forwardRef(() => ExpertModule),
  ],
  providers: [EntrepreneurResolver, EntrepreneurService],
  exports: [EntrepreneurService],
})
export class EntrepreneurModule {}
