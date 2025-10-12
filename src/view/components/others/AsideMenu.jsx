import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/oauth/AuthContext';
import '../../../styles/others/asideMenu.css';

function AsideMenu() {
    const [activeItem, setActiveItem] = useState('dashboard');
    const { userData } = useContext(AuthContext);
    
    const name = userData?.name || 'Usuario';
    const nameSplit = name.split(" ");
    const words = nameSplit.length > 1 
        ? nameSplit[0].split("")[0] + nameSplit[1].split("")[0]
        : nameSplit[0].split("")[0] + (nameSplit[0].split("")[1] || '');
    const word = words.toUpperCase();
    
    const svgIcons = [
        (<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 432 384"><path fill="#000000" d="M171 363H64V192H0L213 0l214 192h-64v171H256V235h-85v128z"/></svg>),
        (<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 256 256"><path fill="#000000" d="m213.93 213.94l-17.65 4.73l-10.42-38.89a40.06 40.06 0 0 0 20.77-46.14c-12.6-47-38.78-88.22-39.89-89.95a8 8 0 0 0-8.68-3.45l-21.86 5.47c0-8.25-.18-13.43-.21-14.08a8 8 0 0 0-6.05-7.39l-32-8a8 8 0 0 0-8.68 3.45c-1.11 1.73-27.29 42.93-39.89 90a40.06 40.06 0 0 0 20.77 46.14l-10.42 38.84l-17.65-4.73a8 8 0 0 0-4.14 15.46l48 12.86a8.23 8.23 0 0 0 2.07.27a8 8 0 0 0 2.07-15.73l-14.9-4l10.42-38.89c.81.05 1.61.08 2.41.08a40.12 40.12 0 0 0 37-24.88c1.18 6.37 2.6 12.82 4.31 19.22A40.08 40.08 0 0 0 168 184c.8 0 1.6 0 2.41-.08l10.42 38.89l-14.9 4a8 8 0 0 0 2.07 15.72a8.23 8.23 0 0 0 2.07-.27l48-12.86a8 8 0 0 0-4.14-15.46M156.22 57.19c2.78 4.7 7.23 12.54 12.2 22.46L136 87.77c-.42-10-.38-18.25-.25-23.79c0-.56.05-1.12.08-1.68Zm-56.44-24l20.37 5.09c.06 4.28 0 10.67-.21 18.47c-.06 1.21-.16 3.19-.23 5.84c0 1-.1 2-.16 3l-32.86-8.16C92 46.67 96.84 38.16 99.78 33.19m85.06 10.39a8 8 0 0 1 3.58-10.74l16-8a8 8 0 1 1 7.16 14.32l-16 8a8 8 0 0 1-10.74-3.58M232 72a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8M32.84 20.42a8 8 0 0 1 10.74-3.58l16 8a8 8 0 0 1-7.16 14.32l-16-8a8 8 0 0 1-3.58-10.74M40 72H24a8 8 0 0 1 0-16h16a8 8 0 0 1 0 16"/></svg>),
        (<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M21 5H3a1 1 0 0 0-1 1v4h.893c.996 0 1.92.681 2.08 1.664A2.001 2.001 0 0 1 3 14H2v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4h-1a2.001 2.001 0 0 1-1.973-2.336c.16-.983 1.084-1.664 2.08-1.664H22V6a1 1 0 0 0-1-1zM11 17H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2z"/></svg>),
        (<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M7 17h2v-5H7v5Zm8 0h2V7h-2v10Zm-4 0h2v-3h-2v3Zm0-5h2v-2h-2v2Zm-6 9q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"/></svg>)
    ];

    const menuItems = [
        { id: 'dashboard', label: 'Inicio', icon: svgIcons[0] },
        { id: 'products', label: 'Eventos', icon: svgIcons[1] },
        { id: 'beneficios', label: 'Beneficios', icon: svgIcons[2] },
        { id: 'analytics', label: 'Estadísticas', icon: svgIcons[3] },
    ];

    return (
        <aside className="admin-menu">
            <nav className="menu-nav">
                <div className="menu-section">Menú Principal</div>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={activeItem === item.id ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveItem(item.id);
                                }}
                            >
                                <span className="icon">{item.icon}</span>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                
                <div className="menu-divider"></div>
            </nav>
            
            <div className="user-profile">
                <div className='profile-avatar'>
                    <span className='profile-initials'>{word}</span>
                </div>
                <p className='profile-name'>{name}</p>
            </div>
        </aside>
    );
}

export default AsideMenu;