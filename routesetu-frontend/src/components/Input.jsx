export default function Input({ label, error, ...props }) {
  return <label className="field"><span>{label}{props.required && <b>*</b>}</span><input {...props} />{error && <small className="error">{error}</small>}</label>;
}
