export interface IAssignHoursConfig {
  from: string;
  limit: number;
  to: { id: string; limit: string }[];
  __typename?: any;
}

export class Assign_item {
  from: string;
  limit: number;
  nameFrom: string;
  to: { id: string; limit: number; name: string }[];
  expanded: boolean;
  constructor(data: IAssignHoursConfig, nameFrom: string) {
    this.from = data.from;
    this.limit = data.limit;
    this.nameFrom = nameFrom;
    this.to = [];
    this.expanded = false;
  }
}
