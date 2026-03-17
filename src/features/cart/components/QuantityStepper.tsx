interface QuantityStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementLabel?: string;
  incrementLabel?: string;
}

/**
 * Reusable +/- stepper.
 * Uses the global `.qty-stepper`, `.qty-btn`, `.qty-value` CSS utility classes.
 * Caller decides what decrement at qty=1 means (remove vs set to 0).
 */
export function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
  decrementLabel = 'Decrease quantity',
  incrementLabel = 'Increase quantity',
}: QuantityStepperProps) {
  return (
    <div className='qty-stepper'>
      <button className='qty-btn' onClick={onDecrement} aria-label={decrementLabel}>
        -
      </button>
      <span className='qty-value'>{quantity}</span>
      <button className='qty-btn' onClick={onIncrement} aria-label={incrementLabel}>
        +
      </button>
    </div>
  );
}
