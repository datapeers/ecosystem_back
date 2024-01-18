import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectModel } from '@nestjs/mongoose';
import { TicketCategory } from './entities/category.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TicketCategoriesService {
  constructor(
    @InjectModel(TicketCategory.name)
    private readonly ticketCategoryModel: Model<TicketCategory>,
  ) {}

  _logger = new Logger(TicketCategoriesService.name);

  /**
   * create category for help desk
   */
  async create(
    createCategoryInput: CreateCategoryInput,
  ): Promise<TicketCategory> {
    try {
      const ans = await this.ticketCategoryModel.create({
        CreateCategoryInput,
      });
      return ans.toObject();
    } catch (error) {
      this._logger.error(
        `Error creating ticketcategory ${createCategoryInput} - error: ${error}`,
      );
      throw new InternalServerErrorException(`Check logs`);
    }
  }

  /**
   * find all category for help desk
   */
  findAll() {
    return this.ticketCategoryModel.find({});
  }

  /**
   * find category by id
   */
  async findOne(id: string): Promise<TicketCategory> {
    const category = await this.ticketCategoryModel.findOne({
      where: {
        _id: id,
      },
    });
    if (!category) {
      throw new NotFoundException(`Ticket Category whit id: ${id} not found`);
    }

    return category.toObject();
  }

  /**
   * update category for help desk
   */
  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<TicketCategory> {
    try {
      await this.findOne(id);

      delete updateCategoryInput['_id'];
      const updatedNotification = await this.ticketCategoryModel
        .findOneAndUpdate(
          { _id: id },
          { ...updateCategoryInput },
          { new: true },
        )
        .lean();

      return updatedNotification;
    } catch (error) {
      this._logger.error(
        `Error updating ticket category  ${updateCategoryInput} ${error}`,
      );
    }
  }

  /**
   * soft delete category for help desk
   */
  async remove(id: string): Promise<TicketCategory> {
    try {
      const updatedType = await this.ticketCategoryModel
        .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
        .lean();
      return updatedType;
    } catch (error) {
      this._logger.error(`Error removing ticket category  ${id} ${error}`);
    }
  }
}
