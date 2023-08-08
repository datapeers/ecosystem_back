import { Injectable } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import axios from 'axios';

@Injectable()
export class CalendarService {
  create(createCalendarDto: CreateCalendarDto) {
    return 'This action adds a new calendar';
  }

  async findAll() {
    try {
      const { data } = await axios.get(
        'https://calendly.com/jaeducaba' + `/user_availability_schedule'`,

        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        console.log('error message: ', error.message);
        // 👇️ error: AxiosError<any, any>
        return { ans: false };
      } else {
        console.log('unexpected error: ', error);
        return { ans: false };
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} calendar`;
  }

  update(id: number, updateCalendarDto: UpdateCalendarDto) {
    return `This action updates a #${id} calendar`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendar`;
  }
}
