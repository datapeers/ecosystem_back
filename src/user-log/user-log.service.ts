import { Injectable } from '@nestjs/common';
import { CreateUserLogInput } from './dto/create-user-log.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserLog } from './entities/user-log.entity';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class UserLogService {
  constructor(
    @InjectModel(UserLog.name)
    private readonly userLogModel: Model<UserLog>,
  ) {}

  create(createUserLogInput: CreateUserLogInput, user: AuthUser) {
    return this.userLogModel.create({
      metadata: { ...createUserLogInput.metadata, user: user._id },
    });
  }

  findAll() {
    return this.userLogModel.find().lean();
  }

  findByFilters(filters: JSON) {
    return this.userLogModel.find(filters).lean();
  }

  findOne(id: string) {
    return this.userLogModel.findById(id).lean();
  }

  remove(id: string) {
    return this.userLogModel.findByIdAndDelete(id).lean();
  }
}
