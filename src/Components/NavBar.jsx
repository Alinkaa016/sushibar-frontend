import {Button, Container, Form, Nav, Navbar} from "react-bootstrap";


function NavBar() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#home">
                        Сушибар
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Главная</Nav.Link>
                            <Nav.Link href="#link">Каталог</Nav.Link>
                            <Nav.Link href="#link">Профиль</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Button variant="outline-light">Войти</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar;