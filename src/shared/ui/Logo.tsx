import logoMainImg from '@/shared/assets/images/main-logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
} as const;

const imageSize = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

const textSizes = {
  sm: { name: 'text-base', sub: 'text-[8px]' },
  md: { name: 'text-xl', sub: 'text-[10px]' },
  lg: { name: 'text-2xl', sub: 'text-[11px]' },
} as const;

export const Logo = ({ size = 'md', showText = true, className = '', priority = false }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoMainImg}
        alt='Jolie Brasserie Café logo'
        width={imageSize[size]}
        height={imageSize[size]}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy='no-referrer'
        className={`${sizes[size]} rounded-full object-cover shrink-0 border-[1.5px] border-ob-blue-deep`}
      />

      {showText && (
        <div className='flex flex-col leading-none'>
          <span className={`text-gradient font-display font-semibold ${textSizes[size].name}`}>Jolie</span>
          <span className={`font-medium tracking-[0.18em] uppercase text-ob-muted ${textSizes[size].sub}`}>Brasserie Café</span>
        </div>
      )}
    </div>
  );
};
