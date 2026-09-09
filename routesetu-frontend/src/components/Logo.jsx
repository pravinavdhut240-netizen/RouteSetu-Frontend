import logo from '../assets/logo.svg';

export default function Logo({ dark = false }) {
  return <div className={`brand ${dark ? 'brand-dark' : ''}`}><img src={logo} alt="" /><span>RouteSetu</span></div>;
}
