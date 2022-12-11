import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  return (
    <div className="container">
      <h1>Oh uh, looks like the page could not be found!</h1>
      <p>
        Click <Link to={'/'}>here</Link> to go to the homepage
      </p>
    </div>
  );
};
