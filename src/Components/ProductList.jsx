import {Col, Container, Row} from "react-bootstrap";

function ProductList(props) {
    return(
        <>
            <Container>
                {props.products.map((product) => (
                    <Row>
                        <Col>1 of 2</Col>
                        <Col>2 of 2</Col>
                    </Row>
                ))}
            </Container>
        </>
    )
}
export default ProductList;