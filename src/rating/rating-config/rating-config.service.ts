import { Injectable } from '@nestjs/common';
import { CreateRatingConfigInput } from './dto/create-rating-config.input';
import { UpdateRatingConfigInput } from './dto/update-rating-config.input';
/**
 * @ignore
 */
@Injectable()
export class RatingConfigService {
  create(createRatingConfigInput: CreateRatingConfigInput) {
    return 'This action adds a new ratingConfig';
  }

  findAll() {
    return `This action returns all ratingConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ratingConfig`;
  }

  update(id: number, updateRatingConfigInput: UpdateRatingConfigInput) {
    return `This action updates a #${id} ratingConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} ratingConfig`;
  }
}
