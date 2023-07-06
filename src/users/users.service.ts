import {
  ConflictException,
  Injectable,
  NotFoundException,
  MethodNotAllowedException,
  OnModuleInit,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FindUsersArgs } from './args/find-users.args';
import { RolService } from '../rol/rol.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolService: RolService,
  ) {}

  async onModuleInit() {
    // ? Update old docs to new method to read rol
    // const users = await this.userModel.find();
    // const roles = await this.rolService.findAll();
    // const rolesObj = {};
    // for (const iterator of roles) {
    //   rolesObj[iterator.type] = iterator._id;
    // }
    // for (const iterator of users) {
    //   if (iterator.rol) continue;
    //   iterator.rol = rolesObj[iterator.roles[0]];
    //   await iterator.save();
    // }
  }

  async tryFindOne(filters: { uid?: string; email?: string }) {
    return await this.userModel.findOne(filters).lean();
  }

  async findOne(uid: string) {
    const user = (await this.userModel.findOne({ uid: uid })).populate('rol');
    if (!user) throw new NotFoundException(`No user found with uid ${uid}`);
    return user;
  }

  async findMany({ search, roles }: FindUsersArgs) {
    let filters = {};

    if (roles?.length) {
      filters['roles'] = { $in: roles };
    }

    if (search) {
      filters['fullName'] = RegExp(`/.*${search}.*/`);
    }

    const users = await this.userModel.find(filters).populate('rol').lean();
    return users;
  }

  async create(createUserInput: Partial<User>) {
    const user = await this.tryFindOne({ uid: createUserInput.uid });
    if (user) throw new ConflictException('Authenticated user already exist');
    const createdUser = await this.userModel.create(createUserInput);
    return await createdUser.populate('rol');
  }

  async update(
    filters: { _id?: string; uid?: string },
    userUpdates: Partial<User>,
  ) {
    delete userUpdates['_id'];
    const user = await this.userModel
      .findOneAndUpdate(
        filters,
        {
          ...userUpdates,
        },
        { new: true },
      )
      .populate('rol')
      .lean();
    return user;
  }

  async updateState(uid: string, adminUser: User, setActive: boolean) {
    const user = await this.findOne(uid);
    if (user.isActive === setActive)
      throw new ConflictException(
        `The user with uid ${uid} is already ${
          setActive ? 'enabled' : 'disabled'
        }`,
      );
    user.isActive = setActive;
    user.updatedBy = adminUser.uid;
    await user.save();
    return user;
  }

  async deleteUser(uid: string) {
    return this.userModel.deleteOne({ uid }).populate('rol');
  }

  async findRolByType(type: string) {
    const rol = await this.rolService.findByType(type);
    if (!rol) throw new NotFoundException(`No rol found with type ${type}`);
    return rol;
  }
}
