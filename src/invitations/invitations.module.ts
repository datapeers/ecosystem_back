import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { InvitationsController } from './invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './entities/invitation.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsModule } from 'src/emails/emails.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    AuthModule,
    UsersModule,
    LoggerModule,
    EmailsModule,
  ],
  providers: [InvitationsResolver, InvitationsService],
  controllers: [InvitationsController],
  exports: [InvitationsService],
})
export class InvitationsModule {}
