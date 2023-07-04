export class AggregateBuildOptions {
  lookups: any[] = [];
  project?: any;
  defaultMatch: any = { deletedAt: null };
  paginated?: boolean = true;
  outputProjection?: any;

  constructor() {

  }
}