import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useUpdateSettings } from '../hooks/useAdminSettings';
import { ErrorState, LoadingState, Spinner } from '@/components/shared/ui';
import { formatPrice } from '@/utils/cn';
import { calcFinalTotalClient } from '@/utils/pricingClient';
import { useEffect } from 'react';

// ── Schemas ────────────────────────────────────────────────
const restaurantInfoSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
});

const pricingSchema = z.object({
  taxRate: z.coerce.number().min(0).max(100, 'Must be 0–100'),
  deliveryFee: z.coerce.number().min(0),
  serviceFee: z.coerce.number().min(0),
  freeDeliveryThreshold: z.coerce.number().min(0),
});

type RestaurantInfoForm = z.infer<typeof restaurantInfoSchema>;
type PricingFormInput = z.input<typeof pricingSchema>;
type PricingFormData = z.output<typeof pricingSchema>;

// ── Component ──────────────────────────────────────────────
export default function SettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings();
  const updateMutation = useUpdateSettings();

  // Restaurant info form
  const infoForm = useForm<RestaurantInfoForm>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: { restaurantName: '' },
  });

  const pricingForm = useForm<PricingFormInput, unknown, PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      taxRate: '',
      deliveryFee: '',
      serviceFee: '',
      freeDeliveryThreshold: '',
    },
  });

  // Populate forms when data arrives
  useEffect(() => {
    if (settings) {
      infoForm.reset({ restaurantName: settings.restaurantName });
      pricingForm.reset({
        taxRate: parseFloat(settings.taxRate) * 100,
        deliveryFee: parseFloat(settings.deliveryFee),
        serviceFee: parseFloat(settings.serviceFee),
        freeDeliveryThreshold: parseFloat(settings.freeDeliveryThreshold),
      });
    }
  }, [settings, infoForm, pricingForm]);

  const onSaveInfo = (data: RestaurantInfoForm) => {
    updateMutation.mutate({ restaurantName: data.restaurantName });
  };

  const onSavePricing = (data: PricingFormData) => {
    updateMutation.mutate({
      taxRate: data.taxRate / 100,
      deliveryFee: data.deliveryFee,
      serviceFee: data.serviceFee,
      freeDeliveryThreshold: data.freeDeliveryThreshold,
    });
  };

  const watchedPricing = useWatch({
    control: pricingForm.control,
  });

  const normalizedPricing = {
    taxRate: Number(watchedPricing.taxRate ?? 0),
    deliveryFee: Number(watchedPricing.deliveryFee ?? 0),
    serviceFee: Number(watchedPricing.serviceFee ?? 0),
    freeDeliveryThreshold: Number(watchedPricing.freeDeliveryThreshold ?? 0),
  };

  const previewSettings = settings
    ? {
        ...settings,
        taxRate: String(normalizedPricing.taxRate / 100),
        deliveryFee: String(watchedPricing.deliveryFee),
        serviceFee: String(watchedPricing.serviceFee),
        freeDeliveryThreshold: String(watchedPricing.freeDeliveryThreshold),
      }
    : null;

  const preview = previewSettings ? calcFinalTotalClient(50, previewSettings, 'DELIVERY') : null;

  if (isLoading) {
    return <LoadingState message='Fetching system settings...' />;
  }

  if (error) {
    return <ErrorState title='Failed to load settings' onRetry={refetch} />;
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <h1 className='section-title'>System Settings</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* ── Restaurant Info ─────────────────────── */}
        <form onSubmit={infoForm.handleSubmit(onSaveInfo)} className='card p-6 space-y-5'>
          <h2 className='text-base font-display font-semibold text-ob-text'>Restaurant Info</h2>

          <div className='space-y-1.5'>
            <label htmlFor='restaurantName' className='label'>
              Restaurant Name
            </label>
            <input
              id='restaurantName'
              type='text'
              className={infoForm.formState.errors.restaurantName ? 'input input-error' : 'input'}
              {...infoForm.register('restaurantName')}
            />
            {infoForm.formState.errors.restaurantName && <p className='field-error'>{infoForm.formState.errors.restaurantName.message}</p>}
          </div>

          <button type='submit' className='btn-primary inline-flex items-center gap-2' disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Spinner variant='white' size='sm' />}
            Save restaurant info
          </button>
        </form>

        {/* ── Pricing Rules ───────────────────────── */}
        <form onSubmit={pricingForm.handleSubmit(onSavePricing)} className='card p-6 space-y-5'>
          <h2 className='text-base font-display font-semibold text-ob-text'>Pricing Rules</h2>

          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label htmlFor='taxRate' className='label'>
                Tax Rate (%)
              </label>
              <input
                id='taxRate'
                type='number'
                step='0.1'
                min='0'
                max='100'
                className={pricingForm.formState.errors.taxRate ? 'input input-error' : 'input'}
                {...pricingForm.register('taxRate')}
              />
              {settings && <p className='text-xs text-ob-muted'>Current: {(parseFloat(settings.taxRate) * 100).toFixed(0)}%</p>}
              {pricingForm.formState.errors.taxRate && <p className='field-error'>{pricingForm.formState.errors.taxRate.message}</p>}
            </div>

            <div className='space-y-1.5'>
              <label htmlFor='deliveryFee' className='label'>
                Delivery Fee (PLN)
              </label>
              <input
                id='deliveryFee'
                type='number'
                step='0.01'
                min='0'
                className={pricingForm.formState.errors.deliveryFee ? 'input input-error' : 'input'}
                {...pricingForm.register('deliveryFee')}
              />
              {pricingForm.formState.errors.deliveryFee && <p className='field-error'>{pricingForm.formState.errors.deliveryFee.message}</p>}
            </div>

            <div className='space-y-1.5'>
              <label htmlFor='serviceFee' className='label'>
                Service Fee (PLN)
              </label>
              <input
                id='serviceFee'
                type='number'
                step='0.01'
                min='0'
                className={pricingForm.formState.errors.serviceFee ? 'input input-error' : 'input'}
                {...pricingForm.register('serviceFee')}
              />
              {pricingForm.formState.errors.serviceFee && <p className='field-error'>{pricingForm.formState.errors.serviceFee.message}</p>}
            </div>

            <div className='space-y-1.5'>
              <label htmlFor='freeDeliveryThreshold' className='label'>
                Free Delivery Threshold (PLN)
              </label>
              <input
                id='freeDeliveryThreshold'
                type='number'
                step='0.01'
                min='0'
                className={pricingForm.formState.errors.freeDeliveryThreshold ? 'input input-error' : 'input'}
                {...pricingForm.register('freeDeliveryThreshold')}
              />
              <p className='text-xs text-ob-muted'>Free delivery above this order total</p>
              {pricingForm.formState.errors.freeDeliveryThreshold && (
                <p className='field-error'>{pricingForm.formState.errors.freeDeliveryThreshold.message}</p>
              )}
            </div>
          </div>

          <button type='submit' className='btn-primary inline-flex items-center gap-2' disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Spinner variant='white' size='sm' />}
            Save pricing
          </button>
        </form>
      </div>

      {/* ── Live Preview ───────────────────────── */}
      {preview && (
        <div className='card-blue p-6 max-w-md space-y-3'>
          <h3 className='text-sm font-display font-semibold text-ob-text'>Live Preview — Delivery Order (50.00 PLN subtotal)</h3>
          <div className='divider' />
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-ob-muted'>Subtotal</span>
              <span>{formatPrice(preview.subtotal)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-ob-muted'>Tax ({normalizedPricing.taxRate}%)</span>
              <span>{formatPrice(preview.tax)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-ob-muted'>Delivery Fee</span>
              <span>{preview.deliveryFee === 0 ? 'Free' : formatPrice(preview.deliveryFee)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-ob-muted'>Service Fee</span>
              <span>{formatPrice(preview.serviceFee)}</span>
            </div>
            <div className='divider' />
            <div className='flex justify-between font-semibold font-display text-base'>
              <span>Total</span>
              <span className='text-ob-caramel'>{formatPrice(preview.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
