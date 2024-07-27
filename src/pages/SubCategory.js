import React, { useState, useEffect } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Table } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiPencil } from 'react-icons/ti';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubCategory = () => {
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [filterSubCategories, setFilterSubCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    useEffect(() => {
        const filtered = subCategories.filter(cat =>
            cat.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterSubCategories(filtered);
    }, [searchTerm, subCategories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/subcategory');
            setSubCategories(response.data);
            console.log("respons in sub cat", response.data)
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setSelectedCategory('');
        setSelectedSubCategory('');
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedCategory('');
        setSelectedSubCategory('');
    };

    const handleShowUpdateModal = (subCategory) => {
        setSelectedSubCategoryId(subCategory._id);
        setSelectedCategoryId(subCategory.categoryId._id);
        setSelectedSubCategory(subCategory.subCategory);
        setShowUpdateModal(true);
    };

    const handleAddSubCategory = async () => {
        // Validation
        if (!selectedCategory.trim()) {
            toast.error("Category is required");
            return;
        }
        if (!selectedSubCategory.trim()) {
            toast.error("Subcategory is required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/subcategory', {
                selectedCategory,
                selectedSubCategory
            });
            if (response.data.status) {
                toast.success("SubCategory Added Successfully")
                handleCloseAddModal();
                fetchSubCategories();
            }else{
                toast.error(response.data.error)
            }

        } catch (error) {
            console.error('Error adding subcategory:', error);
            toast.error("Failed to add subcategory");
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateSubCategory = async () => {
        if (!selectedSubCategory.trim()) {
            toast.error('SubCategory is required')
            return;
        }
        if (!selectedCategoryId.trim()) {
            toast.error('Category is required')
            return;
        }
        try {
            await axios.put(`http://localhost:8080/subcategory/update/${selectedSubCategoryId}`, {
                selectedSubCategory,
                selectedCategoryId
            });
            handleCloseUpdateModal();
            fetchSubCategories(); // Refresh subcategories after updating
        } catch (error) {
            console.error('Error updating subcategory:', error);
        }
    };

    const handleDeleteSubCategory = async (subCategoryId) => {
        const confirmed = window.confirm("Are you sure Delete the subCategory");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8080/subcategory/delete/${subCategoryId}`);
                fetchSubCategories();
            } catch (error) {
                console.error('Error deleting subcategory:', error);
            }
        }

    };

    return (
        <div>
            <Container>
                <Row className='mt-2'>
                    <Col md={10} className='d-flex'>
                        <Form.Control
                            type='text'
                            placeholder='Search...'
                            className='me-2'
                            style={{ width: '200px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={2} className='text-md-end mt-2 mt-md-0'>
                        <Button
                            style={{ backgroundColor: 'darkorange', border: '2px solid darkorange' }}
                            onClick={handleShowAddModal}
                            className='d-flex align-items-center'
                        >
                            <FaPlus /> Add
                        </Button>
                    </Col>
                </Row>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>s.no</th>
                            <th>Category</th>
                            <th>SubCategory</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterSubCategories.map((subCategory, index) => (
                            <tr key={subCategory._id}>
                                <td>{index + 1}</td>
                                <td>{subCategory.categoryId.Category}</td>
                                <td>{subCategory.subCategory}</td>
                                <td className='w-25'>
                                    <div className='d-flex align-items-center'>
                                        <TiPencil
                                            className='me-5'
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleShowUpdateModal(subCategory)}
                                        />
                                        <RiDeleteBin6Line
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteSubCategory(subCategory._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Add SubCategory Modal */}
            <Modal show={showAddModal} onHide={handleCloseAddModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add SubCategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className='mb-3'>
                        <Form.Label>Select Category</Form.Label>
                        <Form.Control
                            as='select'
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value=''>Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.Category}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <FloatingLabel controlId='floatingInput' label='Enter a SubCategory' className='mb-3'>
                        <Form.Control
                            type='text'
                            placeholder='Enter a SubCategory'
                            value={selectedSubCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant='primary' disabled={loading} onClick={handleAddSubCategory}>
                        {loading ? "Adding" : " Add SubCategory"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update SubCategory Modal */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update SubCategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className='mb-3'>
                        <Form.Label>Select Category</Form.Label>
                        <Form.Control
                            as='select'
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option value=''>Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.Category}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <FloatingLabel controlId='floatingInput' label='Enter a SubCategory' className='mb-3'>
                        <Form.Control
                            type='text'
                            placeholder='Enter a SubCategory'
                            value={selectedSubCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseUpdateModal}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleUpdateSubCategory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SubCategory;
