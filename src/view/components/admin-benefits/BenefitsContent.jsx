import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../../styles/main-admin/mainContent.css';
import LoadingScreen from '../others/LoadingScreen';


function BenefitsContent() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [benefitsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditBenefitModal, setShowEditBenefitModal] = useState(false);
    const [showDeleteBenefitModal, setShowDeleteModal] = useState(false);
    const [showCreateBenefitModal, setShowCreateModal] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        q_of_codes: null,
        id_business: null,
        discount: null
    });
    const [createFormData, setCreateFormData] = useState({
        name: '',
        q_of_codes: null,
        id_business: null,
        discount: null
    });
    
    return (
        <>
            
        </>
    )
}

export default BenefitsContent;