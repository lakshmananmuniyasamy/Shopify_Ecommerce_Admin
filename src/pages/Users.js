import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Table, Form } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import AddUserOffcanvas from './AddUserOffcanvas';
import UpdateUserOffcanvas from './UpdateUserOffcanvas';

const Users = () => {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddOffcanvas, setShowAddOffcanvas] = useState(false);
    const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const fetchUserData = async () => {
        try {
            console.log("Fetching user data");
            const response = await axios.get(`http://localhost:8080/form/getalldetails`, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Response user details', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleShowAdd = () => setShowAddOffcanvas(true);
    const handleCloseAdd = () => setShowAddOffcanvas(false);

    const handleShowUpdate = (user) => {
        setSelectedUser(user);
        setShowUpdateOffcanvas(true);
    };
    const handleCloseUpdate = () => setShowUpdateOffcanvas(false);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Container>
                <Row className='mt-5'>
                    <Col md={10} className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder='Search by name or email...'
                            className="me-2"
                            style={{ width: '200px' }}
                            value={search}
                            onChange={handleSearch}
                        />
                    </Col>
                    <Col md={2} className="text-md-end mt-2 mt-md-0">
                        <Button style={{ backgroundColor: "darkorange", border: "2px solid darkorange" }} onClick={handleShowAdd} className='d-flex align-items-center'><FaPlus />Add</Button>
                    </Col>
                </Row>

                <Table hover bordered className='mt-4'>
                    <thead>
                        <tr>
                            <th>s.no</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Country</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.gender}</td>
                                <td>{user.country}</td>
                                <td>
                                    <TiPencil className="me-3" style={{ cursor: 'pointer' }} onClick={() => handleShowUpdate(user)} />
                                    <RiDeleteBin6Line style={{ cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <AddUserOffcanvas show={showAddOffcanvas} handleClose={handleCloseAdd} fetchUserData={fetchUserData} />
                {selectedUser && (
                    <UpdateUserOffcanvas show={showUpdateOffcanvas} handleClose={handleCloseUpdate} user={selectedUser} fetchUserData={fetchUserData} />
                )}
            </Container>
        </>
    );
};

export default Users;
