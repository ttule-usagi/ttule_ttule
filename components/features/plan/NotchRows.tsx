interface NotchDotsProps {
  count?: number;
}

export default function NotchRows({ count = 10 }: NotchDotsProps) {
  return (
    <>
      <div className='notch-row notch-row--top'>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={`top-${i}`}
            className='notch-dot'
          />
        ))}
      </div>
      <div className='notch-row notch-row--bottom'>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={`bottom-${i}`}
            className='notch-dot'
          />
        ))}
      </div>
    </>
  );
}
