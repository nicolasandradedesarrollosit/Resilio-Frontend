import { useState } from 'react';
import { validateImageFile, createImagePreview } from '../helpers/eventsFunctions';

export function useImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            alert(validation.error);
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
        
        try {
            const preview = await createImagePreview(file);
            setImagePreview(preview);
        } catch (error) {
            console.error('Error creating preview:', error);
        }
    };

    const resetImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    return {
        selectedFile,
        imagePreview,
        uploading,
        setUploading,
        handleFileSelect,
        resetImage
    };
}
