import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { FindUsersInput } from './inputs/find-users.input';

@Injectable()
export class UsersService {
  constructor( @InjectModel(User.name) private readonly userModel: Model<User> ) {

  }

  async findOne(uid: string): Promise<User> {
    const user = await this.userModel.findOne({ uid: uid }).lean();
    if(!user)
      throw new NotFoundException(`No user found with uid ${uid}`);
    return user;
  }

  async findMany(findUsersInput: FindUsersInput) {
    const users = await this.userModel.find({
      roles: { $in: findUsersInput.roles }
    }).lean();
    return users;
  }

  async create(createUserInput: CreateUserInput) {
    const createdUser = await this.userModel.create(createUserInput);
    return createdUser;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    //TODO: Implement users update
  }
  
}
