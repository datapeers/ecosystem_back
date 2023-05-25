import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantResolver } from './applicant.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Applicant, ApplicantSchema } from './entities/applicant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Applicant.name, schema: ApplicantSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [ApplicantResolver, ApplicantService],
  exports: [ApplicantService]
})
export class ApplicantModule {}
