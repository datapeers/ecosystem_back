import { PageRequest } from '../models/page-request';
import { FieldFilter } from '../models/field-order';
import { AggregateBuildOptions } from '../models/aggregate-build-options';
import { TableColumn } from '../models/table-column';

/**
 * default pipelines for table request
 */
const buildAggregationFromRequest = (
  request: PageRequest,
  options: AggregateBuildOptions,
) => {
  const {
    lookups,
    project,
    defaultMatch,
    paginated,
    outputProjection,
    virtualFields,
  } = options;
  const aggregation: any[] = [];
  const skip = request.skip != null ? { $skip: request.skip } : null;
  const limit = request.limit != null ? { $limit: request.limit } : null;
  const sort = {
    $sort: request.sort.reduce((prev, curr) => {
      prev[curr.field] = curr.order;
      return prev;
    }, {}),
  };
  const foreignSort = {
    $sort: request.foreignSort.reduce((prev, curr) => {
      prev[curr.field] = curr.order;
      return prev;
    }, {}),
  };
  const idSorting = { $sort: { _id: 1 } };

  const match = _buildMatch(request.filter);
  const foreignMatch = _buildMatch(request.foreignFilter, {});
  const globalMatch = request?.globalFilter
    ? _buildMatch([request.globalFilter])
    : null;

  const documentsFacet = [];
  if (skip) {
    documentsFacet.push(skip);
  }
  if (limit) {
    documentsFacet.push(limit);
  }
  let output: any[];
  if (paginated) {
    output = [
      {
        $facet: {
          documents: documentsFacet,
          totalRecords: [{ $count: 'count' }],
        },
      },
      { $unwind: { path: '$totalRecords', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          documents: '$documents',
          totalRecords: { $ifNull: ['$totalRecords.count', 0] },
        },
      },
    ];
  } else {
    output = documentsFacet;
  }
  // Apply default match operations first, this should use indexes.
  aggregation.push({ $match: defaultMatch });
  // Project calculated fields (Like separate diferent types of an array element)
  if (project) {
    aggregation.push(project);
  }
  if (virtualFields) {
    aggregation.push(virtualFields);
  }
  // Add non-foreign match operations to reduce amount of elements during lookups
  if (request.filter.length > 0) {
    aggregation.push(match);
  }
  // Apply lookups to search for additional fields
  aggregation.push(...lookups);
  // Apply filters that are related to array fields
  // Apply foreign filters, this should always go after lookups
  if (request.foreignFilter.length > 0) {
    aggregation.push(foreignMatch);
  }
  // Apply global match if any
  if (globalMatch != null) {
    aggregation.push(globalMatch);
  }
  // If sorting by any field do an id sort first.
  if (request.sort.length > 0 || request.foreignSort.length > 0) {
    aggregation.push(idSorting);
  }
  // Apply local sorts
  if (request.sort.length > 0) {
    aggregation.push(sort);
  }
  // Apply Foreign sorts
  if (request.foreignSort.length > 0) {
    aggregation.push(foreignSort);
  }
  // Apply output projection, remove unnecesary fields
  if (outputProjection) {
    documentsFacet.push(outputProjection);
  }
  // Push last output operation
  // If a request is paginated (Usually case for tables, this implies)
  aggregation.push(...output);

  // const util = require('util');
  // console.log(util.inspect(request, {showHidden: false, depth: null, colors: true}));
  // console.log(util.inspect(aggregation, {showHidden: false, depth: null, colors: true}));
  return aggregation;
};

/**
 * @ignore
 */
function _buildMatch(filters: FieldFilter[], initValue: any = {}) {
  return {
    $match: filters.reduce((prev, curr) => {
      if (prev[`$${curr.operator}`] == undefined) {
        prev[`$${curr.operator}`] = [];
      }
      prev[`$${curr.operator}`] = prev[`$${curr.operator}`].concat(
        curr.operations.map((op) => {
          return _buildRegex(op.field, op.value, op.matchMode);
        }),
      );
      return prev;
    }, initValue),
  };
}

/**
 * @ignore
 */
const EscapeCharactersRegex = /([.?*+^$[\]\\(){}|-])/g;

/**
 * @ignore
 */
function _buildRegex(field: string, value: any, matchMode: string) {
  switch (matchMode) {
    case 'onlyContains': {
      return {
        $and: [
          { [field]: value },
          { $expr: { $eq: [{ $size: `$${field}` }, 1] } },
        ],
      };
    }
    case 'notOnlyContains': {
      return {
        $and: [
          { [field]: value },
          { $expr: { $ne: [{ $size: `$${field}` }, 1] } },
        ],
      };
    }
    case 'elementContains': {
      return {
        $expr: {
          $anyElementTrue: {
            $map: {
              input: { $ifNull: [`$${field}`, []] },
              as: 'var',
              in: {
                $regexMatch: { input: '$$var', regex: value, options: 'i' },
              },
            },
          },
        },
      };
    }
    case 'elementNotContains': {
      return {
        $expr: {
          $not: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: [`$${field}`, []] },
                as: 'var',
                in: {
                  $regexMatch: { input: '$$var', regex: value, options: 'i' },
                },
              },
            },
          },
        },
      };
    }
    case 'notEquals': {
      return { [field]: { $ne: value } };
    }
    case 'equals': {
      return { [field]: value };
    }
    case 'notContains': {
      //Fixes the regex to work with special characters
      //options: "i" makes the regex case-insensitive
      return {
        [field]: {
          $not: {
            $regex: `${value.replace(EscapeCharactersRegex, '\\$1')}`,
            $options: 'i',
          },
        },
      };
    }
    case 'contains': {
      return {
        [field]: {
          $regex: `${value.replace(EscapeCharactersRegex, '\\$1')}`,
          $options: 'i',
        },
      };
    }
    case 'startsWith': {
      return {
        [field]: {
          $regex: `^${value.replace(EscapeCharactersRegex, '\\$1')}`,
          $options: 'i',
        },
      };
    }
    case 'endsWith': {
      return {
        [field]: {
          $regex: `${value.replace(EscapeCharactersRegex, '\\$1')}$`,
          $options: 'i',
        },
      };
    }
    default:
      return { [field]: value };
  }
}

/**
 * @ignore
 */
const getProjectionFromConfigTable = (config: TableColumn[]) => {
  const projection = config.reduce(
    (currentProjection, curr) => {
      const keys = curr.key
        .split(';')
        .flatMap((key) => key.split(','))
        .map((k) => k.trim());
      keys.reduce(keysToProject, currentProjection);
      return currentProjection;
    },
    { _id: 1 },
  );
  return { $project: projection };
};

/**
 * @ignore
 */
const keysToProject = (
  currentProjection: any,
  key: any,
  index: number,
  arr: any[],
) => {
  if (index == arr.length - 1) {
    currentProjection[key] = 1;
    return currentProjection;
  }
  if (currentProjection[key]) {
    currentProjection = currentProjection[key];
    return currentProjection;
  }
  currentProjection[key] = {};
  currentProjection = currentProjection[key];
  return currentProjection;
};

/**
 * @ignore
 */
export const requestUtilities = {
  buildAggregationFromRequest,
  getProjectionFromConfigTable,
};
