import { Module, forwardRef } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantResolver } from './applicant.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Applicant, ApplicantSchema } from './entities/applicant.entity';
import { ExpertModule } from 'src/expert/expert.module';
import { StartupModule } from 'src/startup/startup.module';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Applicant.name, schema: ApplicantSchema },
    ]),
    AuthModule,
    UsersModule,
    forwardRef(() => ExpertModule),
    forwardRef(() => StartupModule),
    forwardRef(() => EntrepreneurModule),
    forwardRef(() => InvitationsModule),
  ],
  providers: [ApplicantResolver, ApplicantService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
