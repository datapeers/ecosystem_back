import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';
import { Announcement } from './entities/announcement.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name) private readonly announcementModel: Model<Announcement>,
  ) {}

  async findAll(): Promise<Announcement[]> {
    const announcements = await this.announcementModel.find({ deletedAt: null });
    return announcements;
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementModel.findOne({ _id: id });
    if (!announcement) throw new NotFoundException(`No announcement found with id ${id}`);
    return announcement;
  }

  async create(
    createAnnouncementInput: CreateAnnouncementInput,
    user: AuthUser,
  ): Promise<Announcement> {
    const createdAnnouncement = await this.announcementModel.create({
      ...createAnnouncementInput,
      createdBy: user.uid,
    });
    return createdAnnouncement;
  }

  async clone(id: string, user: AuthUser) {
    const existingAnnouncement = await this.announcementModel.findById({ _id: id });
    const createdAnnouncement = await this.announcementModel.create({
      ...existingAnnouncement,
      createdBy: user.uid,
    });
    return createdAnnouncement;
  }

  async update(id: string, updateAnnouncementInput: Omit<UpdateAnnouncementInput, '_id'>, user: AuthUser): Promise<Announcement> {
    const updatedAnnouncement = await this.announcementModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateAnnouncementInput, updatedBy: user.uid },
        { new: true }
      ).lean();
    if(!updatedAnnouncement) throw new NotFoundException(`The announcement by id ${id} doesn't exist`);
    return updatedAnnouncement;
  }

  async publish(id: string, user: AuthUser) {
    const publishedAnnouncement = await this.update(id, { published: true } , user);
    return publishedAnnouncement;
  }

  async remove(id: string) {
    const deletedAnnouncement = await this.announcementModel.updateOne({ _id: id }, { deletedAt: Date.now() });
    return deletedAnnouncement;
  }
}
