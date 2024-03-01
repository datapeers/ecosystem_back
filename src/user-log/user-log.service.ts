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

  /**
   * create a user log
   */
  create(createUserLogInput: CreateUserLogInput, user: AuthUser) {
    return this.userLogModel.create({
      metadata: { ...createUserLogInput.metadata, user: user._id },
    });
  }

  /**
   * find all users logs
   */
  findAll() {
    return this.userLogModel.find().lean();
  }

  /**
   * find user log by filters
   */
  findByFilters(filters: Record<string, any>) {
    return this.userLogModel.find(filters).lean();
  }

  /**
   * find an user log
   */
  findOne(id: string) {
    return this.userLogModel.findById(id).lean();
  }

  /**
   * delete a user log
   */
  remove(id: string) {
    return this.userLogModel.findByIdAndDelete(id).lean();
  }

  /**
   * create or update user login session
   */
  async registerLogin(idUser: string) {
    // let infoSemana = this.obtenerInfoSemana();
    let today = new Date(Date.now() - 5 * 60 * 60 * 1000);
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
            'metadata.logIn': new Date(Date.now() - 5 * 60 * 60 * 1000),
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

  /**
   * find user login sessions in a week
   */
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

  /**
   * find user activity in a week
   */
  /** @var date: date format YYYY-MM-DD */
  registerUserByDate(user, date: string) {
    const begin = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    return this.userLogModel
      .find({
        user,
        createdAt: {
          $gte: begin,
          $lt: end,
        },
      })
      .lean();
  }

  /**
   * find user resources replies in a week
   */
  /** @var date: date format YYYY-MM-DD */
  registerResourcesByUser(date: string, user: AuthUser) {
    const begin = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    return this.userLogModel
      .find({
        'metadata.user': user._id,
        'metadata.content': { $exists: true },
        createdAt: {
          $gte: begin,
          $lt: end,
        },
      })
      .lean();
  }

  /**
   * find multiple users login sessions in a week
   */
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
  /**
   * find multiple users resources replies in a week
   */
  async getUserRegisterWeek(user: AuthUser) {
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
    let data = [];
    let countDocs = 0;
    for (const iterator of dates.fechasSemana) {
      const docs = await this.registerResourcesByUser(iterator, user);
      // infoUsers.push({ day: labels[index], date: iterator, value: docs.length });
      data.push(docs.length);
      countDocs += docs.length;
    }
    return { labels, data, dateLabels: dates, count: countDocs };
  }
}
