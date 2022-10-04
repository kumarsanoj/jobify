import Wrapper from "../assets/wrappers/BigSidebar";
import { FaTimes } from 'react-icons/fa'
import { useAppContext } from '../context/appContext'
import Logo from './Logo'
import NavLinks from './NavLinks'

const BigSidebar = () => {
    const { showSidebar} = useAppContext();
    return (
        <Wrapper>
        <div className={showSidebar? 'sidebar-container show-sidebar': 'sidebar-container'}>
          <div className='content'>

            <header>
              <Logo />
            </header>
            <NavLinks type="bigSideBar"/>
          </div>
        </div>
      </Wrapper>)
}

export default BigSidebar;