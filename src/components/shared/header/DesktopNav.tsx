import { NavItem } from '../navigation/NavItem';
import { useAuthStore } from '../../../store/auth.store';

export function DesktopNav() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const role = useAuthStore(s => s.user?.role);

  return (
    <nav className='hidden md:flex items-center gap-7'>
      <NavItem to='/menu' className='nav-link' activeClassName='nav-link-active'>
        Menu
      </NavItem>

      {isAuthenticated && (
        <>
          <NavItem to='/orders' className='nav-link' activeClassName='nav-link-active'>
            My Orders
          </NavItem>

          <NavItem to='/reservations' className='nav-link' activeClassName='nav-link-active'>
            Reservations
          </NavItem>
        </>
      )}

      {role === 'ADMIN' && (
        <NavItem to='/admin' className='nav-link' activeClassName='nav-link-active'>
          Admin
        </NavItem>
      )}
    </nav>
  );
}
