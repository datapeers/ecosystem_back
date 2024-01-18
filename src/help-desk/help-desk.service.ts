import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateHelpDeskInput } from './dto/create-help-desk.input';
import { UpdateHelpDeskInput } from './dto/update-help-desk.input';
import { HelpDeskTicket } from './entities/help-desk.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TicketEnum } from './enum/ticket-status.enum';
import { HelpDeskFilterInput } from './dto/help-desk-filter.input';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';
import { StartupService } from 'src/startup/startup.service';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class HelpDeskService {
  constructor(
    @InjectModel(HelpDeskTicket.name)
    private readonly ticketsModel: Model<HelpDeskTicket>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  _logger = new Logger(HelpDeskService.name);

  /**
   * create a post in help desk
   */
  async create(createHelpDeskInput: CreateHelpDeskInput) {
    try {
      const newTicket = await this.ticketsModel.create({
        ...createHelpDeskInput,
        childs: [createHelpDeskInput.newChild],
        status: TicketEnum.Open,
      });
      return newTicket.toObject();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * find all post in help desk
   */
  findAll(filter: HelpDeskFilterInput) {
    const { status, startupId, page, perPage } = filter;
    const query = this.ticketsModel.find();
    if (status) {
      query.where({ status: { $regex: new RegExp(status, 'i') } });
    }
    if (startupId) {
      query.where({ startupId });
    }
    if (page && perPage) {
      query.skip((page - 1) * perPage).limit(perPage);
    }
    return query.exec();
  }

  /**
   * find post in help desk with filters
   */
  async findByFilters(user: AuthUser, filters: JSON) {
    switch (user.rolDoc.type) {
      case ValidRoles.user:
        const docEntrepreneur = await this.entrepreneurService.findByAccount(
          user.uid,
        );
        if (!docEntrepreneur) return [];
        const docsStartups = await this.startupService.findByEntrepreneur(
          docEntrepreneur._id,
        );
        if (docsStartups.length === 0) return [];
        const idsStartups = docsStartups.map((i) => i._id);
        return this.ticketsModel.find({
          ...filters,
          startupId: { $in: idsStartups },
        });
      default:
        return this.ticketsModel.find(filters).lean();
    }
  }

  /**
   * find a post in help desk by id
   */
  async findOne(id: string): Promise<HelpDeskTicket> {
    const ticket = await this.ticketsModel.findOne({
      where: {
        _id: id,
      },
    });

    if (!ticket) throw new NotFoundException(`Ticket with id: ${id} not found`);

    return ticket;
  }

  /**
   * update a post in help desk
   */
  async update(id: string, updateHelpDeskInput: UpdateHelpDeskInput) {
    try {
      delete updateHelpDeskInput['_id'];
      const updatedHelpDeskTicket = await this.ticketsModel
        .findOneAndUpdate(
          { _id: id },
          { ...updateHelpDeskInput },
          { new: true },
        )
        .lean();
      this.notificationsService.create(
        this.buildNotification(updatedHelpDeskTicket),
      );
      return updatedHelpDeskTicket;
    } catch (error) {
      this._logger.error(
        `Error updating ticket category  ${updateHelpDeskInput} ${error}`,
      );
    }
  }

  /**
   * soft delete a post in help desk
   */
  async remove(id: string): Promise<HelpDeskTicket> {
    try {
      const updatedType = await this.ticketsModel
        .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
        .lean();
      return updatedType;
    } catch (error) {
      this._logger.error(`Error removing ticket ${id} ${error}`);
    }
  }

  /**
   * build and instance of a notification post in help desk
   */
  buildNotification(ticket: HelpDeskTicket) {
    let text = `Tu ticket ${ticket.title} ha recibido respuesta o cambios`;
    const urlInvitation = process.env.APP_URI + '/home/helpdesk';
    return {
      text,
      date: new Date(),
      target: `userNotification ${ticket.childs[0].answerById};`,
      state: NotificationStates.pending,
      type: NotificationTypes.notes,
      isDeleted: false,
      url: urlInvitation,
    };
  }
}
