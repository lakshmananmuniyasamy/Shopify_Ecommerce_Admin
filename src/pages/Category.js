import { toBeRequired } from '@testing-library/jest-dom/matchers';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Table } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiPencil } from 'react-icons/ti';
import { toast } from 'react-toastify';

const Category = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const token = localStorage.getItem('token');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = (cat) => {
        setSelectedCategory(cat);
        setShow1(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/category');
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat.Category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const handleSubmit = async () => {
        try {
            console.log('add cat method');
            const response = await axios.post('http://localhost:8080/category', { category });
            // console.log('response.data.status ',response.data.status);
            if (response.data.status) {
                setCategories([...categories, response.data.category]);
                setFilteredCategories([...filteredCategories, response.data.category]);
                toast.success("new category added successfully");
                setCategory('');
                handleClose();
            } else {
                toast.error(response.data.error);
            }

        } catch (error) {
            toast.error(error.message);
            console.log("error", error.message);
            console.error('Error adding category:', error);
        }
    };

    const handleUpdate = async () => {
        console.log("selected cate",selectedCategory)
        if (selectedCategory.Category ==='') {
            toast.error("Category is required")
            return;
        }
        try {

            const response = await axios.put(
                `http://localhost:8080/category/update/${selectedCategory._id}`,
                { selectedCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedCategory = response.data.category;

            setCategories(categories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));
            setFilteredCategories(filteredCategories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));
            setSelectedCategory(null);
            handleClose1();


        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm("Are you sure you want to delete this category?");

        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:8080/category/delete/${id}`)

                if (response) {
                    toast.success("category is deleted");
                    fetchCategories();
                }
            } catch (error) {
                toast.error(error.message);


            }
        }


    }

    return (
        <div>
            <Container>
                <Row className='mt-2'>
                    <Col md={10} className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder='Search By Category'
                            className="me-2"
                            style={{ width: '200px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)
                            }
                        />
                    </Col>
                    <Col md={2} className="text-md-end mt-2 mt-md-0">
                        <Button
                            style={{ backgroundColor: "darkorange", border: "2px solid darkorange" }}
                            onClick={handleShow}
                            className='d-flex align-items-center'
                        >
                            <FaPlus /> Add
                        </Button>
                    </Col>
                </Row>
                <Table bordered className='text-center'>
                    <thead>
                        <tr>
                            <th>s.no</th>
                            <th>Category</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat, index) => (
                            <tr key={cat._id}>
                                <td>{index + 1}</td>
                                <td>{cat.Category}</td> {/* Adjust according to your schema */}
                                <td className='w-25'>
                                    <div className='d-flex align-items-center justify-content-evenly'>
                                        <TiPencil className="me-5" style={{ cursor: 'pointer' }} onClick={() => handleShow1(cat)} />
                                        <RiDeleteBin6Line style={{ cursor: 'pointer' }} onClick={() => handleDelete(cat._id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Add Category Modal */}
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Enter a Category" className="mb-3">
                        <Form.Control
                            type="text"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Category Modal */}
            <Modal show={show1} onHide={handleClose1} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Enter a Category" className="mb-3">
                        <Form.Control
                            type="text"
                            value={selectedCategory ? selectedCategory.Category : ''}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, Category: e.target.value })}
                            placeholder="Enter category"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;