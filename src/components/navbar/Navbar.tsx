import { NavLink } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav id="navbar" className="flex">
      <div className="flex">
        <div className="__navbar-logo">LOGO</div>
        <div className="flex link-wrapper">
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/component/123'}>View Component</NavLink>
        </div>
      </div>
      <div>MENU</div>
    </nav>
  );
};
