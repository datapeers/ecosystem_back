import { Injectable } from '@nestjs/common';
import { CreateUserLogInput } from './dto/create-user-log.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserLog } from './entities/user-log.entity';
import { AuthUser } from 'src/auth/types/auth-user';
import { infoWeekDates } from 'src/shared/utilities/dates.utilities';

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

  findByFilters(filters: Record<string, any>) {
    return this.userLogModel.find(filters).lean();
  }

  findOne(id: string) {
    return this.userLogModel.findById(id).lean();
  }

  remove(id: string) {
    return this.userLogModel.findByIdAndDelete(id).lean();
  }

  async registerLogin(idUser: string) {
    // let infoSemana = this.obtenerInfoSemana();
    let today = new Date();
    // Configura las fechas para el rango del día específico
    const begin = new Date(today);
    begin.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return await this.userLogModel
      .findOneAndUpdate(
        {
          'metadata.user': new Types.ObjectId(idUser),
          'metadata.logIn': {
            $gte: begin,
            $lt: end,
          },
        },
        {
          $setOnInsert: {
            'metadata.user': new Types.ObjectId(idUser),
            'metadata.logIn': new Date(),
            'metadata.loginApp': true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      )
      .lean();
  }

  /** @var date: date format YYYY-MM-DD */
  registerLoginByDate(date: string) {
    const begin = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    return this.userLogModel
      .find({
        'metadata.logIn': {
          $gte: begin,
          $lt: end,
        },
      })
      .lean();
  }

  async getRegistersUsers() {
    let dates = infoWeekDates();
    let labels = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    let index = 0;
    let uniquesUsers = new Set();
    let data = [];
    for (const iterator of dates.fechasSemana) {
      const docs = await this.registerLoginByDate(iterator);
      // infoUsers.push({ day: labels[index], date: iterator, value: docs.length });
      data.push(docs.length);
      index++;
      for (const iterator of docs) {
        if (uniquesUsers.has(iterator.metadata['user'].toString())) continue;
        uniquesUsers.add(iterator.metadata['user'].toString());
      }
    }
    return { labels, data, dateLabels: dates, count: uniquesUsers.size };
  }
}
