import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol } from './entities/rol.entity';
import { defaultRoles } from './model/rol';

@Injectable()
export class RolInitializer implements OnModuleInit {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  async onModuleInit() {
    let roles = await this.rolModel.find({});
    if (roles.length === 0) {
      for (const rol of defaultRoles) {
        if (!rol) continue;
        const role = new this.rolModel(rol);
        await role.save();
      }
    }
  }
}
