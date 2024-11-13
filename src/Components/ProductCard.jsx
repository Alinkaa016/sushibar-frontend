import React, {useState} from "react";
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBContainer, MDBRow,} from "mdb-react-ui-kit";

import "../css/productPage.css"
import {Button, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import MyAlert from "./MyAlert";

function ProductCard({product, handleSelectProduct}) {
    const [isContain, setIsContain] = useState(false);
    const navigate = useNavigate();
    const [reload, setReload] = useState(false);
    const isChildModeEnabled = JSON.parse(localStorage.getItem('isChildModeEnabled'));
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);

    function handleGoToCart() {
        navigate("/cart");
    }

    return (
        <MDBContainer fluid className="mt-3 mb-3">
            <MDBRow className="justify-content-center">
                <MDBCol>
                    <MDBCard style={{minHeight:"500px", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"}} className="text-black border-0">
                        {/*<MDBCardImage*/}
                        {/*    style={{objectFit: "contain", maxWidth: "200px", margin: "0 auto"}}*/}
                        {/*    // src={`data:image/jpeg;base64,${product.image}`}*/}
                        {/*    src={product.image.includes('data:image') ? product.image.split(',')[1] : product.image}*/}
                        {/*    position="top"*/}
                        {/*    alt={product.image}*/}
                        {/*/>*/}
                        <MDBCardBody style={{display: "flex", flexDirection:"column", justifyContent: "space-between"}}>
                            <div className="text-center">
                                <MDBCardTitle onClick={() => handleSelectProduct(product)}
                                              className="hover-text">{product.name}</MDBCardTitle>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between">
                                    <span>Рейтинг</span>
                                    <span>{product.rating}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-end mt-2">
                                    <span>Цена</span>
                                    <span>{product.price.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                {!isChildModeEnabled &&
                                    <Row className={"mt-2"} style={{width:'100%', margin:'auto'}}>
                                        <Button variant="primary"
                                                style={{textWrap: "nowrap"}}>Купить</Button>
                                    </Row>
                                }
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                     handleHide={() => {
                         setShowAlert(false)
                     }} message={successResponse ? successResponse : errorResponse}
                     header={"Уведомление"}/>
        </MDBContainer>
    );
}

export default ProductCard;