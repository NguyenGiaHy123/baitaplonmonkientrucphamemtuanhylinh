import React, { useState } from 'react';
import axios from 'axios'; // Import Axios library
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(authSelector);
    const userId = user.id;
    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            console.log("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await axios.post(`${APPINFOS.BASE_URL}/users/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload successful:', response.data);
            // Handle any additional logic after successful upload
        } catch (error) {
            console.error('Upload failed:', error);
            // Handle upload error
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <h1>File Upload</h1>
            <input type="file" name="avatar" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};

export default FileUpload;