import React, { useState, useEffect } from 'react'

const ListUser = () => {
  const [user, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/listuser`);
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter users based on search query
  const filteredUsers = user.filter(item => {
    return (item.firstName.toLowerCase().includes(query.toLowerCase()) || item.lastName.toLowerCase().includes(query.toLowerCase()) || item.email.toLowerCase().includes(query.toLowerCase()));
  });

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredUsers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Generate table rows
  const myList = currentItems.map((item) => {
    return (
      <tr key={item.id} style={{  padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
        {item.image !== "" ?
          <td style={{ padding: "8px",display:"flex",justifyContent:"center" }}><img style={{ width: "5vw", height: "5vh" }} src={item.image}></img></td>
          : <td style={{ padding: "8px" ,display:"flex",justifyContent:"center"}}><img style={{ width: "5vw", height: "5vh" }} src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"></img></td>
        }
        <td>{item.firstName} {item.lastName}</td>
        <td>{item.email}</td>
      </tr>
    )
  });

  return (
    <div className="search" style={{backgroundColor:"white"}}>
      <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 10px 0",}}>
        <label>Tìm kiếm:</label>
        <input style={{border:"1px solid black",borderRadius:"5px",textAlign:"center"}} type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <table style={{ border: "1px solid black", width: "100%", backgroundColor: "white", height: "100%" }}>
        <thead>
          <tr style={{ padding: "8px", textAlign: "center", border: "1px solid black" }}>
            <th style={{ width: "10%" }}>Ảnh đại diện</th>
            <th style={{ width: "20%" }}>Họ và tên</th>
            <th style={{ width: "20%" }}>Email</th>
            
          </tr>
        </thead>
        <tbody>
          {myList}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ margin: "10px 50px 0 0", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        {pageNumbers.map(number => (
          <button style={{ width: "50px", marginBottom: "5px", marginLeft: "5px", fontSize: "16",fontWeight:"bold", backgroundColor: "rgb(242, 242, 242)", border: "none", color: "#333", cursor: "pointer" }} key={number} onClick={() => setCurrentPage(number)}>{number}</button>
        ))}
      </div>
    </div>
  );
}

export default ListUser;
