import { Types } from 'mongoose';

export const default_stages = [
  {
    _id: new Types.ObjectId('64418ce45aae5f4960eeedcd'),
    index: 0,
    name: 'Onboarding',
    label: 'Mindset',
    icon: 'pi pi-file',
    color: '#2E407E',
  },
  {
    _id: new Types.ObjectId('64418df35aae5f4960eeee0c'),
    index: 1,
    name: 'Early stage',
    label: 'Potential',
    icon: 'pi pi-file',
    color: '#DE3353',
  },
  {
    _id: new Types.ObjectId('64418e225aae5f4960eeee19'),
    index: 2,
    name: 'Grow stage',
    label: 'Scalability',
    icon: 'pi pi-file',
    color: '#F7AC12',
  },
  {
    _id: new Types.ObjectId('64418e4b5aae5f4960eeee2e'),
    index: 3,
    name: 'Late stage',
    label: 'Performance',
    icon: 'pi pi-file',
    color: '#AAB622',
  },
  {
    _id: new Types.ObjectId('64418e6b5aae5f4960eeee3b'),
    index: 4,
    name: 'Exit stage',
    label: 'Sharing',
    icon: 'pi pi-file',
    color: '#C54927',
  },
];
