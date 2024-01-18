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
import { EmailsService } from 'src/emails/emails.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ContactArgs } from 'src/startup/args/contact-startup.args';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolService: RolService,
    @Inject(forwardRef(() => UserLogService))
    private readonly userLogService: UserLogService,
    @Inject(forwardRef(() => EmailsService))
    private readonly emailsService: EmailsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,
  ) {}

  /**
   * find user doc by filters
   */
  async tryFindOne(filters: { uid?: string; email?: string }) {
    return await this.userModel.findOne(filters).lean();
  }

  /**
   * find user doc by uid
   */
  async findOne(uid: string) {
    const user = await (
      await this.userModel.findOne({ uid: uid })
    ).populate('rol');
    if (!user) throw new NotFoundException(`No user found with uid ${uid}`);
    this.userLogService.registerLogin(user._id);
    return user;
  }

  /**
   * find user doc by id
   */
  async findById(id: string) {
    const user = (await this.userModel.findById(id)).populate('rol');

    if (!user) throw new NotFoundException(`No user found with id ${id}`);
    return user;
  }

  /**
   * find many user doc by rol
   */
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

  /**
   * count of users
   */
  async countAll() {
    const docs = await this.userModel.find({ isActive: true }).lean();
    return docs.length;
  }

  /**
   * create a user doc
   */
  async create(createUserInput: Partial<User>) {
    const user = await this.tryFindOne({ uid: createUserInput.uid });
    if (user) throw new ConflictException('Authenticated user already exist');
    const createdUser = await this.userModel.create(createUserInput);
    return await createdUser.populate('rol');
  }

  /**
   * update user doc
   */
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

  /**
   * update state of a user
   */
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

  /**
   * delete user
   */
  async deleteUser(uid: string) {
    return this.userModel.deleteOne({ uid }).populate('rol');
  }

  /**
   * find rol by id
   */
  async findRolByID(id: string) {
    return await this.rolService.findOne(id);
  }

  /**
   * find rol by type
   */
  async findRolByType(type: string) {
    return await this.rolService.findByType(type);
  }

  /**
   * send invitation email user
   */
  async invite(contactArgs: ContactArgs) {
    const user = await this.tryFindOne({ email: contactArgs.to });
    if (!user)
      throw new ConflictException(
        `No se encuentra un usuario con el correo ${contactArgs.to}`,
      );
    try {
      const defaultVerifiedEmail = process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL;
      const urlInvitation =
        process.env.APP_URI +
        '/home/startup_invitation/' +
        contactArgs.startupID;
      await this.emailsService.send({
        from: defaultVerifiedEmail,
        html: `
          <p><strong><em>${contactArgs.from} te quiere invitar a formar parte de ${contactArgs.startupName} en EcosystemBT</em></strong></p>
          <p>Al hacer click <a href="${urlInvitation}">aqu&iacute;</a> o con el siguiente link para aceptar unirse a su startUp</p>
          <p>&nbsp;</p>
          <p>link: <a href="${urlInvitation}">${urlInvitation}</a></p>
          <p><strong>Recuerda que este mensaje es un intermediario y solo se envi&oacute; por EcosystemBT, y no debes responder en este hilo</strong></p>
          <p>&nbsp;</p>
        `,
        subject: contactArgs.subject,
        text: `Forma parte de ${contactArgs.startupName} en EcosystemBT`,
        to: contactArgs.to,
      });
      await this.notificationService.create({
        text: `${contactArgs.from} te quiere invitar a formar parte de ${contactArgs.startupName}`,
        url: urlInvitation,
        target: `userNotification ${user._id};`,
        state: NotificationStates.pending,
        type: NotificationTypes.advise,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * find list of users docs
   */
  async findManyById(ids: string[]) {
    if (!ids.length) return [];
    const users = await this.userModel
      .find({
        _id: { $in: ids },
      })
      .lean();
    return users;
  }

  /**
   * find list of users docs by uid list
   */
  async findManyByUUID(uidList: string[]) {
    if (!uidList.length) return [];
    const users = await this.userModel
      .find({
        uid: { $in: uidList },
      })
      .lean();
    return users;
  }
}
