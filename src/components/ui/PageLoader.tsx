export const PageLoader = () => (
  <div className='page-loader'>
    <div className='flex flex-col items-center gap-4'>
      {/* Warm spinning ring */}
      <div
        className='w-10 h-10 rounded-full border-2 animate-spin'
        style={{
          borderColor: 'var(--color-ob-border)',
          borderTopColor: 'var(--color-ob-caramel)',
        }}
      />
      <span className='text-sm font-medium font-display italic' style={{ color: 'var(--color-ob-text-muted)' }}>
        Loading…
      </span>
    </div>
  </div>
);
