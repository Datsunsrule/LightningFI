import type { Deputy, FI, RecognitionEvent } from './types';

export const mockDeputy: Deputy = {
  name: 'Deputy',
  firstName: 'Demo',
  badge: '5421',
  rank: 'Corporal',
  unit: 'San Clemente Patrol',
  shift: 'Watch 2',
};

export const mockStats = {
  fisThisWeek: 12,
  recognitionEvents: 8,
  avgTimePerFI: '4:32',
  totalFIs: 1847,
};

export const mockFIs: FI[] = [
  {
    fiNumber: '207534',
    contactDateTime: '2026-05-24T14:32',
    location: { text: '2100 Avenida Del Mar, San Clemente, CA 92672', lat: 33.4269, lng: -117.6201 },
    individuals: [],
    vehicles: [],
    reason: 'Suspicious activity near beach parking',
    narrative: 'Subject observed looking into parked vehicles in beach lot.',
    tags: ['suspicious', 'beach'],
  },
  {
    fiNumber: '207491',
    contactDateTime: '2026-05-23T22:15',
    location: { text: '500 El Camino Real, San Clemente, CA 92672' },
    individuals: [],
    vehicles: [],
    reason: 'Trespassing / loitering',
    narrative: 'Two subjects found in closed park after hours.',
    tags: ['trespass'],
  },
  {
    fiNumber: '207455',
    contactDateTime: '2026-05-22T09:47',
    location: { text: 'Ave Pico & I-5 on-ramp, San Clemente' },
    individuals: [],
    vehicles: [],
    reason: 'Pedestrian check',
    narrative: 'Subject walking on freeway shoulder, no ID.',
    tags: ['pedestrian'],
  },
  {
    fiNumber: '207412',
    contactDateTime: '2026-05-20T16:05',
    location: { text: 'Talega Golf Club parking lot, San Clemente' },
    individuals: [],
    vehicles: [],
    reason: 'Vehicle prowl check',
    narrative: 'Subject looking into vehicles in golf club lot.',
    tags: ['vehicle', 'suspicious'],
  },
  {
    fiNumber: '207388',
    contactDateTime: '2026-05-18T11:30',
    location: { text: '800 N El Camino Real, San Clemente' },
    individuals: [],
    vehicles: [],
    reason: 'Warrant check / subject known to warrants',
    narrative: 'Contacted subject per prior tip from patrol.',
    tags: ['warrant'],
  },
];

export const mockRecognitionEvents: RecognitionEvent[] = [
  {
    id: 1,
    fiNumber: '207534',
    action: 'viewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    message: 'Your FI #207534 was reviewed by Investigations',
  },
  {
    id: 2,
    fiNumber: '207491',
    action: 'saved',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    message: 'Your FI #207491 was saved by a supervisor',
  },
  {
    id: 3,
    fiNumber: '207455',
    action: 'referenced',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    message: 'Your FI #207455 was referenced in a follow-up',
  },
  {
    id: 4,
    fiNumber: '207412',
    action: 'viewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    message: 'Your FI #207412 was reviewed by Investigations',
  },
  {
    id: 5,
    fiNumber: '207388',
    action: 'saved',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    message: 'Your FI #207388 was saved by a supervisor',
  },
];
