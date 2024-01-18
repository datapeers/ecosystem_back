/**
 * @ignore
 */
export class AggregateBuildOptions {
  lookups: any[] = [];
  project?: { $project: any };
  defaultMatch: any = { deletedAt: null };
  paginated?: boolean = true;
  outputProjection?: { $project: any };
  virtualFields: { $addFields: any };

  constructor() {}
}
