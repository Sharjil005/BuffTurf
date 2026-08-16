import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  getSports,
  getFacilities,
  createTurf,
  uploadTurfImage,
  type Sport,
  type Facility,
} from '../../services/api/turf';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface FormValues {
  name: string;
  description: string;
  address: string;
  city: string;
  sportIds: number[];
  facilityIds: number[];
}

export default function AddTurf() {
  const navigate = useNavigate();
  const [sports, setSports] = useState<Sport[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    getSports().then(setSports);
    getFacilities().then(setFacilities);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { sportIds: [], facilityIds: [] },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const turf = await createTurf(data);
      if (imageFile) {
        await uploadTurfImage(turf.id, imageFile);
      }
      navigate('/owner');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl uppercase text-ink-900">Add Turf</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          label="Turf Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
        <Input
          label="Address"
          {...register('address', { required: 'Address is required' })}
          error={errors.address?.message}
        />
        <Input
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />

        <div>
          <label className="text-sm font-medium text-ink-900">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-900">Sports Available</label>
          <Controller
            name="sportIds"
            control={control}
            rules={{ validate: (v) => v.length > 0 || 'Select at least one sport' }}
            render={({ field }) => (
              <div className="mt-2 flex flex-wrap gap-2">
                {sports.map((sport) => {
                  const checked = field.value.includes(sport.id);
                  return (
                    <button
                      type="button"
                      key={sport.id}
                      onClick={() =>
                        field.onChange(
                          checked
                            ? field.value.filter((id) => id !== sport.id)
                            : [...field.value, sport.id]
                        )
                      }
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        checked
                          ? 'border-pitch-500 bg-pitch-500 text-chalk-50'
                          : 'border-ink-900/15 text-ink-900/70'
                      }`}
                    >
                      {sport.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.sportIds && (
            <p className="mt-1 text-sm text-red-500">{errors.sportIds.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink-900">Facilities</label>
          <Controller
            name="facilityIds"
            control={control}
            render={({ field }) => (
              <div className="mt-2 flex flex-wrap gap-2">
                {facilities.map((facility) => {
                  const checked = field.value.includes(facility.id);
                  return (
                    <button
                      type="button"
                      key={facility.id}
                      onClick={() =>
                        field.onChange(
                          checked
                            ? field.value.filter((id) => id !== facility.id)
                            : [...field.value, facility.id]
                        )
                      }
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        checked
                          ? 'border-turf-700 bg-turf-700 text-chalk-50'
                          : 'border-ink-900/15 text-ink-900/70'
                      }`}
                    >
                      {facility.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-900">Turf Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1.5 block text-sm text-ink-900/70"
          />
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Creating...' : 'Create Turf'}
        </Button>
      </form>
    </div>
  );
}