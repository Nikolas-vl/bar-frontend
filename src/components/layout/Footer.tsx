export const Footer = () => (
  <footer
    className='mt-16'
    style={{
      borderTop: '1px solid var(--color-ob-border)',
      backgroundColor: 'var(--color-ob-surface)',
    }}
  >
    <div className='page-container py-8'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <span className='text-gradient font-display text-lg font-semibold'>Jolie Brasserie Café</span>
        <p className='text-sm' style={{ color: 'var(--color-ob-text-muted)' }}>
          © {new Date().getFullYear()} Jolie Brasserie Café · All rights reserved
        </p>
      </div>
    </div>
  </footer>
);
