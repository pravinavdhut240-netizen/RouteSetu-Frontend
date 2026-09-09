import { useRef } from 'react';

export default function OtpInput() {
  const refs = useRef([]);
  return <div className="otp-row">{[0, 1, 2, 3, 4, 5].map((item) => <input key={item} ref={(el) => { refs.current[item] = el; }} inputMode="numeric" maxLength="1" aria-label={`OTP digit ${item + 1}`} onChange={(e) => { if (e.target.value && item < 5) refs.current[item + 1]?.focus(); }} onKeyDown={(e) => { if (e.key === 'Backspace' && !e.currentTarget.value && item > 0) refs.current[item - 1]?.focus(); }} />)}</div>;
}
