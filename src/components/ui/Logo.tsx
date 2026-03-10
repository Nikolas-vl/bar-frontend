// import logoImg from '../../assets/images/logo.jpg';
import logoMainImg from '../../assets/icons/Jolie-Brasserie-Cafe-main-logo.jpg';

interface LogoProps {
  /** Controls the circular logo image size */
  size?: 'sm' | 'md' | 'lg';
  /** Show the text lockup beside the logo */
  showText?: boolean;
  /** Extra classes on the wrapper */
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
} as const;

const textSizes = {
  sm: { name: 'text-base', sub: 'text-[8px]' },
  md: { name: 'text-xl', sub: 'text-[10px]' },
  lg: { name: 'text-2xl', sub: 'text-[11px]' },
} as const;

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Circular logo image */}
      <img
        src={logoMainImg}
        alt='Jolie Brasserie Café logo'
        className={`${sizes[size]} rounded-full object-cover shrink-0`}
        style={{ border: '1.5px solid var(--color-ob-blue-deep)' }}
      />

      {/* Text lockup */}
      {showText && (
        <div className='flex flex-col leading-none'>
          <span className={`text-gradient font-display font-semibold ${textSizes[size].name}`}>Jolie</span>
          <span className={`font-medium tracking-[0.18em] uppercase ${textSizes[size].sub}`} style={{ color: 'var(--color-ob-muted)' }}>
            Brasserie Café
          </span>
        </div>
      )}
    </div>
  );
};
