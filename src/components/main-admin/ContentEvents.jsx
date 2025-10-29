import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/main-admin/mainContent.css';
import ErrorState from '../others/ErrorState';
import EmptyState from '../others/EmptyState';
import { 
    getAdminEvents, 
    filterEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    uploadEventImage,
    formatDateForInput 
} from '../../helpers/eventsFunctions';
import { handleFormInputChange, resetForm } from '../../helpers/formHelpers';
import { calculatePageRange, canGoPrevious, canGoNext } from '../../helpers/paginationHelpers';
import { EVENTS_PER_PAGE, INITIAL_EVENT_FORM, MESSAGES } from '../../helpers/constants';
import { useImageUpload } from '../../hooks/useImageUpload';

function ContentEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editFormData, setEditFormData] = useState(INITIAL_EVENT_FORM);
    const [createFormData, setCreateFormData] = useState(INITIAL_EVENT_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const createImageUpload = useImageUpload();
    const editImageUpload = useImageUpload();

    useEffect(() => {
        loadEvents();
    }, [currentPage]);

    const loadEvents = async () => {
        try {
            const offset = (currentPage - 1) * EVENTS_PER_PAGE;
            const data = await getAdminEvents(EVENTS_PER_PAGE, offset);
            setEvents(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredEvents = filterEvents(events, searchTerm);

    const handleEditClick = (event) => {
        setSelectedEvent(event);
        setEditFormData({
            name: event.name || '',
            description: event.description || '',
            location: event.location || '',
            date: formatDateForInput(event.date),
            url_passline: event.url_passline || '',
            url_image: event.url_image_event || ''
        });
        editImageUpload.resetImage();
        setShowEditModal(true);
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleCreateClick = () => {
        resetForm(INITIAL_EVENT_FORM, setCreateFormData);
        createImageUpload.resetImage();
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        createImageUpload.resetImage();
        resetForm(INITIAL_EVENT_FORM, setCreateFormData);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createEvent(createFormData);
            setShowCreateModal(false);
            setCurrentPage(1);
            loadEvents();
            createImageUpload.resetImage();
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateEvent(selectedEvent.id, editFormData);
            setShowEditModal(false);
            loadEvents();
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setIsSubmitting(true);
        try {
            await deleteEvent(selectedEvent.id);
            setShowDeleteModal(false);
            loadEvents();
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => handleFormInputChange(e, setEditFormData);
    const handleCreateInputChange = (e) => handleFormInputChange(e, setCreateFormData);

    const handleUploadImage = async () => {
        if (!createImageUpload.selectedFile) return;

        createImageUpload.setUploading(true);
        try {
            const data = await uploadEventImage(createImageUpload.selectedFile);
            setCreateFormData(prev => ({ ...prev, url_image: data.url }));
            alert('Imagen subida exitosamente');
        } catch (err) {
            alert(err.message || 'Error al subir la imagen');
        } finally {
            createImageUpload.setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        createImageUpload.resetImage();
        setCreateFormData(prev => ({ ...prev, url_image: '' }));
    };

    const handleUploadEditImage = async () => {
        if (!editImageUpload.selectedFile) {
            alert('Por favor selecciona una imagen');
            return;
        }

        editImageUpload.setUploading(true);
        try {
            const data = await uploadEventImage(editImageUpload.selectedFile);
            setEditFormData(prev => ({ ...prev, url_image: data.url }));
            alert('Imagen subida exitosamente');
        } catch (err) {
            alert(err.message || 'Error al subir la imagen');
        } finally {
            editImageUpload.setUploading(false);
        }
    };

    const handleRemoveEditImage = () => {
        editImageUpload.resetImage();
        setEditFormData(prev => ({ ...prev, url_image: '' }));
    };

    const handlePreviousPage = () => {
        if (canGoPrevious(currentPage)) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (canGoNext(filteredEvents.length, EVENTS_PER_PAGE)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const { start: beginEvents, end: beginEventsFinal } = calculatePageRange(
        currentPage,
        EVENTS_PER_PAGE,
        filteredEvents.length
    );

    if (error) {
        return <ErrorState title={MESSAGES.ERROR_LOADING_EVENTS} message={error} onRetry={loadEvents} />;
    }

    return (
        <div className='admin-users-container'>
            <div className='admin-users-first-row'>
                <span className='admin-users-title-section'>Administrar Eventos</span>
                <button 
                    className='admin-users-btn-create' 
                    onClick={handleCreateClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Nuevo Evento
                </button>
            </div>
            <div className='admin-users-second-row'>
                <span className='admin-users-title-second-row'>Lista de eventos</span>
                <div className='admin-users-searcher'>
                    <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1000 1000"><path fill="#000000" d="m746 641l254 255l-105 105l-254-254q-106 72-232 72q-169 0-289-120T0 410t120-289T409 1t289 120t120 289q0 127-72 231zm-65-231q0-113-79.5-193T409 137t-193 80t-80 193t80 192.5T409 682t192.5-79.5T681 410z"/></svg>
                    <input 
                        type="text" 
                        className='admin-users-input-search' 
                        placeholder='Buscar eventos...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className='admin-users-table-container'>
                <div className='admin-users-table-wrapper'>
                    <table className='admin-users-table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Ubicación</th>
                                <th>URL</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.id}</td>
                                    <td className='admin-users-name'>{event.name || 'No especificado'}</td>
                                    <td className='admin-users-email'>{event.description || 'No especificado'}</td>
                                    <td>{event.location || 'No especificado'}</td>
                                    <td>
                                        {event.url_passline ? (
                                            <a href={event.url_passline} target="_blank" rel="noopener noreferrer" className='admin-users-badge admin-users-badge-user'>
                                                Ver enlace
                                            </a>
                                        ) : (
                                            'No especificado'
                                        )}
                                    </td>
                                    <td>
                                        {event.url_image_event ? (
                                            <img 
                                                src={event.url_image_event} 
                                                alt={event.name} 
                                                className="admin-event-thumbnail"
                                            />
                                        ) : (
                                            'Sin imagen'
                                        )}
                                    </td>
                                    <td className='admin-users-actions'>
                                        <button 
                                            className='admin-users-btn-action admin-users-btn-edit' 
                                            title='Editar' 
                                            onClick={() => handleEditClick(event)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
                                        </button>
                                        <button 
                                            className='admin-users-btn-action admin-users-btn-delete' 
                                            title='Eliminar' 
                                            onClick={() => handleDeleteClick(event)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEvents.length === 0 && (
                        <EmptyState 
                            icon="calendar"
                            title={MESSAGES.NO_EVENTS_FOUND}
                            message="Crea un nuevo evento usando el botón superior."
                        />
                    )}
                </div>
                <div className='admin-users-pagination'>
                    <div className='admin-users-info'>
                        <span>Eventos por página: </span><span>{EVENTS_PER_PAGE}</span>
                    </div>
                    <div className='admin-users-page-buttons'>
                        <span className='admin-users-page-number'>Pagina: {currentPage}</span>
                        <span className='admin-users-space-users'>Mostrando: {filteredEvents.length > 0 ? beginEvents : 0}-{beginEventsFinal}</span>
                        <button 
                            className={`admin-users-btn-page ${!canGoPrevious(currentPage) ? 'admin-users-disabled' : ''}`}
                            onClick={handlePreviousPage}
                            disabled={!canGoPrevious(currentPage)}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="#000000" strokeWidth="2" d="M17 2L7 12l10 10"/></svg>
                        </button>
                        <button 
                            className={`admin-users-btn-page ${!canGoNext(filteredEvents.length, EVENTS_PER_PAGE) ? 'admin-users-disabled' : ''}`}
                            onClick={handleNextPage}
                            disabled={!canGoNext(filteredEvents.length, EVENTS_PER_PAGE)}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42"><path fill="#000000" fillRule="evenodd" d="M13.933 1L34 21.068L14.431 40.637l-4.933-4.933l14.638-14.636L9 5.933z"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmitting && setShowEditModal(false)}>
                    <div className='admin-users-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Modificar Evento</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={() => setShowEditModal(false)}
                                disabled={isSubmitting}
                            >
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
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='description'>Descripción</label>
                                <textarea 
                                    id='description'
                                    name='description'
                                    value={editFormData.description}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='location'>Ubicación</label>
                                <input 
                                    type='text' 
                                    id='location'
                                    name='location'
                                    value={editFormData.location}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='date'>Fecha</label>
                                <input 
                                    type='datetime-local' 
                                    id='date'
                                    name='date'
                                    value={editFormData.date}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='url_passline'>URL Passline</label>
                                <input 
                                    type='url' 
                                    id='url_passline'
                                    name='url_passline'
                                    value={editFormData.url_passline}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    placeholder='https://ejemplo.com'
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label>Imagen del Evento</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {editFormData.url_image && !editImageUpload.imagePreview && (
                                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                                            <img 
                                                src={editFormData.url_image} 
                                                alt="Imagen actual" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={handleRemoveEditImage}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    
                                    {editImageUpload.imagePreview && (
                                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                                            <img 
                                                src={editImageUpload.imagePreview} 
                                                alt="Preview" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={handleRemoveEditImage}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    
                                    {!editFormData.url_image && !editImageUpload.imagePreview && (
                                        <div>
                                            <input 
                                                type='file' 
                                                id='edit-image'
                                                accept='image/jpeg,image/jpg,image/webp'
                                                onChange={editImageUpload.handleFileSelect}
                                                disabled={isSubmitting || editImageUpload.uploading}
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                                                Formatos permitidos: JPG, JPEG, WEBP (máx. 5MB)
                                            </p>
                                        </div>
                                    )}
                                    
                                    {(editFormData.url_image || editImageUpload.imagePreview) && !editImageUpload.selectedFile && (
                                        <div>
                                            <input 
                                                type='file' 
                                                id='edit-image-replace'
                                                accept='image/jpeg,image/jpg,image/webp'
                                                onChange={editImageUpload.handleFileSelect}
                                                disabled={isSubmitting || editImageUpload.uploading}
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                                                Selecciona una nueva imagen para reemplazar la actual
                                            </p>
                                        </div>
                                    )}
                                    
                                    {editImageUpload.selectedFile && (
                                        <button
                                            type='button'
                                            onClick={handleUploadEditImage}
                                            disabled={editImageUpload.uploading}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: editImageUpload.uploading ? 'not-allowed' : 'pointer',
                                                opacity: editImageUpload.uploading ? 0.6 : 1
                                            }}
                                        >
                                            {editImageUpload.uploading ? 'Subiendo...' : 'Subir Nueva Imagen'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='url_image'>O ingresa URL de Imagen</label>
                                <input 
                                    type='url' 
                                    id='url_image'
                                    name='url_image'
                                    value={editFormData.url_image}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting || !!editImageUpload.selectedFile}
                                    placeholder='https://ejemplo.com/imagen.jpg'
                                />
                            </div>
                            <div className='admin-users-modal-actions'>
                                <button 
                                    type='button' 
                                    className='admin-users-btn-cancel' 
                                    onClick={() => setShowEditModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type='submit' 
                                    className='admin-users-btn-save'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showCreateModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmitting && handleCloseCreateModal()}>
                    <div className='admin-users-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Crear Nuevo Evento</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={handleCloseCreateModal}
                                disabled={isSubmitting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <form className='admin-users-modal-form' onSubmit={handleCreateSubmit}>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-name'>Nombre *</label>
                                <input 
                                    type='text' 
                                    id='create-name'
                                    name='name'
                                    value={createFormData.name}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-description'>Descripción *</label>
                                <textarea 
                                    id='create-description'
                                    name='description'
                                    value={createFormData.description}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-location'>Ubicación *</label>
                                <input 
                                    type='text' 
                                    id='create-location'
                                    name='location'
                                    value={createFormData.location}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-date'>Fecha *</label>
                                <input 
                                    type='datetime-local' 
                                    id='create-date'
                                    name='date'
                                    value={createFormData.date}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-url_passline'>URL Passline</label>
                                <input 
                                    type='url' 
                                    id='create-url_passline'
                                    name='url_passline'
                                    value={createFormData.url_passline}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting}
                                    placeholder='https://ejemplo.com'
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label>Imagen del Evento</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {createImageUpload.imagePreview ? (
                                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                                            <img 
                                                src={createImageUpload.imagePreview} 
                                                alt="Preview" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={handleRemoveImage}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <input 
                                                type='file' 
                                                id='create-image'
                                                accept='image/jpeg,image/jpg,image/webp'
                                                onChange={createImageUpload.handleFileSelect}
                                                disabled={isSubmitting || createImageUpload.uploading}
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                                                Formatos permitidos: JPG, JPEG, WEBP (máx. 5MB)
                                            </p>
                                        </div>
                                    )}
                                    {createImageUpload.selectedFile && !createFormData.url_image && (
                                        <button
                                            type='button'
                                            onClick={handleUploadImage}
                                            disabled={createImageUpload.uploading}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: createImageUpload.uploading ? 'not-allowed' : 'pointer',
                                                opacity: createImageUpload.uploading ? 0.6 : 1
                                            }}
                                        >
                                            {createImageUpload.uploading ? 'Subiendo...' : 'Subir Imagen'}
                                        </button>
                                    )}
                                    {createFormData.url_image && (
                                        <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600', margin: 0 }}>
                                            ✓ Imagen subida correctamente
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-url_image'>O ingresa URL de Imagen</label>
                                <input 
                                    type='url' 
                                    id='create-url_image'
                                    name='url_image'
                                    value={createFormData.url_image}
                                    onChange={handleCreateInputChange}
                                    disabled={isSubmitting || !!createImageUpload.selectedFile}
                                    placeholder='https://ejemplo.com/imagen.jpg'
                                />
                            </div>
                            <div className='admin-users-modal-actions'>
                                <button 
                                    type='button' 
                                    className='admin-users-btn-cancel' 
                                    onClick={handleCloseCreateModal}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type='submit' 
                                    className='admin-users-btn-save'
                                    disabled={isSubmitting}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)'
                                    }}
                                >
                                    {isSubmitting ? 'Creando...' : 'Crear Evento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showDeleteModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmitting && setShowDeleteModal(false)}>
                    <div className='admin-users-modal-content admin-users-modal-ban' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Eliminar Evento</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isSubmitting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <div className='admin-users-modal-body'>
                            <div className='admin-users-warning-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                            <p>{MESSAGES.CONFIRM_DELETE_EVENT} <strong>{selectedEvent?.name}</strong>?</p>
                            <p className='admin-users-warning-text'>{MESSAGES.DELETE_WARNING}</p>
                        </div>
                        <div className='admin-users-modal-actions'>
                            <button 
                                type='button' 
                                className='admin-users-btn-cancel' 
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                type='button' 
                                className='admin-users-btn-delete-confirm'
                                onClick={handleDeleteConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default ContentEvents;