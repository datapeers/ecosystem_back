import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateHelpDeskInput } from './dto/create-help-desk.input';
import { UpdateHelpDeskInput } from './dto/update-help-desk.input';
import { HelpDeskTicket } from './entities/help-desk.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TicketEnum } from './enum/ticket-status.enum';
import { HelpDeskFilterInput } from './dto/help-desk-filter.input';

@Injectable()
export class HelpDeskService {
  constructor(
    @InjectModel(HelpDeskTicket.name)
    private readonly ticketsModel: Model<HelpDeskTicket>,
  ) {}

  _logger = new Logger(HelpDeskService.name);

  create(createHelpDeskInput: CreateHelpDeskInput) {
    try {
      const newTicket = this.ticketsModel.create({
        ...createHelpDeskInput,
        childs: [createHelpDeskInput.newchild],
        status: TicketEnum.Open,
      });
    } catch (error) {}
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
      await this.findOne(id);

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

  async remove(id: number): Promise<HelpDeskTicket> {
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
