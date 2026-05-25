import type { Individual, Vehicle } from './types';

export const newIndividual = (id: number, role: Individual['role'] = 'Subject'): Individual => ({
  id, role,
  firstName: '', middleName: '', lastName: '', suffix: '',
  alias: '',
  address: '', csz: '', phone: '',
  idType: '', idNumber: '', idState: '',
  race: '', sex: '', dob: '', age: '',
  height: '', weight: '', hairColor: '', eyeColor: '',
  hairStyle: '', hairLength: '', facialHair: '',
  complexion: '', build: '', teeth: '',
  residentStatus: '', alerts: '',
  scarsMarksTattoos: '', attire: '', notes: '',
  name: '',
});

export const newVehicle = (id: number): Vehicle => ({
  id,
  plate: '', state: '', plateExp: '',
  year: '', type: '', make: '', model: '', bodyStyle: '',
  vin: '',
  color: '', color2: '', intColor: '',
  exteriorDesc: '', bodyDesc: '', damage: '', windowDesc: '',
  directionOfTravel: '',
  notes: '',
});
