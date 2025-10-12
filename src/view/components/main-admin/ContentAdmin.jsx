import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../../styles/main-admin/mainContent.css';

function ContentMain() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        role: '',
        city: '',
        province: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const offset = (currentPage - 1) * usersPerPage;
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/user?limit=${usersPerPage}&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const data = await response.json();
            if (data.ok) {
                setUsers(data.data);
            } else {
                throw new Error(data.message || 'Error al obtener usuarios');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.city?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || '',
            city: user.city || '',
            province: user.province || ''
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log('Modificando usuario:', selectedUser.id, editFormData);
        setShowEditModal(false);
    };

    const handleDeleteConfirm = () => {
        console.log('Baneando usuario:', selectedUser.id);
        setShowDeleteModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (filteredUsers.length === usersPerPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const beginUsers = ((currentPage - 1) * usersPerPage) + 1;
    const beginUsersFinal = Math.min(currentPage * usersPerPage, beginUsers + filteredUsers.length - 1);

    if (loading && users.length === 0) {
        return (
            <div className='admin-users-loading-container'>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='admin-users-error-container'>
                <p>Error: {error}</p>
                <button onClick={fetchUsers}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className='admin-users-container'>
            <div className='admin-users-first-row'>
                <span className='admin-users-title-section'>Administrar Usuarios</span>
            </div>
            <div className='admin-users-second-row'>
                <span className='admin-users-title-second-row'>Lista de usuarios</span>
                <div className='admin-users-searcher'>
                    <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1000 1000"><path fill="#000000" d="m746 641l254 255l-105 105l-254-254q-106 72-232 72q-169 0-289-120T0 410t120-289T409 1t289 120t120 289q0 127-72 231zm-65-231q0-113-79.5-193T409 137t-193 80t-80 193t80 192.5T409 682t192.5-79.5T681 410z"/></svg>
                    <input 
                        type="text" 
                        className='admin-users-input-search' 
                        placeholder='Buscar usuarios...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className='admin-users-table-container'>
                <table className='admin-users-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Ciudad</th>
                            <th>Provincia</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td className='admin-users-name'>{user.name || 'No especificado'}</td>
                                <td className='admin-users-email'>{user.email || 'No especificado'}</td>
                                <td>
                                    <span className={`admin-users-badge admin-users-badge-${(user.role || 'user').toLowerCase()}`}>
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td>{user.city || 'No especificado'}</td>
                                <td>{user.province || 'No especificado'}</td>
                                <td className='admin-users-actions'>
                                    <button className='admin-users-btn-action admin-users-btn-edit' title='Editar' onClick={() => handleEditClick(user)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
                                    </button>
                                    <button className='admin-users-btn-action admin-users-btn-delete' title='Eliminar' onClick={() => handleDeleteClick(user)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7zM17 6H7v13h10V6zM9 17h2V8H9v9zm4 0h2V8h-2v9z"/></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className='admin-users-no-results'>
                        <p>No se encontraron usuarios</p>
                    </div>
                )}
                <div className='admin-users-pagination'>
                    <div className='admin-users-info'>
                        <span>Usuarios por página: </span><span>{usersPerPage}</span>
                    </div>
                    <div className='admin-users-page-buttons'>
                        <span className='admin-users-page-number'>Pagina: {currentPage}</span>
                        <span className='admin-users-space-users'>Mostrando: {filteredUsers.length > 0 ? beginUsers : 0}-{beginUsersFinal}</span>
                        <button 
                            className={`admin-users-btn-page ${currentPage === 1 ? 'admin-users-disabled' : ''}`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="#000000" strokeWidth="2" d="M17 2L7 12l10 10"/></svg>
                        </button>
                        <button 
                            className={`admin-users-btn-page ${filteredUsers.length < usersPerPage ? 'admin-users-disabled' : ''}`}
                            onClick={handleNextPage}
                            disabled={filteredUsers.length < usersPerPage}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42"><path fill="#000000" fillRule="evenodd" d="M13.933 1L34 21.068L14.431 40.637l-4.933-4.933l14.638-14.636L9 5.933z"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => setShowEditModal(false)}>
                    <div className='admin-users-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Modificar Usuario</h2>
                            <button className='admin-users-modal-close' onClick={() => setShowEditModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <form className='admin-users-modal-form' onSubmit={handleEditSubmit}>
                            <div className='admin-users-form-group'>
                                <label htmlFor='name'>Nombre</label>
                                <input 
                                    type='text' 
                                    id='name'
                                    name='name'
                                    value={editFormData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='email'>Email</label>
                                <input 
                                    type='email' 
                                    id='email'
                                    name='email'
                                    value={editFormData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='role'>Rol</label>
                                <select 
                                    id='role'
                                    name='role'
                                    value={editFormData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value='user'>Usuario</option>
                                    <option value='influencer'>Influencer</option>
                                    <option value='admin'>Admin</option>
                                </select>
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='city'>Ciudad</label>
                                <input 
                                    type='text' 
                                    id='city'
                                    name='city'
                                    value={editFormData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='province'>Provincia</label>
                                <input 
                                    type='text' 
                                    id='province'
                                    name='province'
                                    value={editFormData.province}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='admin-users-modal-actions'>
                                <button type='button' className='admin-users-btn-cancel' onClick={() => setShowEditModal(false)}>
                                    Cancelar
                                </button>
                                <button type='submit' className='admin-users-btn-save'>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showDeleteModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => setShowDeleteModal(false)}>
                    <div className='admin-users-modal-content admin-users-modal-delete' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Banear Usuario</h2>
                            <button className='admin-users-modal-close' onClick={() => setShowDeleteModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <div className='admin-users-modal-body'>
                            <div className='admin-users-warning-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                            <p className='admin-users-delete-message'>
                                ¿Estás seguro que deseas banear al usuario <strong>{selectedUser?.name}</strong>?
                            </p>
                            <p className='admin-users-delete-warning'>
                                Esta acción impedirá que el usuario acceda al sistema.
                            </p>
                        </div>
                        <div className='admin-users-modal-actions'>
                            <button type='button' className='admin-users-btn-cancel' onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </button>
                            <button type='button' className='admin-users-btn-delete-confirm' onClick={handleDeleteConfirm}>
                                Banear Usuario
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default ContentMain