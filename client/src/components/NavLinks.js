

import links from '../utils/links'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/appContext';

const NavLinks = ({type} ) => {
    const { toggleSidebar} = useAppContext();
    return (
        <div className='nav-links'>
                {links.map(({ id, text, path, icon}) => {
                    return (
                    <NavLink 
                        key={id}
                        id={id} 
                        to={path}
                        onClick={type !== 'bigSideBar'? toggleSidebar : () => {}}
                        className={( { isActive } ) => isActive ? 'nav-link active': 'nav-link'}
                    >
                        <span className='icon'>{icon}</span>
                        {text}
                    </NavLink>)
                })}
            </div>
    )
}
export default NavLinks;