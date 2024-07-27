import { Button, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { toast } from 'react-toastify';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import admin from '../Asserts/admin.png'

function NavScrollExample() {


    const handleLogout = () => {
        toast.success("Logout Successfull");
        localStorage.clear();
        window.location.reload();
    };


    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary w-100" style={{position:"fixed",zIndex:"1"}}>
            <Container >
                <Navbar.Brand href="/"><RiDashboardHorizontalFill />DashBoard</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll>

                        <Nav.Link href="/addproduct">AddProduct</Nav.Link>
                        <Nav.Link href="/order-list">Order List</Nav.Link>

                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title={
                                <span className=''>
                                    <IoPerson className="me-2" />
                                    Account
                                </span>
                            }
                            menuVariant="dark" >
                            <span className="d-flex justify-content-around m-2 align-items-center gap-5">
                                <div className="d-flex align-items-center gap-2">
                                    <img src={admin} width="60" height="60" alt="admin" />
                                    <span>name</span>
                                </div>
                                <Button onClick={handleLogout}>Logout</Button>
                            </span>


                            <NavDropdown.Divider />
                            <Nav.Link href="/users">Users</Nav.Link>

                        </NavDropdown>

                    </Nav>

                </Navbar.Collapse>
            </Container>

        </Navbar>

    );
}

export default NavScrollExample;