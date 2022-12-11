import { Navbar } from '../navbar/Navbar';
import './Page.css';

type Props = {
  includeNavbar?: boolean;
} & React.PropsWithChildren;

export const Page = ({ includeNavbar = true, children }: Props) => {
  return (
    <div id="page-wrapper">
      {includeNavbar ? <Navbar /> : <></>}
      {children}
    </div>
  );
};
