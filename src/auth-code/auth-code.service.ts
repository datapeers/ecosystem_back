import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { AuthCode } from './entities/auth-code.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthCodeService {
  constructor(
    @InjectModel(AuthCode.name) private readonly authCodeModel: Model<AuthCode>,
  ) {}

  async create(_user: AuthUser, jwt: string): Promise<AuthCode> {
    const createdCode = await this.authCodeModel.create({ token: jwt });
    if(!createdCode) throw new InternalServerErrorException("Failed due to unexpected exception");
    return createdCode;
  }

  async findOne(id: string): Promise<AuthCode> {
    const code = await this.authCodeModel.findById(id).lean();
    if(!code) throw new NotFoundException("The code has expired");
    return code;
  }
}
