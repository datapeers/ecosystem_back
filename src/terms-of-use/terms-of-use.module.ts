import { Module } from '@nestjs/common';
import { TermsOfUseService } from './terms-of-use.service';
import { TermsOfUseResolver } from './terms-of-use.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { TermsOfUse, TermsOfUseSchema } from './entities/terms-of-use.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TermsOfUse.name, schema: TermsOfUseSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [TermsOfUseResolver, TermsOfUseService],
  exports: [TermsOfUseService],
})
export class TermsOfUseModule {}
