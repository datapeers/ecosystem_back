import { Types } from 'mongoose';
/**
 * default types events app
 */
export const default_types_events = [
  {
    _id: new Types.ObjectId('646f943cc2305c411d73f6d0'),
    name: 'Mentoría',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
    expertFocus: true,
  },
  {
    _id: new Types.ObjectId('646f9538c2305c411d73f6fb'),
    name: 'Asesoría',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
    expertFocus: true,
  },
  {
    _id: new Types.ObjectId('646f953cc2305c411d73f700'),
    name: 'Team Coach session',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
  },
  {
    _id: new Types.ObjectId('646f941ac2305c411d73f6c7'),
    name: 'Entrevista',
    extra_options: {
      allow_acta: false,
      allow_files: true,
    },
  },
  {
    _id: new Types.ObjectId('646f953dc2305c411d73f705'),
    name: 'Comités',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
  },
  {
    _id: new Types.ObjectId('646f958cc2305c411d73f716'),
    name: 'Master Class',
    extra_options: {
      allow_acta: false,
      allow_files: false,
    },
  },
  {
    _id: new Types.ObjectId('646f9598c2305c411d73f71f'),
    name: 'Workshop',
    extra_options: {
      allow_acta: false,
      allow_files: false,
    },
  },
  {
    _id: new Types.ObjectId('646f95a2c2305c411d73f728'),
    name: 'Kickoff',
    extra_options: {
      allow_acta: false,
      allow_files: false,
    },
  },
  {
    _id: new Types.ObjectId('646f95e1c2305c411d73f737'),
    name: 'Demo day',
    extra_options: {
      allow_acta: false,
      allow_files: false,
    },
  },
  {
    _id: new Types.ObjectId('646f95f2c2305c411d73f740'),
    name: 'Networking',
    extra_options: {
      allow_acta: false,
      allow_files: false,
    },
  },
];
