import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminOrders } from '@/admin/features/orders/hooks/useAdminOrders';
import { useAdminReservations } from '@/admin/features/reservations/hooks/useAdminReservations';
import { useAdminUsers } from '@/admin/features/users/hooks/useAdminUsers';
import { OrderStatusBadge, PaymentStatusBadge } from '@/features/orders/components/orders/OrderStatusBadge';
import { ReservationStatusBadge } from '@/features/reservations/components/ReservationStatusBadge';
import { LoadingState } from '@/shared/ui';
import { IconOrders, IconReservation, IconUsers, IconClock, IconPlus, IconArrowRight } from '@/shared/assets/icons';
import { formatPrice, formatDate, cn } from '@/shared/lib/utils/cn';
import type { OrderType } from '@/shared/types';

const ORDER_TYPE_ICON: Record<OrderType, string> = {
  DINE_IN: '🍽️',
  DELIVERY: '🛵',
  TAKE_OUT: '🥡',
};

function formatElapsed(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 24) return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh > 0 ? `${d}d ${rh}h ago` : `${d}d ago`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Parallel data fetching
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ page: 1, limit: 100 });
  const { data: pendingOrders, isLoading: pendingLoading } = useAdminOrders({ status: 'NEW', page: 1, limit: 50 });
  const { data: reservationsData, isLoading: reservationsLoading } = useAdminReservations({ status: 'CONFIRMED', page: 1, limit: 100 });
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ page: 1, limit: 100 });

  const isLoading = ordersLoading || pendingLoading || reservationsLoading || usersLoading;

  // ── Computed stats ────────────────────────────
  const stats = useMemo(() => {
    const referenceNow = new Date();
    const referenceTimestamp = referenceNow.getTime();

    const todayOrders = ordersData?.orders.filter(o => o.createdAt.startsWith(today)) ?? [];
    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);

    const upcomingReservations = reservationsData?.reservations?.filter(r => new Date(r.date) >= referenceNow) ?? [];
    const nextReservation = upcomingReservations[0];

    const pending = pendingOrders?.orders ?? [];
    const oldestPending =
      pending.length > 0 ? Math.round((referenceTimestamp - new Date(pending[pending.length - 1].createdAt).getTime()) / 60000) : 0;

    const todayUsers = usersData?.users?.filter(u => u.createdAt.startsWith(today)) ?? [];

    return {
      todayOrderCount: todayOrders.length,
      todayRevenue,
      activeReservations: upcomingReservations.length,
      nextReservationTime: nextReservation ? formatDate(nextReservation.date) : null,
      pendingCount: pending.length,
      oldestPendingMinutes: oldestPending,
      newUsersToday: todayUsers.length,
      totalUsers: usersData?.total ?? 0,
    };
  }, [ordersData, pendingOrders, reservationsData, usersData, today]);

  // ── Recent orders (last 10) ───────────────────
  const recentOrders = useMemo(() => {
    const orders = ordersData?.orders ?? [];
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  }, [ordersData]);

  // ── Today's reservations ──────────────────────
  const todaysReservations = useMemo(() => {
    return reservationsData?.reservations?.filter(r => r.date.startsWith(today)) ?? [];
  }, [reservationsData, today]);

  if (isLoading) {
    return <LoadingState message='Loading dashboard statistics...' />;
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='section-title'>Dashboard</h1>
        <span className='text-sm text-ob-muted font-mono'>{today}</span>
      </div>

      {/* ── KPI Cards ──────────────────────────── */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={<IconOrders className='w-5 h-5 text-ob-caramel' />}
          label="Today's Orders"
          primary={String(stats.todayOrderCount)}
          secondary={`Revenue: ${formatPrice(stats.todayRevenue)}`}
        />
        <StatCard
          icon={<IconReservation className='w-5 h-5 text-ob-caramel' />}
          label='Active Reservations'
          primary={String(stats.activeReservations)}
          secondary={stats.nextReservationTime ? `Next: ${stats.nextReservationTime}` : 'None upcoming'}
        />
        <StatCard
          icon={<IconClock className='w-5 h-5 text-ob-error' />}
          label='Pending Orders'
          primary={String(stats.pendingCount)}
          secondary={stats.oldestPendingMinutes > 0 ? `Oldest: ${formatElapsed(stats.oldestPendingMinutes)}` : 'None pending'}
          accent={stats.pendingCount > 0}
        />
        <StatCard
          icon={<IconUsers className='w-5 h-5 text-ob-caramel' />}
          label='New Users Today'
          primary={String(stats.newUsersToday)}
          secondary={`Total: ${stats.totalUsers}`}
        />
      </div>

      {/* ── Quick Actions ──────────────────────── */}
      <div className='flex flex-wrap gap-3'>
        <button
          type='button'
          className='btn-primary inline-flex items-center gap-2 text-sm'
          onClick={() => navigate('/admin/reservations?action=new')}
        >
          <IconPlus className='w-4 h-4' /> New Reservation
        </button>
        <button type='button' className='btn-secondary inline-flex items-center gap-2 text-sm' onClick={() => navigate('/admin/dishes?action=new')}>
          <IconPlus className='w-4 h-4' /> New Dish
        </button>
        <button type='button' className='btn-ghost inline-flex items-center gap-2 text-sm' onClick={() => navigate('/admin/orders')}>
          View All Orders <IconArrowRight className='w-4 h-4' />
        </button>
      </div>

      {/* ── Tables ─────────────────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Orders */}
        <div className='space-y-4'>
          <h2 className='text-base font-display font-semibold text-ob-text'>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className='card p-8 text-center text-ob-muted text-sm'>No recent orders</div>
          ) : (
            <div className='overflow-x-auto card p-0'>
              <table className='table-root'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className='cursor-pointer hover:bg-ob-blue/30 transition-colors' onClick={() => navigate('/admin/orders')}>
                      <td className='font-mono text-xs'>#{o.id}</td>
                      <td>
                        <span>{ORDER_TYPE_ICON[o.type]}</span>
                      </td>
                      <td className='text-xs text-ob-muted truncate max-w-120px'>{o.items.map(i => i.dish.name).join(', ') || '—'}</td>
                      <td className='font-mono text-xs font-semibold text-ob-caramel'>{formatPrice(o.total)}</td>
                      <td>
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td>
                        <PaymentStatusBadge status={o.paymentStatus} type={o.payments?.[0]?.type} />
                      </td>
                      <td className='text-xs text-ob-muted whitespace-nowrap'>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Today's Reservations */}
        <div className='space-y-4'>
          <h2 className='text-base font-display font-semibold text-ob-text'>Today's Reservations</h2>
          {todaysReservations.length === 0 ? (
            <div className='card p-8 text-center text-ob-muted text-sm'>No reservations today</div>
          ) : (
            <div className='overflow-x-auto card p-0'>
              <table className='table-root'>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Pre-orders</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysReservations.map(r => (
                    <tr key={r.id}>
                      <td className='text-sm whitespace-nowrap'>{formatDate(r.date)}</td>
                      <td>{r.guests}</td>
                      <td>
                        {r.table ? (
                          <span className='text-sm'>
                            #{r.table.number} — {r.table.location?.name}
                          </span>
                        ) : (
                          <span className='text-sm italic text-ob-muted'>No table assigned</span>
                        )}
                      </td>
                      <td>
                        <ReservationStatusBadge status={r.status} />
                      </td>
                      <td className='text-xs text-ob-muted'>{r.preOrders.length > 0 ? `${r.preOrders.length} items` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── StatCard sub-component ────────────────────
function StatCard({
  icon,
  label,
  primary,
  secondary,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
  accent?: boolean;
}) {
  return (
    <div className={cn('card p-5 space-y-2', accent && 'border-ob-error/30 bg-ob-error/5')}>
      <div className='flex items-center gap-2'>
        {icon}
        <span className='text-xs font-medium text-ob-muted uppercase tracking-wider'>{label}</span>
      </div>
      <div className='font-display text-2xl font-bold text-ob-text'>{primary}</div>
      <p className='text-xs text-ob-muted'>{secondary}</p>
    </div>
  );
}
