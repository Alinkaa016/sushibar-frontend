import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import "../css/pagination.css"

const CustomPagination = ({onPageChange, totalPages, currentPage}) => {
    const pageLimit = 5;  // Максимальное количество отображаемых кнопок страниц
    let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(pageLimit / 2));

    if (endPage - startPage + 1 < pageLimit) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + pageLimit - 1);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - pageLimit + 1);
        }
    }

    const pages = Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {currentPage > 1 && (
                    <li className="page-item">
                        <Button variant="outline-dark" className="page-link1"
                                onClick={() => onPageChange(currentPage - 1)}>
                            Назад
                        </Button>
                    </li>
                )}

                {startPage > 1 && (
                    <>
                        <li className="page-item">
                            <Button variant="outline-dark" className="page-link1" onClick={() => onPageChange(1)}>
                                1
                            </Button>
                        </li>
                        {startPage > 2 && <li className="page-item"><span style={{color: "black"}}
                                                                          className="page-link border-0">...</span>
                        </li>}
                    </>
                )}

                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Button variant="outline-dark" className="page-link1" onClick={() => onPageChange(page)}>
                            {page}
                        </Button>
                    </li>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <li className="page-item"><span style={{color: "black"}}
                                                                                     className="page-link border-0">...</span>
                        </li>}
                        <li className="page-item">
                            <Button variant="outline-dark" className="page-link1"
                                    onClick={() => onPageChange(totalPages)}>
                                {totalPages}
                            </Button>
                        </li>
                    </>
                )}

                {currentPage < totalPages && (
                    <li className="page-item">
                        <Button variant="outline-dark" className="page-link1"
                                onClick={() => onPageChange(currentPage + 1)}>
                            Вперед
                        </Button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default CustomPagination;
