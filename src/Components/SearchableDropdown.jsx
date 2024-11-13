import React, {useState} from 'react';
import {Dropdown, FormControl} from 'react-bootstrap';

const SearchableDropdown = ({ items, handleSelect}) => {
    const [filter, setFilter] = useState(''); // Использование строки для фильтра
    const [show, setShow] = useState(false);


    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Dropdown show={show} onToggle={() => setShow(!show)}>
            <Dropdown.Toggle variant={"dark"} style={{backgroundColor:"white", color:"black", borderRadius:"3px", marginBottom:"5px"}} id="dropdown-basic">
                Выберите категорию
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto custom-focus"
                    placeholder="Поиск..."
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                />
                {filteredItems.map((item) => (
                    <Dropdown.Item key={item.id} onClick={() => handleSelect(item)}>
                        {item.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SearchableDropdown;
