import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/main-admin/mainContent.css';
import ErrorState from '../others/ErrorState';
import EmptyState from '../others/EmptyState';
import {
    getAdminBenefits,
    filterBenefits,
    createBenefit,
    updateBenefit,
    deleteBenefit
} from '../../helpers/benefitFunctions';
import {
    getAdminBusiness,
    filterBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
} from '../../helpers/businessFunctions';
import { handleFormInputChange, resetForm } from '../../helpers/formHelpers';
import { calculatePageRange, canGoPrevious, canGoNext } from '../../helpers/paginationHelpers';
import { BENEFITS_PER_PAGE, BUSINESS_PER_PAGE, INITIAL_BENEFIT_FORM, INITIAL_BUSINESS_FORM, MESSAGES } from '../../helpers/constants';

function BenefitsContent() {
    // Benefits
    const [benefits, setBenefits] = useState([]);
    const [benefitsError, setBenefitsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState(null);
    const [editFormData, setEditFormData] = useState(INITIAL_BENEFIT_FORM);
    const [createFormData, setCreateFormData] = useState(INITIAL_BENEFIT_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Businesses
    const [businesses, setBusinesses] = useState([]);
    const [businessError, setBusinessError] = useState(null);
    const [currentBusinessPage, setCurrentBusinessPage] = useState(1);
    const [businessSearchTerm, setBusinessSearchTerm] = useState('');
    const [showCreateBusinessModal, setShowCreateBusinessModal] = useState(false);
    const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
    const [showDeleteBusinessModal, setShowDeleteBusinessModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [createBusinessFormData, setCreateBusinessFormData] = useState(INITIAL_BUSINESS_FORM);
    const [editBusinessFormData, setEditBusinessFormData] = useState(INITIAL_BUSINESS_FORM);
    const [isSubmittingBusiness, setIsSubmittingBusiness] = useState(false);

    const [section, setSection] = useState('benefits');

    useEffect(() => {
        loadBenefits();
        loadBusinesses();
    }, []);

    const loadBenefits = async () => {
        try {
            const data = await getAdminBenefits();
            setBenefits(data);
        } catch (err) {
            setBenefitsError(err.message);
            console.error('Error fetching benefits:', err);
        }
    };

    const loadBusinesses = async () => {
        try {
            const data = await getAdminBusiness();
            setBusinesses(data);
        } catch (err) {
            setBusinessError(err.message);
            console.error('Error fetching businesses:', err);
        }
    };

    const filteredBenefits = filterBenefits(benefits, searchTerm);
    const filteredBusinesses = filterBusiness(businesses, businessSearchTerm);

    // Paginated data
    const paginatedBenefits = filteredBenefits.slice(
        (currentPage - 1) * BENEFITS_PER_PAGE,
        currentPage * BENEFITS_PER_PAGE
    );
    const paginatedBusinesses = filteredBusinesses.slice(
        (currentBusinessPage - 1) * BUSINESS_PER_PAGE,
        currentBusinessPage * BUSINESS_PER_PAGE
    );

    const handleEditClick = (benefit) => {
        setSelectedBenefit(benefit);
        setEditFormData({
            name: benefit.name || '',
            discount: benefit.discount || '',
            q_of_codes: benefit.q_of_codes || '',
            id_business: benefit.id_business || ''
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (benefit) => {
        setSelectedBenefit(benefit);
        setShowDeleteModal(true);
    };

    const handleCreateClick = () => {
        resetForm(INITIAL_BENEFIT_FORM, setCreateFormData);
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetForm(INITIAL_BENEFIT_FORM, setCreateFormData);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createBenefit(createFormData);
            setShowCreateModal(false);
            setCurrentPage(1);
            loadBenefits();
        } catch (err) {
            console.error('Error creating benefit:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateBenefit(selectedBenefit.id, editFormData);
            setShowEditModal(false);
            loadBenefits();
        } catch (err) {
            console.error('Error updating benefit:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setIsSubmitting(true);
        try {
            await deleteBenefit(selectedBenefit.id);
            setShowDeleteModal(false);
            loadBenefits();
        } catch (err) {
            console.error('Error deleting benefit:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => handleFormInputChange(e, setEditFormData);
    const handleCreateInputChange = (e) => handleFormInputChange(e, setCreateFormData);

    // Business handlers
    const handleEditBusinessClick = (business) => {
        setSelectedBusiness(business);
        setEditBusinessFormData({
            name: business.name || '',
            description: business.description || '',
            location: business.location || '',
            phone: business.phone || '',
            url_image: business.url_image || ''
        });
        setShowEditBusinessModal(true);
    };

    const handleDeleteBusinessClick = (business) => {
        setSelectedBusiness(business);
        setShowDeleteBusinessModal(true);
    };

    const handleCreateBusinessClick = () => {
        resetForm(INITIAL_BUSINESS_FORM, setCreateBusinessFormData);
        setShowCreateBusinessModal(true);
    };

    const handleCloseCreateBusinessModal = () => {
        setShowCreateBusinessModal(false);
        resetForm(INITIAL_BUSINESS_FORM, setCreateBusinessFormData);
    };

    const handleCreateBusinessSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingBusiness(true);
        try {
            await createBusiness(createBusinessFormData);
            setShowCreateBusinessModal(false);
            setCurrentBusinessPage(1);
            loadBusinesses();
        } catch (err) {
            console.error('Error creating business:', err);
        } finally {
            setIsSubmittingBusiness(false);
        }
    };

    const handleEditBusinessSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingBusiness(true);
        try {
            await updateBusiness(selectedBusiness.id, editBusinessFormData);
            setShowEditBusinessModal(false);
            loadBusinesses();
        } catch (err) {
            console.error('Error updating business:', err);
        } finally {
            setIsSubmittingBusiness(false);
        }
    };

    const handleDeleteBusinessConfirm = async () => {
        setIsSubmittingBusiness(true);
        try {
            await deleteBusiness(selectedBusiness.id);
            setShowDeleteBusinessModal(false);
            loadBusinesses();
        } catch (err) {
            console.error('Error deleting business:', err);
        } finally {
            setIsSubmittingBusiness(false);
        }
    };

    const handleBusinessInputChange = (e) => handleFormInputChange(e, setEditBusinessFormData);
    const handleCreateBusinessInputChange = (e) => handleFormInputChange(e, setCreateBusinessFormData);

    const handlePreviousPage = () => {
        if (canGoPrevious(currentPage)) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (canGoNext(paginatedBenefits.length, BENEFITS_PER_PAGE)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousBusinessPage = () => {
        if (canGoPrevious(currentBusinessPage)) {
            setCurrentBusinessPage(currentBusinessPage - 1);
        }
    };

    const handleNextBusinessPage = () => {
        if (canGoNext(paginatedBusinesses.length, BUSINESS_PER_PAGE)) {
            setCurrentBusinessPage(currentBusinessPage + 1);
        }
    };

    const { start: beginBenefits, end: beginBenefitsFinal } = calculatePageRange(
        currentPage,
        BENEFITS_PER_PAGE,
        paginatedBenefits.length
    );

    const { start: beginBusinesses, end: beginBusinessesFinal } = calculatePageRange(
        currentBusinessPage,
        BUSINESS_PER_PAGE,
        paginatedBusinesses.length
    );

    if (section === 'benefits' && benefitsError) {
        return <ErrorState title={MESSAGES.ERROR_LOADING_BENEFITS} message={benefitsError} onRetry={loadBenefits} />;
    }

    if (section === 'business' && businessError) {
        return <ErrorState title={MESSAGES.ERROR_LOADING_BUSINESS} message={businessError} onRetry={loadBusinesses} />;
    }

    if (section === 'benefits') {
        return (
            <div className='admin-users-container'>
                <div className='admin-users-first-row'>
                    <span className='admin-users-title-section'>Administrar Beneficios</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                            className='admin-users-btn-create' 
                            onClick={handleCreateClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Nuevo Beneficio
                        </button>
                        <button className='admin-users-btn-create' onClick={() => setSection('business')}>
                            Ir a Negocios
                        </button>
                    </div>
                </div>
                <div className='admin-users-second-row'>
                    <span className='admin-users-title-second-row'>Lista de beneficios</span>
                    <div className='admin-users-searcher'>
                        <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1000 1000"><path fill="#000000" d="m746 641l254 255l-105 105l-254-254q-106 72-232 72q-169 0-289-120T0 410t120-289T409 1t289 120t120 289q0 127-72 231zm-65-231q0-113-79.5-193T409 137t-193 80t-80 193t80 192.5T409 682t192.5-79.5T681 410z"/></svg>
                        <input 
                            type="text" 
                            className='admin-users-input-search' 
                            placeholder='Buscar beneficios...'
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
                                    <th>Descuento</th>
                                    <th>Códigos</th>
                                    <th>Negocio ID</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBenefits.map((benefit) => (
                                    <tr key={benefit.id}>
                                        <td>{benefit.id}</td>
                                        <td className='admin-users-name'>{benefit.name || 'No especificado'}</td>
                                        <td>{benefit.discount || 'No especificado'}</td>
                                        <td>{benefit.q_of_codes || 'No especificado'}</td>
                                        <td>{benefit.id_business || 'No especificado'}</td>
                                        <td className='admin-users-actions'>
                                            <button 
                                                className='admin-users-btn-action admin-users-btn-edit' 
                                                title='Editar' 
                                                onClick={() => handleEditClick(benefit)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
                                            </button>
                                            <button 
                                                className='admin-users-btn-action admin-users-btn-delete' 
                                                title='Eliminar' 
                                                onClick={() => handleDeleteClick(benefit)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredBenefits.length === 0 && (
                            <EmptyState 
                                icon="gift"
                                title={MESSAGES.NO_BENEFITS_FOUND}
                                message="Crea un nuevo beneficio usando el botón superior."
                            />
                        )}
                    </div>
                    <div className='admin-users-pagination'>
                        <div className='admin-users-info'>
                            <span>Beneficios por página: </span><span>{BENEFITS_PER_PAGE}</span>
                        </div>
                        <div className='admin-users-page-buttons'>
                            <span className='admin-users-page-number'>Pagina: {currentPage}</span>
                            <span className='admin-users-space-users'>Mostrando: {filteredBenefits.length > 0 ? beginBenefits : 0}-{beginBenefitsFinal}</span>
                            <button 
                                className={`admin-users-btn-page ${!canGoPrevious(currentPage) ? 'admin-users-disabled' : ''}`}
                                onClick={handlePreviousPage}
                                disabled={!canGoPrevious(currentPage)}
                            >
                                <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="#000000" strokeWidth="2" d="M17 2L7 12l10 10"/></svg>
                            </button>
                            <button 
                                className={`admin-users-btn-page ${!canGoNext(paginatedBenefits.length, BENEFITS_PER_PAGE) ? 'admin-users-disabled' : ''}`}
                                onClick={handleNextPage}
                                disabled={!canGoNext(paginatedBenefits.length, BENEFITS_PER_PAGE)}
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
                                <h2>Modificar Beneficio</h2>
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
                                    <label htmlFor='discount'>Descuento</label>
                                    <input 
                                        type='number' 
                                        id='discount'
                                        name='discount'
                                        value={editFormData.discount}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className='admin-users-form-group'>
                                    <label htmlFor='q_of_codes'>Cantidad de códigos</label>
                                    <input 
                                        type='number' 
                                        id='q_of_codes'
                                        name='q_of_codes'
                                        value={editFormData.q_of_codes}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className='admin-users-form-group'>
                                    <label htmlFor='id_business'>ID Negocio</label>
                                    <input 
                                        type='text' 
                                        id='id_business'
                                        name='id_business'
                                        value={editFormData.id_business}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
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
                                <h2>Crear Nuevo Beneficio</h2>
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
                                    <label htmlFor='create-discount'>Descuento</label>
                                    <input 
                                        type='number' 
                                        id='create-discount'
                                        name='discount'
                                        value={createFormData.discount}
                                        onChange={handleCreateInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className='admin-users-form-group'>
                                    <label htmlFor='create-q_of_codes'>Cantidad de códigos</label>
                                    <input 
                                        type='number' 
                                        id='create-q_of_codes'
                                        name='q_of_codes'
                                        value={createFormData.q_of_codes}
                                        onChange={handleCreateInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className='admin-users-form-group'>
                                    <label htmlFor='create-id_business'>ID Negocio</label>
                                    <input 
                                        type='text' 
                                        id='create-id_business'
                                        name='id_business'
                                        value={createFormData.id_business}
                                        onChange={handleCreateInputChange}
                                        disabled={isSubmitting}
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
                                        {isSubmitting ? 'Creando...' : 'Crear Beneficio'}
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
                                <h2>Eliminar Beneficio</h2>
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
                                <p>{MESSAGES.CONFIRM_DELETE_BENEFIT} <strong>{selectedBenefit?.name}</strong>?</p>
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
        );
    }

    // Business section
    return (
        <div className='admin-users-container'>
            <div className='admin-users-first-row'>
                <span className='admin-users-title-section'>Administrar Negocios</span>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className='admin-users-btn-create' onClick={() => setSection('benefits')}>
                        Ir a Beneficios
                    </button>
                    <button 
                        className='admin-users-btn-create' 
                        onClick={handleCreateBusinessClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Nuevo Negocio
                    </button>
                </div>
            </div>
            <div className='admin-users-second-row'>
                <span className='admin-users-title-second-row'>Lista de negocios</span>
                <div className='admin-users-searcher'>
                    <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1000 1000"><path fill="#000000" d="m746 641l254 255l-105 105l-254-254q-106 72-232 72q-169 0-289-120T0 410t120-289T409 1t289 120t120 289q0 127-72 231zm-65-231q0-113-79.5-193T409 137t-193 80t-80 193t80 192.5T409 682t192.5-79.5T681 410z"/></svg>
                    <input 
                        type="text" 
                        className='admin-users-input-search' 
                        placeholder='Buscar negocios...'
                        value={businessSearchTerm}
                        onChange={(e) => setBusinessSearchTerm(e.target.value)}
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
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBusinesses.map((business) => (
                                <tr key={business.id}>
                                    <td>{business.id}</td>
                                    <td className='admin-users-name'>{business.name || 'No especificado'}</td>
                                    <td>{business.description || 'No especificado'}</td>
                                    <td>{business.location || 'No especificado'}</td>
                                    <td>{business.phone || 'No especificado'}</td>
                                    <td className='admin-users-actions'>
                                        <button 
                                            className='admin-users-btn-action admin-users-btn-edit' 
                                            title='Editar' 
                                            onClick={() => handleEditBusinessClick(business)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
                                        </button>
                                        <button 
                                            className='admin-users-btn-action admin-users-btn-delete' 
                                            title='Eliminar' 
                                            onClick={() => handleDeleteBusinessClick(business)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBusinesses.length === 0 && (
                        <EmptyState 
                            icon="building"
                            title={MESSAGES.NO_BUSINESS_FOUND}
                            message="Crea un nuevo negocio usando el botón superior."
                        />
                    )}
                </div>
                <div className='admin-users-pagination'>
                    <div className='admin-users-info'>
                        <span>Negocios por página: </span><span>{BUSINESS_PER_PAGE}</span>
                    </div>
                    <div className='admin-users-page-buttons'>
                        <span className='admin-users-page-number'>Pagina: {currentBusinessPage}</span>
                        <span className='admin-users-space-users'>Mostrando: {filteredBusinesses.length > 0 ? beginBusinesses : 0}-{beginBusinessesFinal}</span>
                        <button 
                            className={`admin-users-btn-page ${!canGoPrevious(currentBusinessPage) ? 'admin-users-disabled' : ''}`}
                            onClick={handlePreviousBusinessPage}
                            disabled={!canGoPrevious(currentBusinessPage)}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="#000000" strokeWidth="2" d="M17 2L7 12l10 10"/></svg>
                        </button>
                        <button 
                            className={`admin-users-btn-page ${!canGoNext(paginatedBusinesses.length, BUSINESS_PER_PAGE) ? 'admin-users-disabled' : ''}`}
                            onClick={handleNextBusinessPage}
                            disabled={!canGoNext(paginatedBusinesses.length, BUSINESS_PER_PAGE)}
                        >
                            <svg className='admin-users-icon-search' xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42"><path fill="#000000" fillRule="evenodd" d="M13.933 1L34 21.068L14.431 40.637l-4.933-4.933l14.638-14.636L9 5.933z"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {showEditBusinessModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmittingBusiness && setShowEditBusinessModal(false)}>
                    <div className='admin-users-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Modificar Negocio</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={() => setShowEditBusinessModal(false)}
                                disabled={isSubmittingBusiness}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <form className='admin-users-modal-form' onSubmit={handleEditBusinessSubmit}>
                            <div className='admin-users-form-group'>
                                <label htmlFor='business-name'>Nombre</label>
                                <input 
                                    type='text' 
                                    id='business-name'
                                    name='name'
                                    value={editBusinessFormData.name}
                                    onChange={handleBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='business-description'>Descripción</label>
                                <textarea 
                                    id='business-description'
                                    name='description'
                                    value={editBusinessFormData.description}
                                    onChange={handleBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='business-location'>Ubicación</label>
                                <input 
                                    type='text' 
                                    id='business-location'
                                    name='location'
                                    value={editBusinessFormData.location}
                                    onChange={handleBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='business-phone'>Teléfono</label>
                                <input 
                                    type='text' 
                                    id='business-phone'
                                    name='phone'
                                    value={editBusinessFormData.phone}
                                    onChange={handleBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label>Imagen del negocio</label>
                                {editBusinessFormData.url_image && (
                                    <div className='admin-users-image-preview-container'>
                                        <img 
                                            src={editBusinessFormData.url_image} 
                                            alt="Preview" 
                                            className='admin-users-image-preview' 
                                        />
                                        <button 
                                            type='button' 
                                            className='admin-users-btn-remove-image' 
                                            onClick={() => setEditBusinessFormData(prev => ({ ...prev, url_image: '' }))}
                                            disabled={isSubmittingBusiness}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                                        </button>
                                    </div>
                                )}
                                <input 
                                    type='text' 
                                    id='business-url_image'
                                    name='url_image'
                                    placeholder='URL de la imagen'
                                    value={editBusinessFormData.url_image}
                                    onChange={handleBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-modal-actions'>
                                <button 
                                    type='button' 
                                    className='admin-users-btn-cancel' 
                                    onClick={() => setShowEditBusinessModal(false)}
                                    disabled={isSubmittingBusiness}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type='submit' 
                                    className='admin-users-btn-save'
                                    disabled={isSubmittingBusiness}
                                >
                                    {isSubmittingBusiness ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showCreateBusinessModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmittingBusiness && handleCloseCreateBusinessModal()}>
                    <div className='admin-users-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Crear Nuevo Negocio</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={handleCloseCreateBusinessModal}
                                disabled={isSubmittingBusiness}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <form className='admin-users-modal-form' onSubmit={handleCreateBusinessSubmit}>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-business-name'>Nombre *</label>
                                <input 
                                    type='text' 
                                    id='create-business-name'
                                    name='name'
                                    value={createBusinessFormData.name}
                                    onChange={handleCreateBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                    required
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-business-description'>Descripción</label>
                                <textarea 
                                    id='create-business-description'
                                    name='description'
                                    value={createBusinessFormData.description}
                                    onChange={handleCreateBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-business-location'>Ubicación</label>
                                <input 
                                    type='text' 
                                    id='create-business-location'
                                    name='location'
                                    value={createBusinessFormData.location}
                                    onChange={handleCreateBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label htmlFor='create-business-phone'>Teléfono</label>
                                <input 
                                    type='text' 
                                    id='create-business-phone'
                                    name='phone'
                                    value={createBusinessFormData.phone}
                                    onChange={handleCreateBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-form-group'>
                                <label>Imagen del negocio</label>
                                {createBusinessFormData.url_image && (
                                    <div className='admin-users-image-preview-container'>
                                        <img 
                                            src={createBusinessFormData.url_image} 
                                            alt="Preview" 
                                            className='admin-users-image-preview' 
                                        />
                                        <button 
                                            type='button' 
                                            className='admin-users-btn-remove-image' 
                                            onClick={() => setCreateBusinessFormData(prev => ({ ...prev, url_image: '' }))}
                                            disabled={isSubmittingBusiness}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                                        </button>
                                    </div>
                                )}
                                <input 
                                    type='text' 
                                    id='create-business-url_image'
                                    name='url_image'
                                    placeholder='URL de la imagen'
                                    value={createBusinessFormData.url_image}
                                    onChange={handleCreateBusinessInputChange}
                                    disabled={isSubmittingBusiness}
                                />
                            </div>
                            <div className='admin-users-modal-actions'>
                                <button 
                                    type='button' 
                                    className='admin-users-btn-cancel' 
                                    onClick={handleCloseCreateBusinessModal}
                                    disabled={isSubmittingBusiness}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type='submit' 
                                    className='admin-users-btn-save'
                                    disabled={isSubmittingBusiness}
                                >
                                    {isSubmittingBusiness ? 'Creando...' : 'Crear Negocio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showDeleteBusinessModal && createPortal(
                <div className='admin-users-modal-overlay' onClick={() => !isSubmittingBusiness && setShowDeleteBusinessModal(false)}>
                    <div className='admin-users-modal-content admin-users-modal-ban' onClick={(e) => e.stopPropagation()}>
                        <div className='admin-users-modal-header'>
                            <h2>Eliminar Negocio</h2>
                            <button 
                                className='admin-users-modal-close' 
                                onClick={() => setShowDeleteBusinessModal(false)}
                                disabled={isSubmittingBusiness}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        </div>
                        <div className='admin-users-modal-body'>
                            <div className='admin-users-warning-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                            <p>{MESSAGES.CONFIRM_DELETE_BUSINESS} <strong>{selectedBusiness?.name}</strong>?</p>
                            <p className='admin-users-warning-text'>{MESSAGES.DELETE_WARNING}</p>
                        </div>
                        <div className='admin-users-modal-actions'>
                            <button 
                                type='button' 
                                className='admin-users-btn-cancel' 
                                onClick={() => setShowDeleteBusinessModal(false)}
                                disabled={isSubmittingBusiness}
                            >
                                Cancelar
                            </button>
                            <button 
                                type='button' 
                                className='admin-users-btn-delete-confirm'
                                onClick={handleDeleteBusinessConfirm}
                                disabled={isSubmittingBusiness}
                            >
                                {isSubmittingBusiness ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default BenefitsContent;