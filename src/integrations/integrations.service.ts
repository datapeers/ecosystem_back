import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { Integration } from './entities/integration.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TypeIntegration } from './enum/types.enum';
import { stringify } from 'querystring';
import axios from 'axios';
import { ZoomApiResponse } from './model/response-zoom-api';
import { ZoomMeetingRequest } from './model/zoom-meeting-request';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class IntegrationsService {
  apiZoom = 'https://api.zoom.us/v2';
  constructor(
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<Integration>,
    @Inject(forwardRef(() => EmailsService))
    private readonly emailsService: EmailsService,
  ) {}

  /**
   * create or update integration doc
   */
  async updateOrCreate(data: CreateIntegrationInput) {
    return await this.integrationModel
      .findOneAndUpdate(
        { typeIntegration: data.typeIntegration },
        { ...data },
        { new: true, upsert: true },
      )
      .lean();
  }

  /**
   * find all integration doc
   */
  findAll() {
    return this.integrationModel.find().lean();
  }

  /**
   * find integration zoom doc
   */
  zoomIntegration() {
    return this.integrationModel
      .findOne({ typeIntegration: TypeIntegration.zoom })
      .lean();
  }

  /**
   * find token zoom followed integration zoom
   */
  async tokenZoom() {
    const integration = await this.zoomIntegration();
    if (!integration)
      throw new NotFoundException(`Couldn't find integration with zoom`);
    let data = stringify({
      grant_type: 'account_credentials',
      account_id: integration.metadata['accountId'],
    });

    let config = {
      method: 'post',
      url: 'https://zoom.us/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${integration.metadata['clientId']}:${integration.metadata['clientSecret']}`,
          ).toString('base64'),
      },
      data,
    };
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * create an zoom meeting
   */
  async zoomMeeting(
    meetingName: string,
    start_time,
    duration: number,
    hosting: { email: string; name: string }[],
    participants: { email: string }[],
    others?: {
      alternative_hosts: string;
    },
  ) {
    const integration = await this.zoomIntegration();
    if (!integration)
      throw new NotFoundException(`Couldn't find integration with zoom`);
    const token: {
      access_token: string;
      token_type: 'string';
      expires_in: number;
      scope: string;
    } = await this.tokenZoom();
    let data: ZoomMeetingRequest = {
      agenda: meetingName,
      default_password: false,
      duration: duration,
      pre_schedule: false, // if integrate addon GSuite google to ZoomAPP
      schedule_for: integration.metadata['email'],
      settings: {
        allow_multiple_devices: true,
        alternative_hosts: others?.alternative_hosts,
        alternative_hosts_email_notification: true,
        approval_type: 2,
        audio: 'telephony',
        authentication_exception: hosting,
        auto_recording: 'cloud',
        breakout_room: {
          enable: true,
          rooms: [
            {
              name: 'room1',
              participants: [...participants.map((i) => i.email)],
            },
          ],
        },
        calendar_type: 1,
        close_registration: false,
        contact_email: integration.metadata['email'],
        contact_name: 'Ecosystem',
        email_notification: true,
        encryption_type: 'enhanced_encryption',
        focus_mode: true,
        host_video: true,
        jbh_time: 0,
        join_before_host: false,
        meeting_authentication: true,
        meeting_invitees: participants,
        mute_upon_entry: false,
        participant_video: false,
        private_meeting: false,
        registrants_confirmation_email: true,
        registrants_email_notification: true,
        registration_type: 1,
        show_share_button: true,
        use_pmi: false,
        waiting_room: false,
        watermark: false,
        host_save_video_order: true,
        alternative_host_update_polls: true,
        internal_meeting: false,
        continuous_meeting_chat: {
          enable: true,
          auto_add_invited_external_users: true,
        },
        participant_focused_meeting: false,
        push_change_to_calendar: false,
        resources: [
          {
            resource_type: 'whiteboard',
            resource_id: 'X4Hy02w3QUOdskKofgb9Jg',
            permission_level: 'editor',
          },
        ],
      },
      start_time,
      template_id: 'Dv4YdINdTk+Z5RToadh5ug==',
      timezone: 'America/Bogota',
      topic: meetingName,
      tracking_fields: [
        {
          field: 'field1',
          value: 'value1',
        },
      ],
      type: 2,
    };
    let config = {
      method: 'post',
      url: this.apiZoom + `/users/me/meetings`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      data,
    };

    try {
      const response = await axios(config);
      let ansData: ZoomApiResponse = response.data;
      return ansData;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * delete a zoom meeting
   */
  async deleteMeeting(meetingId: string) {
    const integration = await this.zoomIntegration();
    if (!integration)
      throw new NotFoundException(`Couldn't find integration with zoom`);
    const token: {
      access_token: string;
      token_type: 'string';
      expires_in: number;
      scope: string;
    } = await this.tokenZoom();
    let config = {
      method: 'delete',
      url: this.apiZoom + `/meetings/${meetingId}`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
    try {
      const response = await axios(config);
      let ansData: ZoomApiResponse = response.data;
      return ansData;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @ignore
   */
  async testIcs() {
    const integration = await this.zoomIntegration();
    if (!integration)
      throw new NotFoundException(`Couldn't find integration with zoom`);
    try {
      // await this.emailsService.sendIcs();
    } catch (error) {
      console.log(error);
    }
    return integration;
  }
}
