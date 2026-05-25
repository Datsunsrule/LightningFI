import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  RefreshCw, Clock, MapPin, LocateFixed, Hash,
  ChevronDown, ChevronRight, Plus, X, ArrowLeft,
  Save, AlertCircle, User, Camera,
} from 'lucide-react';
import { FieldLabel } from '../components/form/FieldLabel';
import { TextInput } from '../components/form/TextInput';
import { TextArea } from '../components/form/TextArea';
import { RecognitionToast } from '../components/RecognitionToast';
import { ExitDraftModal } from '../components/ExitDraftModal';
import { generateFINumber, toLocalDateTimeString } from '../lib/format';
import { newIndividual, newVehicle } from '../lib/factories';
import { saveDraft, deleteDraft } from '../lib/drafts';
import type { Individual, Vehicle, FILocation } from '../lib/types';

// ── Shared glass panel ─────────────────────────────────────────────────────
const glass = 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl';

// ── Section header ─────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-[0.3em] uppercase text-amber-400/80 mb-3">
    {children}
  </p>
);

// ── Role chip selector ─────────────────────────────────────────────────────
const ROLES: Individual['role'][] = ['Subject', 'Associate', 'Passenger', 'Witness', 'Other'];

const RoleChips = ({
  value,
  onChange,
}: {
  value: Individual['role'];
  onChange: (r: Individual['role']) => void;
}) => (
  <div className="flex flex-wrap gap-1.5 mb-3">
    {ROLES.map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => onChange(r)}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
          value === r
            ? 'bg-amber-400 text-[#1a1410]'
            : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
        }`}
      >
        {r}
      </button>
    ))}
  </div>
);

// ── Individual card ────────────────────────────────────────────────────────
const IndividualCard = ({
  ind,
  index,
  isActive,
  onActivate,
  onChange,
  onRemove,
}: {
  ind: Individual;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onChange: (field: keyof Individual, value: string) => void;
  onRemove?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const borderClass = isActive
    ? 'border-amber-400/30 bg-amber-400/[0.04]'
    : 'border-white/10 bg-black/30';

  return (
    <div
      className={`rounded-xl border backdrop-blur-xl p-4 mb-3 transition-colors ${borderClass}`}
      onClick={onActivate}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          Individual {index + 1}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Role chips (only for non-first individuals) */}
      {index > 0 && (
        <RoleChips value={ind.role} onChange={(r) => onChange('role', r)} />
      )}

      {/* Name row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="col-span-2">
          <FieldLabel>First</FieldLabel>
          <TextInput
            value={ind.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="First"
          />
        </div>
        <div>
          <FieldLabel>MI</FieldLabel>
          <TextInput
            value={ind.middleName}
            onChange={(e) => onChange('middleName', e.target.value)}
            placeholder="MI"
          />
        </div>
        <div className="col-span-1">
          <FieldLabel>Last</FieldLabel>
          <TextInput
            value={ind.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Last"
          />
        </div>
      </div>

      {/* Demographics row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="col-span-2">
          <FieldLabel>DOB</FieldLabel>
          <input
            type="date"
            value={ind.dob}
            onChange={(e) => onChange('dob', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div>
          <FieldLabel>Age</FieldLabel>
          <TextInput
            value={ind.age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="—"
          />
        </div>
        <div>
          <FieldLabel required>Sex</FieldLabel>
          <TextInput
            value={ind.sex}
            onChange={(e) => onChange('sex', e.target.value.toUpperCase())}
            placeholder="M/F"
            maxLength={1}
          />
        </div>
      </div>

      {/* Second demographics row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <FieldLabel required>Race</FieldLabel>
          <TextInput
            value={ind.race}
            onChange={(e) => onChange('race', e.target.value.toUpperCase())}
            placeholder="W/B/H/A…"
            maxLength={2}
          />
        </div>
        <div>
          <FieldLabel>Res. Status</FieldLabel>
          <TextInput
            value={ind.residentStatus}
            onChange={(e) => onChange('residentStatus', e.target.value)}
            placeholder="Resident…"
          />
        </div>
      </div>

      {/* Physical description row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div>
          <FieldLabel>Height</FieldLabel>
          <TextInput
            value={ind.height}
            onChange={(e) => onChange('height', e.target.value)}
            placeholder="5-10"
          />
        </div>
        <div>
          <FieldLabel>Weight</FieldLabel>
          <TextInput
            value={ind.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            placeholder="lbs"
          />
        </div>
        <div>
          <FieldLabel>Hair</FieldLabel>
          <TextInput
            value={ind.hairColor}
            onChange={(e) => onChange('hairColor', e.target.value.toUpperCase())}
            placeholder="BLK"
          />
        </div>
        <div>
          <FieldLabel>Eyes</FieldLabel>
          <TextInput
            value={ind.eyeColor}
            onChange={(e) => onChange('eyeColor', e.target.value.toUpperCase())}
            placeholder="BRN"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <FieldLabel>Notes</FieldLabel>
        <TextArea
          value={ind.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Additional observations…"
          rows={2}
        />
      </div>

      {/* Add Details disclosure */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-400/80 transition-colors mt-1"
      >
        {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        {expanded ? 'Hide details' : 'Add details'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-white/5">
          {/* Alias */}
          <div>
            <FieldLabel>Alias / AKA</FieldLabel>
            <TextInput value={ind.alias} onChange={(e) => onChange('alias', e.target.value)} placeholder="Known aliases" />
          </div>
          {/* Address */}
          <div>
            <FieldLabel>Address</FieldLabel>
            <TextInput value={ind.address} onChange={(e) => onChange('address', e.target.value)} placeholder="Street address" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>City / State / Zip</FieldLabel>
              <TextInput value={ind.csz} onChange={(e) => onChange('csz', e.target.value)} placeholder="City, ST ZIP" />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput value={ind.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="(xxx) xxx-xxxx" type="tel" />
            </div>
          </div>
          {/* ID */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>ID Type</FieldLabel>
              <TextInput value={ind.idType} onChange={(e) => onChange('idType', e.target.value)} placeholder="DL / Passport" />
            </div>
            <div>
              <FieldLabel>ID Number</FieldLabel>
              <TextInput value={ind.idNumber} onChange={(e) => onChange('idNumber', e.target.value.toUpperCase())} placeholder="Number" mono />
            </div>
            <div>
              <FieldLabel>ID State</FieldLabel>
              <TextInput value={ind.idState} onChange={(e) => onChange('idState', e.target.value.toUpperCase())} placeholder="CA" maxLength={2} />
            </div>
          </div>
          {/* Physical extended */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>Hair Style</FieldLabel>
              <TextInput value={ind.hairStyle} onChange={(e) => onChange('hairStyle', e.target.value)} placeholder="Style" />
            </div>
            <div>
              <FieldLabel>Hair Length</FieldLabel>
              <TextInput value={ind.hairLength} onChange={(e) => onChange('hairLength', e.target.value)} placeholder="Short…" />
            </div>
            <div>
              <FieldLabel>Facial Hair</FieldLabel>
              <TextInput value={ind.facialHair} onChange={(e) => onChange('facialHair', e.target.value)} placeholder="None…" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>Complexion</FieldLabel>
              <TextInput value={ind.complexion} onChange={(e) => onChange('complexion', e.target.value)} placeholder="Fair…" />
            </div>
            <div>
              <FieldLabel>Build</FieldLabel>
              <TextInput value={ind.build} onChange={(e) => onChange('build', e.target.value)} placeholder="MED…" />
            </div>
            <div>
              <FieldLabel>Teeth</FieldLabel>
              <TextInput value={ind.teeth} onChange={(e) => onChange('teeth', e.target.value)} placeholder="Normal…" />
            </div>
          </div>
          {/* Alerts */}
          <div>
            <FieldLabel>Alert(s)</FieldLabel>
            <TextInput value={ind.alerts} onChange={(e) => onChange('alerts', e.target.value)} placeholder="Caution / armed / medical…" />
          </div>
          {/* SMT + Attire */}
          <div>
            <FieldLabel>Scars, Marks, Tattoos, Oddities</FieldLabel>
            <TextArea value={ind.scarsMarksTattoos} onChange={(e) => onChange('scarsMarksTattoos', e.target.value)} placeholder="Describe visible marks…" rows={2} />
          </div>
          <div>
            <FieldLabel>Attire</FieldLabel>
            <TextInput value={ind.attire} onChange={(e) => onChange('attire', e.target.value)} placeholder="Describe clothing…" />
          </div>
        </div>
      )}
    </div>
  );
};

// ── Vehicle card ───────────────────────────────────────────────────────────
const VehicleCard = ({
  veh,
  index,
  onChange,
  onRemove,
}: {
  veh: Vehicle;
  index: number;
  onChange: (field: keyof Vehicle, value: string) => void;
  onRemove: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl p-4 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          Vehicle {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Plate + State */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="col-span-2">
          <FieldLabel>Plate</FieldLabel>
          <TextInput value={veh.plate} onChange={(e) => onChange('plate', e.target.value.toUpperCase())} placeholder="8ABC123" mono />
        </div>
        <div>
          <FieldLabel>State</FieldLabel>
          <TextInput value={veh.state} onChange={(e) => onChange('state', e.target.value.toUpperCase())} placeholder="CA" maxLength={2} />
        </div>
      </div>

      {/* Year + Type */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <FieldLabel>Year</FieldLabel>
          <TextInput value={veh.year} onChange={(e) => onChange('year', e.target.value)} placeholder="2019" maxLength={4} />
        </div>
        <div>
          <FieldLabel required>Type</FieldLabel>
          <TextInput value={veh.type} onChange={(e) => onChange('type', e.target.value)} placeholder="Auto / Truck…" />
        </div>
      </div>

      {/* Make + Model */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <FieldLabel required>Make</FieldLabel>
          <TextInput value={veh.make} onChange={(e) => onChange('make', e.target.value)} placeholder="Ford" />
        </div>
        <div>
          <FieldLabel>Model</FieldLabel>
          <TextInput value={veh.model} onChange={(e) => onChange('model', e.target.value)} placeholder="F-150" />
        </div>
      </div>

      {/* Color */}
      <div className="mb-3">
        <FieldLabel>Color</FieldLabel>
        <TextInput value={veh.color} onChange={(e) => onChange('color', e.target.value)} placeholder="White" />
      </div>

      {/* Notes */}
      <div className="mb-2">
        <FieldLabel>Notes</FieldLabel>
        <TextArea value={veh.notes} onChange={(e) => onChange('notes', e.target.value)} placeholder="Additional observations…" rows={2} />
      </div>

      {/* Add Details */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-400/80 transition-colors mt-1"
      >
        {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        {expanded ? 'Hide details' : 'Add details'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Plate Exp. (MO/YR)</FieldLabel>
              <TextInput value={veh.plateExp} onChange={(e) => onChange('plateExp', e.target.value)} placeholder="11/26" />
            </div>
            <div>
              <FieldLabel>Body Style</FieldLabel>
              <TextInput value={veh.bodyStyle} onChange={(e) => onChange('bodyStyle', e.target.value)} placeholder="Sedan / SUV…" />
            </div>
          </div>
          <div>
            <FieldLabel>VIN</FieldLabel>
            <TextInput value={veh.vin} onChange={(e) => onChange('vin', e.target.value.toUpperCase())} placeholder="17-character VIN" maxLength={17} mono />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>Color 2</FieldLabel>
              <TextInput value={veh.color2} onChange={(e) => onChange('color2', e.target.value)} placeholder="—" />
            </div>
            <div>
              <FieldLabel>Int. Color</FieldLabel>
              <TextInput value={veh.intColor} onChange={(e) => onChange('intColor', e.target.value)} placeholder="—" />
            </div>
            <div>
              <FieldLabel>Direction</FieldLabel>
              <TextInput value={veh.directionOfTravel} onChange={(e) => onChange('directionOfTravel', e.target.value)} placeholder="NB / SB…" />
            </div>
          </div>
          <div>
            <FieldLabel>Exterior Description</FieldLabel>
            <TextInput value={veh.exteriorDesc} onChange={(e) => onChange('exteriorDesc', e.target.value)} placeholder="Aftermarket wheels, tint…" />
          </div>
          <div>
            <FieldLabel>Body Description</FieldLabel>
            <TextInput value={veh.bodyDesc} onChange={(e) => onChange('bodyDesc', e.target.value)} placeholder="Dents, rust, primer…" />
          </div>
          <div>
            <FieldLabel>Damage / Customization</FieldLabel>
            <TextArea value={veh.damage} onChange={(e) => onChange('damage', e.target.value)} placeholder="Describe damage or custom modifications…" rows={2} />
          </div>
          <div>
            <FieldLabel>Window Description</FieldLabel>
            <TextInput value={veh.windowDesc} onChange={(e) => onChange('windowDesc', e.target.value)} placeholder="Tinted, cracked…" />
          </div>
        </div>
      )}
    </div>
  );
};

// ── Form state ─────────────────────────────────────────────────────────────
interface FormState {
  fiNumber: string;
  contactDateTime: string;
  location: FILocation;
  individuals: Individual[];
  vehicles: Vehicle[];
  reason: string;
  narrative: string;
}

const buildInitialState = (): FormState => ({
  fiNumber: generateFINumber(),
  contactDateTime: toLocalDateTimeString(new Date()),
  location: { text: '' },
  individuals: [newIndividual(1, 'Subject')],
  vehicles: [],
  reason: '',
  narrative: '',
});

// ── Main screen ────────────────────────────────────────────────────────────
export const NewFI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resumedDraft = (location.state as { draft?: FormState } | null)?.draft;
  const [form, setForm] = useState<FormState>(() => resumedDraft ?? buildInitialState());
  const [activeIndividualId, setActiveIndividualId] = useState<number>(
    resumedDraft?.individuals[0]?.id ?? 1
  );
  const [nextId, setNextId] = useState(
    resumedDraft ? Math.max(...resumedDraft.individuals.map((i) => i.id), ...resumedDraft.vehicles.map((v) => v.id)) + 1 : 2
  );
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [toast, setToast] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);

  // ── Field updaters ────────────────────────────────────────────────────
  const updateIndividual = useCallback((id: number, field: keyof Individual, value: string) => {
    setForm((f) => ({
      ...f,
      individuals: f.individuals.map((ind) =>
        ind.id === id ? { ...ind, [field]: value } : ind
      ),
    }));
  }, []);

  const addIndividual = () => {
    const id = nextId;
    setNextId((n) => n + 1);
    setForm((f) => ({
      ...f,
      individuals: [...f.individuals, newIndividual(id, 'Associate')],
    }));
    setActiveIndividualId(id);
  };

  const removeIndividual = (id: number) => {
    setForm((f) => ({
      ...f,
      individuals: f.individuals.filter((ind) => ind.id !== id),
    }));
  };

  const updateVehicle = useCallback((id: number, field: keyof Vehicle, value: string) => {
    setForm((f) => ({
      ...f,
      vehicles: f.vehicles.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    }));
  }, []);

  const addVehicle = () => {
    const id = nextId;
    setNextId((n) => n + 1);
    setForm((f) => ({
      ...f,
      vehicles: [...f.vehicles, newVehicle(id)],
    }));
  };

  const removeVehicle = (id: number) => {
    setForm((f) => ({
      ...f,
      vehicles: f.vehicles.filter((v) => v.id !== id),
    }));
  };

  // ── GPS ───────────────────────────────────────────────────────────────
  const getLocation = () => {
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'LightningFI/1.0' } }
          );
          const data = await r.json();
          setForm((f) => ({
            ...f,
            location: { text: data.display_name, lat, lng, accuracy: Math.round(accuracy) },
          }));
        } catch {
          setForm((f) => ({
            ...f,
            location: { text: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng, accuracy: Math.round(accuracy) },
          }));
        }
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.message || 'Unable to get location');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ── Back / exit ───────────────────────────────────────────────────────
  const handleBack = () => {
    setShowExitModal(true);
  };

  const handleSaveDraft = () => {
    saveDraft(form);
    setShowExitModal(false);
    navigate('/dashboard');
  };

  const handleDiscard = () => {
    // FI number is "released" — just navigate away without saving
    setShowExitModal(false);
    navigate('/dashboard');
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSave = () => {
    // If this was a draft, remove it from storage on final save
    deleteDraft(form.fiNumber);
    setToast(`FI #${form.fiNumber} saved successfully`);
    setTimeout(() => {
      setForm(buildInitialState());
      setNextId(2);
      setActiveIndividualId(1);
      navigate('/dashboard');
    }, 1500);
  };

  const loc = form.location;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/LightningFI/assets/bronco-bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-black/65" />

      {/* Toast */}
      {toast && (
        <RecognitionToast message={toast} onDismiss={() => setToast('')} />
      )}

      {/* Exit / draft modal */}
      {showExitModal && (
        <ExitDraftModal
          fiNumber={form.fiNumber}
          onSaveDraft={handleSaveDraft}
          onDiscard={handleDiscard}
          onKeepEditing={() => setShowExitModal(false)}
        />
      )}

      {/* Header bar */}
      <div className="relative z-40 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/70">New Report</p>
            <p className="text-white text-sm font-medium leading-tight">Field Interview</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* ── Card A: FI Number ── */}
        <div className={`${glass} p-5`}>
          <SectionLabel>FI Number</SectionLabel>
          <div className="flex items-center gap-3">
            <Hash size={18} className="text-amber-400/50 shrink-0" />
            <span className="font-mono text-amber-400 text-3xl font-bold tracking-widest flex-1">
              {form.fiNumber}
            </span>
            {/* Reserved pill */}
            <span className="flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              Reserved
            </span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, fiNumber: generateFINumber() }))}
              className="p-2 rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/5 transition-colors"
              title="Regenerate number"
            >
              <RefreshCw size={15} />
            </button>
          </div>
          <p className="text-white/25 text-xs mt-3 leading-relaxed">
            Backend-assigned &middot; This number links to the master record and may be referenced in CAD, reports, and follow-up investigations.
          </p>
        </div>

        {/* ── Card B: Date & Time ── */}
        <div className={`${glass} p-5`}>
          <SectionLabel>Date &amp; Time of Contact</SectionLabel>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-amber-400/50 shrink-0" />
            <input
              type="datetime-local"
              value={form.contactDateTime}
              onChange={(e) => setForm((f) => ({ ...f, contactDateTime: e.target.value }))}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, contactDateTime: toLocalDateTimeString(new Date()) }))}
              className="p-2 rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/5 transition-colors"
              title="Reset to now"
            >
              <RefreshCw size={15} />
            </button>
          </div>
          <p className="text-white/25 text-xs mt-2">Defaults to now &middot; adjust for past contacts</p>
        </div>

        {/* ── Card C: Location ── */}
        <div className={`${glass} p-5`}>
          <SectionLabel>Location of Contact</SectionLabel>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-amber-400/50 shrink-0" />
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              className="flex items-center gap-1.5 text-xs text-amber-400 border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <LocateFixed size={13} className={geoLoading ? 'animate-spin' : ''} />
              {geoLoading ? 'Locating…' : 'My Location'}
            </button>
            {loc.accuracy !== undefined && (
              <span className="text-[10px] tracking-[0.15em] text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 px-2 py-1 rounded-full">
                ±{loc.accuracy}m
              </span>
            )}
          </div>

          {geoError && (
            <div className="flex items-center gap-2 text-red-400 text-xs mb-3 bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />
              {geoError}
            </div>
          )}

          <TextInput
            value={loc.text}
            onChange={(e) => setForm((f) => ({ ...f, location: { ...f.location, text: e.target.value } }))}
            placeholder="Street address or intersection"
          />

          {/* Static map preview */}
          {loc.lat !== undefined && loc.lng !== undefined && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
              <img
                src={`https://staticmap.openstreetmap.de/staticmap.php?center=${loc.lat},${loc.lng}&zoom=16&size=600x200&markers=${loc.lat},${loc.lng},red-pushpin`}
                alt="Location map"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* ── Card D: Individuals ── */}
        <div className={`${glass} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Individuals</SectionLabel>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-white/40 border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Camera size={13} />
              Scan License
            </button>
          </div>

          {form.individuals.map((ind, i) => (
            <IndividualCard
              key={ind.id}
              ind={ind}
              index={i}
              isActive={activeIndividualId === ind.id}
              onActivate={() => setActiveIndividualId(ind.id)}
              onChange={(field, value) => updateIndividual(ind.id, field, value)}
              onRemove={i > 0 ? () => removeIndividual(ind.id) : undefined}
            />
          ))}

          <button
            type="button"
            onClick={addIndividual}
            className="w-full flex items-center justify-center gap-2 text-sm text-white/50 border border-white/10 border-dashed hover:border-amber-400/40 hover:text-amber-400/80 rounded-xl py-3 transition-colors"
          >
            <Plus size={15} />
            Add Individual
          </button>
        </div>

        {/* ── Card E: Vehicles ── */}
        <div className={`${glass} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Vehicles</SectionLabel>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-white/40 border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Camera size={13} />
              Scan Plate / VIN
            </button>
          </div>

          {form.vehicles.length === 0 && (
            <p className="text-white/20 text-xs text-center py-4">No vehicles added</p>
          )}

          {form.vehicles.map((veh, i) => (
            <VehicleCard
              key={veh.id}
              veh={veh}
              index={i}
              onChange={(field, value) => updateVehicle(veh.id, field, value)}
              onRemove={() => removeVehicle(veh.id)}
            />
          ))}

          <button
            type="button"
            onClick={addVehicle}
            className="w-full flex items-center justify-center gap-2 text-sm text-white/50 border border-white/10 border-dashed hover:border-amber-400/40 hover:text-amber-400/80 rounded-xl py-3 transition-colors"
          >
            <Plus size={15} />
            Add Vehicle
          </button>
        </div>

        {/* ── Card F: Contact Details ── */}
        <div className={`${glass} p-5`}>
          <SectionLabel>Contact Details</SectionLabel>
          <div className="mb-4">
            <FieldLabel>Reason for Contact</FieldLabel>
            <TextInput
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Suspicious activity, pedestrian check…"
              icon={<User size={14} />}
            />
          </div>
          <div>
            <FieldLabel>Narrative</FieldLabel>
            <TextArea
              value={form.narrative}
              onChange={(e) => setForm((f) => ({ ...f, narrative: e.target.value }))}
              placeholder="Describe the contact in detail…"
              rows={6}
            />
          </div>
        </div>

        {/* ── Submit row ── */}
        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3.5 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors font-medium text-sm backdrop-blur-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-400/90 hover:bg-amber-400 active:scale-[0.98] text-[#1a1410] font-semibold text-sm transition-all border border-amber-300/40 backdrop-blur-xl shadow-lg shadow-amber-400/20"
          >
            <Save size={16} />
            Save Field Interview
          </button>
        </div>
      </main>
    </div>
  );
};
