import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search
    if (value === '') {
      onSearch('');
    }
  };

  return (
    <Form onSubmit={handleSearch}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search notes by title, content, or keywords..."
          value={query}
          onChange={handleChange}
          className="search-bar"
        />
        <Button variant="primary" type="submit">
          <i className="bi bi-search"></i>
        </Button>
        {query && (
          <Button variant="outline-secondary" onClick={handleClear}>
            <i className="bi bi-x"></i>
          </Button>
        )}
      </InputGroup>
    </Form>
  );
};

export default SearchBar;