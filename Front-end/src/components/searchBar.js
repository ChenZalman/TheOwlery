import React,{useState} from 'react'

function SearchBar(props) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const items = props.items
  const onClickAction = props.onClickAction

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredItems([]);
      props.onEmpty()
    } else {
      const results = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(results);
    }
  };

  const handleSelectItem = (item) => {
    setQuery(item);
    setFilteredItems([]);
    onClickAction(item)
  };

  return (
    <div style={{ position: "relative", width: "250px" }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for users/posts/groups"
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {filteredItems.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "4px 0",
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectItem(item)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar
