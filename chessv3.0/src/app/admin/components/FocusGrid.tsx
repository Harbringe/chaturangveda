'use client';

export type FocusPosition =
  | 'top left' | 'top center' | 'top right'
  | 'center left' | 'center center' | 'center right'
  | 'bottom left' | 'bottom center' | 'bottom right';

const POSITIONS: { label: string; value: FocusPosition }[] = [
  { label: 'TL', value: 'top left' },    { label: 'TC', value: 'top center' },    { label: 'TR', value: 'top right' },
  { label: 'ML', value: 'center left' }, { label: 'MC', value: 'center center' }, { label: 'MR', value: 'center right' },
  { label: 'BL', value: 'bottom left' }, { label: 'BC', value: 'bottom center' }, { label: 'BR', value: 'bottom right' },
];

interface Props {
  value: FocusPosition;
  onChange: (pos: FocusPosition) => void;
}

export default function FocusGrid({ value, onChange }: Props) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
        Image focus
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 34px)', gap: '3px' }}>
        {POSITIONS.map((pos) => (
          <button
            key={pos.value}
            type="button"
            onClick={() => onChange(pos.value)}
            style={{
              height: 34,
              borderRadius: 4,
              border: '1px solid',
              fontSize: '0.6rem',
              cursor: 'pointer',
              fontWeight: 500,
              background: value === pos.value ? '#004D99' : '#fff',
              color: value === pos.value ? '#fff' : '#718096',
              borderColor: value === pos.value ? '#004D99' : '#e2e8f0',
            }}
          >
            {pos.label}
          </button>
        ))}
      </div>
    </div>
  );
}
