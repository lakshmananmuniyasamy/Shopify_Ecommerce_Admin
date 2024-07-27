import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import AddProductOffcanvas from './AddProductOffcanvas';
import UpdateProductOffcanvas from './UpdateProductOffCanvas';
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from 'react-icons/ri';

const Products = () => {
  const token = localStorage.getItem('token');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showOffcanvas1, setShowOffcanvas1] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  const handleShow1 = (product) => {
    setSelectedProduct(product);
    setShowOffcanvas1(true);
  };
  const handleClose1 = () => setShowOffcanvas1(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const response = await axios.get("http://localhost:8080/product/getallproducts", { headers: { Authorization: `Bearer ${token}` } });
    console.log('response all products', response.data);
    setProducts(response.data);
  };

  const filterProducts = (product) => {
    if (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.quantity.toString().includes(searchTerm)
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Container>
        <Row className='mt-2'>
          <Col md={10} className="d-flex">
            <Form.Control
              type="text"
              placeholder='Search...'
              className="me-2"
              style={{ width: '200px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={2} className="text-md-end mt-2 mt-md-0">
            <Button style={{ backgroundColor: "darkorange", border: "2px solid darkorange" }} onClick={handleShow} className='d-flex align-items-center'><FaPlus />Add</Button>
          </Col>
        </Row>

        <Table bordered hover className='mt-4'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>ProductImage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.filter(filterProducts).map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.subcategory}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td><img src={`http://localhost:8080/uploads/${product.imageUrl}`} width={"100px"} height={"auto"} alt="image" /></td>
                <td>
                  <div className='d-flex align-items-center'>
                    <TiPencil className="me-5" style={{ cursor: 'pointer' }} onClick={() => handleShow1(product)} />
                    <RiDeleteBin6Line style={{ cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <AddProductOffcanvas show={showOffcanvas} handleClose={handleClose} fetchAllProducts={fetchAllProducts} />
        <UpdateProductOffcanvas show={showOffcanvas1} handleClose={handleClose1} product={selectedProduct} fetchAllProducts={fetchAllProducts} />
      </Container>
    </>
  );
}

export default Products;
