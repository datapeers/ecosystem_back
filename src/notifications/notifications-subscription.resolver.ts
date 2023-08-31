import { Injectable } from '@nestjs/common';
import { pubSubInstance } from 'src/shared/sockets/socket-instance';

const pubSub = pubSubInstance;

@Injectable()
export class NotificationSubscritpionService {}
