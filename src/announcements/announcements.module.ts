import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsResolver } from './announcements.resolver';
import { Announcement, AnnouncementSchema } from './entities/announcement.entity';
import { FormsModule } from 'src/forms/forms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
    AuthModule,
    UsersModule,
    FormsModule,
  ],
  providers: [AnnouncementsResolver, AnnouncementsService]
})

export class AnnouncementsModule {}
