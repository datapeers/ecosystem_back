import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FindUsersArgs } from './args/find-users.args';
import { RolService } from '../rol/rol.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserLogService } from 'src/user-log/user-log.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolService: RolService,
    @Inject(forwardRef(() => UserLogService))
    private readonly userLogService: UserLogService,
  ) {}

  async tryFindOne(filters: { uid?: string; email?: string }) {
    return await this.userModel.findOne(filters).lean();
  }

  async findOne(uid: string) {
    const user = await (
      await this.userModel.findOne({ uid: uid })
    ).populate('rol');
    if (!user) throw new NotFoundException(`No user found with uid ${uid}`);
    this.userLogService.registerLogin(user._id);
    return user;
  }

  async findById(id: string) {
    const user = (await this.userModel.findById(id)).populate('rol');

    if (!user) throw new NotFoundException(`No user found with id ${id}`);
    return user;
  }

  async findMany({ search, roles, relationsAssign }: FindUsersArgs) {
    let filters = {};
    let rolesDocs = [];
    if (roles?.length) {
      for (const iterator of roles) {
        const docRol = await this.findRolByType(iterator);
        rolesDocs.push(docRol._id);
      }
      filters['rol'] = { $in: rolesDocs };
    }

    if (search) {
      filters['fullName'] = RegExp(`/.*${search}.*/`);
    }
    if (relationsAssign) {
      const keys = Object.keys(relationsAssign);
      for (const iterator of keys) {
        filters[`relationsAssign.${iterator}._id`] = relationsAssign[iterator];
      }
    }

    const users = await this.userModel.find(filters).populate('rol').lean();
    return users;
  }

  async countAll() {
    const docs = await this.userModel.find({ isActive: true }).lean();
    return docs.length;
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

  async findRolByID(id: string) {
    return await this.rolService.findOne(id);
  }

  async findRolByType(type: string) {
    return await this.rolService.findByType(type);
  }
}
