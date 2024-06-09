import React from "react";
import EditableTable from './EditableTable';


const columns = [
  { field: 'active', headerName: 'Active' },
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age' },
  { field: 'email', headerName: 'Email' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'address', headerName: 'Address' },
  { field: 'city', headerName: 'City' },
  { field: 'state', headerName: 'State' },
  { field: 'zip', headerName: 'ZIP Code' },
];

const rows = [
  { id: 1, name: 'John Doe', age: 28, email: 'john@example.com', phone: '123-456-7890', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', active: true },
  { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com', phone: '987-654-3210', address: '456 Oak St', city: 'Los Angeles', state: 'CA', zip: '90001', active: false },
  { id: 3, name: 'Albert Johnson', age: 45, email: 'albert@example.com', phone: '555-555-5555', address: '789 Pine St', city: 'Chicago', state: 'IL', zip: '60601', active: true },
];

const initialDisplayedColumns = [
  
  { field: 'active', headerName: 'Active' },
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age' },
  { field: 'email', headerName: 'Email' },
];

const alwaysSelectedColumns = ['active', 'name'];

const App = () => {
  return (
    <div>
      <h1>Editable Table Example</h1>
      <EditableTable 
      initialColumns={columns} 
      initialRows={rows} 
      initialDisplayedColumns={initialDisplayedColumns} 
      alwaysSelectedColumns={alwaysSelectedColumns}
      />
    </div>
  );
};

export default App;
