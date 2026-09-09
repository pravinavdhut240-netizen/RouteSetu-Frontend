import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

export default function PasswordInput({ label = 'Password', ...props }) {
  const [visible, setVisible] = useState(false);
  return <label className="field password-field"><span>{label}{props.required && <b>*</b>}</span><div className="input-wrap"><LockKeyhole size={15} /><input {...props} type={visible ? 'text' : 'password'} /><button type="button" aria-label="Toggle password visibility" onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>;
}
