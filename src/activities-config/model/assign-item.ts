import { Expert } from 'src/expert/entities/expert.entity';
import { Startup } from 'src/startup/entities/startup.entity';
/**
 * @ignore
 */
export interface IAssignHoursConfig {
  from: string;
  limit: number;
  to: { id: string; limit: string }[];
  __typename?: any;
}
/**
 * @ignore
 */
export class Assign_item {
  from: string;
  limit: number;
  nameFrom: string;
  to: { id: string; limit: number; name: string }[];
  constructor(data: IAssignHoursConfig, nameFrom: string) {
    this.from = data.from;
    this.limit = data.limit;
    this.nameFrom = nameFrom;
    this.to = [];
  }
}
/**
 * @ignore
 */
export interface IConfigStartup extends Startup {
  hours: { [key: string]: number }; // key its activity id
}
/**
 * @ignore
 */
export interface IConfigExpert extends Expert {
  hours: {
    [key: string]: {
      allocated: number;
      donated: number;
      done: number;
    };
  }; // key its activity id
  startups: Startup[];
}
/**
 * @ignore
 */
export interface IConfigTeamCoach {
  _id: string;
  item: {
    nombre: string;
  };
  hours: {
    [key: string]: {
      allocated: number;
      done: number;
    };
  }; // key its activity id
  startups: Startup[];
}
