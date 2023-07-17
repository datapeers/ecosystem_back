import { Types } from 'mongoose';
export const default_types_events = [
  {
    _id: new Types.ObjectId('646f941ac2305c411d73f6c7'),
    name: 'Entrevista',
    extra_options: {
      allow_acta: false,
      allow_files: true,
    },
  },
  {
    _id: new Types.ObjectId('646f943cc2305c411d73f6d0'),
    name: 'Mentoría',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
  },
  {
    _id: new Types.ObjectId('646f9538c2305c411d73f6fb'),
    name: 'Asesoría',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
    isDeleted: false,
  },

  {
    _id: new Types.ObjectId('646f953cc2305c411d73f700'),
    name: 'Team Coach session',
    extra_options: {
      allow_acta: true,
      allow_files: true,
    },
  },
];
