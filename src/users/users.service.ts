import { ConflictException, Injectable, NotFoundException, MethodNotAllowedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FindUsersArgs } from './args/find-users.args';

@Injectable()
export class UsersService {
  constructor( @InjectModel(User.name) private readonly userModel: Model<User> ) {

  }
  
  async tryFindOne(uid: string): Promise<User | null> {
    return await this.userModel.findOne({ uid: uid }).lean();
  }

  async findOne(uid: string) {
    const user = await this.userModel.findOne({ uid: uid });
    if(!user)
      throw new NotFoundException(`No user found with uid ${uid}`);
    return user;
  }

  async findMany({ search, roles }: FindUsersArgs) {
    let filters = {};

    if(roles?.length) {
      filters["roles"] = { $in: roles };
    }

    if(search) {
      filters["fullName"] = RegExp(`/.*${search}.*/`);
    }
  
    const users = await this.userModel.find(filters).lean();
    return users;
  }

  async create(createUserInput: CreateUserInput) {
    const user = await this.tryFindOne(createUserInput.uid);
    if(user) throw new ConflictException("Authenticated user already exist");
    const createdUser = await this.userModel.create(createUserInput);
    return createdUser;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    //TODO: Implement users update
  }

  async updateState(uid: string, adminUser: User, setActive: boolean) {
    const user = await this.findOne(uid);
    if(user.isActive === setActive)
      throw new ConflictException(`The user with uid ${uid} is already ${setActive ? 'enabled' : 'disabled'}`);

    if(user.rolValue >= adminUser.rolValue) {
      throw new MethodNotAllowedException(`Can't ${setActive ? 'enabled' : 'disabled'} a user with equal or higher privileges.`);
    }
    user.isActive = setActive;
    user.updatedBy = adminUser.uid;
    await user.save();
    return user;
  }
}
