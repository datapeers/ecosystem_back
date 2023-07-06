import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { Rol } from 'src/rol/entities/rol.entity';

@Injectable()
export class UserInitializer implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Rol.name) private readonly rolModel: Model<Rol>,
  ) {}

  async onModuleInit() {
    let roles = await this.userModel.find({});
    for (const iterator of roles) {
    }
  }
}
