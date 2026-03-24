import { useAuthStore } from '@/app/store/auth.store';
import { ProfileLayout } from '../components/ProfileLayout';
import { EditNameForm, ChangePasswordForm } from '../components/ProfileForms';
import { Link } from 'react-router-dom';

const ROLE_LABEL: Record<string, string> = {
  USER: 'Customer',
  ADMIN: 'Administrator',
};

export default function ProfilePage() {
  const user = useAuthStore(s => s.user);

  if (!user) return null;

  return (
    <ProfileLayout>
      <div className='flex flex-col gap-6'>
        <div className='card p-5 flex items-center gap-4'>
          <div className='w-14 h-14 rounded-2xl bg-ob-blue flex items-center justify-center text-2xl shrink-0'>
            {user.name?.[0]?.toUpperCase() ?? '👤'}
          </div>
          <div className='min-w-0'>
            <p className='font-display font-semibold text-lg text-ob-text truncate'>{user.name ?? 'No name set'}</p>
            <p className='text-sm text-ob-muted truncate'>{user.email}</p>
            {user.phone && <p className='text-xs text-ob-muted'>{user.phone}</p>}
            <span className='inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-ob-caramel/10 text-ob-caramel'>
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>
        </div>

        {!user.phone && (
          <div className='rounded-xl bg-amber-50 border border-amber-200 px-4 py-3'>
            <p className='text-sm font-semibold text-amber-700 mb-0.5'>📞 Phone number missing</p>
            <p className='text-xs text-amber-600 leading-relaxed'>Please add your phone number below — it's required for orders and reservations.</p>
          </div>
        )}

        {/* ── Personal info form ── */}
        <div className='card p-5'>
          <h2 className='font-display font-semibold text-sm uppercase tracking-wider text-ob-muted mb-5'>Personal Information</h2>
          <EditNameForm user={user} />
        </div>

        <div className='card p-5'>
          <h2 className='font-display font-semibold text-sm uppercase tracking-wider text-ob-muted mb-5'>Change Password</h2>
          <ChangePasswordForm />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Link to='/profile/addresses' className='card p-5 flex flex-col gap-2 hover:shadow-md transition-shadow group'>
            <span className='text-2xl'>📍</span>
            <p className='font-semibold text-sm text-ob-text'>Delivery Addresses</p>
            <p className='text-xs text-ob-muted'>Manage your saved addresses</p>
            <span className='text-xs font-medium text-ob-caramel group-hover:underline mt-auto'>Manage →</span>
          </Link>
          <Link to='/profile/payments' className='card p-5 flex flex-col gap-2 hover:shadow-md transition-shadow group'>
            <span className='text-2xl'>💳</span>
            <p className='font-semibold text-sm text-ob-text'>Payment Cards</p>
            <p className='text-xs text-ob-muted'>Manage your saved cards</p>
            <span className='text-xs font-medium text-ob-caramel group-hover:underline mt-auto'>Manage →</span>
          </Link>
        </div>
      </div>
    </ProfileLayout>
  );
}
