export interface Individual {
  id: number;
  role: 'Subject' | 'Associate' | 'Passenger' | 'Witness' | 'Other';
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  alias: string;
  address: string;
  csz: string;
  phone: string;
  idType: string;
  idNumber: string;
  idState: string;
  race: string;
  sex: string;
  dob: string;
  age: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  hairStyle: string;
  hairLength: string;
  facialHair: string;
  complexion: string;
  build: string;
  teeth: string;
  residentStatus: string;
  alerts: string;
  scarsMarksTattoos: string;
  attire: string;
  notes: string;
  name: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  state: string;
  plateExp: string;
  year: string;
  type: string;
  make: string;
  model: string;
  bodyStyle: string;
  vin: string;
  color: string;
  color2: string;
  intColor: string;
  exteriorDesc: string;
  bodyDesc: string;
  damage: string;
  windowDesc: string;
  directionOfTravel: string;
  notes: string;
}

export interface FILocation {
  text: string;
  lat?: number;
  lng?: number;
  accuracy?: number;
}

export interface FI {
  fiNumber: string;
  contactDateTime: string;
  location: FILocation | string;
  individuals: Individual[];
  vehicles: Vehicle[];
  reason: string;
  narrative: string;
  tags: string[];
}

export interface RecognitionEvent {
  id: number;
  fiNumber: string;
  action: 'viewed' | 'saved' | 'referenced';
  timestamp: string;
  message: string;
}

export interface ScannedDL {
  individualId: number;
  last: string;
  first: string;
  mi: string;
  dob: string;
  dl: string;
  address: string;
  sex: string;
  hgt: string;
  wgt: string;
  eyes: string;
  hair: string;
  exp: string;
}

export interface ScannedVehicle {
  vehicleId: number;
  scanMode: 'plate' | 'vin';
  plate: string;
  state: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  color: string;
  reg_exp: string;
  registered_owner: string;
  stolen: boolean;
}

export interface Deputy {
  name: string;
  firstName: string;
  badge: string;
  rank: string;
  unit: string;
  shift: string;
}
