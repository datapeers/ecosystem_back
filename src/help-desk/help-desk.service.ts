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

@Injectable()
export class HelpDeskService {
  constructor(
    @InjectModel(HelpDeskTicket.name)
    private readonly ticketsModel: Model<HelpDeskTicket>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
  ) {}

  _logger = new Logger(HelpDeskService.name);

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

  async findOne(id: string): Promise<HelpDeskTicket> {
    const ticket = await this.ticketsModel.findOne({
      where: {
        _id: id,
      },
    });

    if (!ticket) throw new NotFoundException(`Ticket with id: ${id} not found`);

    return ticket;
  }

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

      return updatedHelpDeskTicket;
    } catch (error) {
      this._logger.error(
        `Error updating ticket category  ${updateHelpDeskInput} ${error}`,
      );
    }
  }

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
}
