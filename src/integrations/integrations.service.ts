import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { Integration } from './entities/integration.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TypeIntegration } from './enum/types.enum';
import { stringify } from 'querystring';
import axios from 'axios';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<Integration>,
  ) {}

  async updateOrCreate(data: CreateIntegrationInput) {
    return await this.integrationModel
      .findOneAndUpdate(
        { typeIntegration: data.typeIntegration },
        { ...data },
        { new: true, upsert: true },
      )
      .lean();
  }

  findAll() {
    return this.integrationModel.find().lean();
  }

  zoomIntegration() {
    return this.integrationModel
      .findOne({ typeIntegration: TypeIntegration.zoom })
      .lean();
  }

  async tokenZoom() {
    const integration = await this.zoomIntegration();
    if (!integration)
      throw new NotFoundException(`Couldn't find integration with zoom`);
    let data = stringify({
      code: integration.code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:4200/home/admin/redirect_zoom',
    });

    let config = {
      method: 'post',
      url: 'https://zoom.us/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${integration.metadata['clientIdZoom']}:${integration.metadata['clientSecretZoom']}`,
          ).toString('base64'),
      },
      data,
    };
    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log(response.data['access_token']);
        return integration;
      })
      .catch((err) => {
        console.log(err);
        return integration;
        throw new InternalServerErrorException(err);
      });
  }
}
