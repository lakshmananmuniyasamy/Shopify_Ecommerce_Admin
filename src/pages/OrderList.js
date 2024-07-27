import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const OrderList = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');
    

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/cart/getcart',
            //  {
            //     headers: { Authorization: `Bearer ${token}` }
            // }
            );
            setProducts(response.data);
            console.log("Response data in carts", response);

          
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    return (
        <div className='container pt-5'>
            <Table bordered className='table'>
                <thead className='mt-5'>
                    <tr>
                        <th>s.no</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>SubCategory</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Total Quantity</th>
                        <th>Price</th>
                        <th>status</th>
                        <th>total price</th>
                        <th>Image</th>
                        <th>Buyer</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product,index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{product.productName}</td>
                            <td>{product.category}</td>
                            <td>{product.subcategory}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.productId.quantity}</td>
                            <td>{product.price}</td>
                            <td>{product.status}</td>
                            <td>{product.totalPrice}</td>
                            <td><img src={`http://localhost:8080/uploads/${product.imageUrl}`} width={"100px"} height={"auto"} alt="image" /></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OrderList;
