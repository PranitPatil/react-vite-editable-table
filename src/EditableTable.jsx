// EditableTable.js
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    TableSortLabel,
    Button,
    Tooltip
} from '@mui/material';
import { Edit, Save, Cancel, Delete, Add } from '@mui/icons-material';

const EditableTable = ({ initialColumns, initialRows, initialDisplayedColumns, alwaysSelectedColumns }) => {
    const [rows, setRows] = useState(initialRows);
    const [displayedColumns, setDisplayedColumns] = useState(initialDisplayedColumns);
    const [editIdx, setEditIdx] = useState(-1);
    const [editedRow, setEditedRow] = useState({ id: null });
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [searchTexts, setSearchTexts] = useState({});

    const isColumnAlwaysSelected = (columnField) => {
        return alwaysSelectedColumns.includes(columnField);
    };

    const startEditing = (idx) => {
        setEditIdx(idx);
        setEditedRow({ ...rows[idx] });
    };

    const stopEditing = () => {
        setEditIdx(-1);
        setEditedRow({ id: null });
    };

    const saveRow = (idx) => {
        const updatedRows = rows.map((row, index) =>
            index === idx ? editedRow : row
        );
        setRows(updatedRows);
        stopEditing();
    };

    const handleChange = (e) => {
        setEditedRow({
            ...editedRow,
            [e.target.name]: e.target.value,
        });
    };

    const handleColumnChange = (event) => {
        const value = event.target.value;
        setDisplayedColumns(value);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedRows = rows.slice().sort((a, b) => {
            if (a[property] < b[property]) {
                return isAsc ? -1 : 1;
            }
            if (a[property] > b[property]) {
                return isAsc ? 1 : -1;
            }
            return 0;
        });
        setRows(sortedRows);
    };

    const handleSearch = (column) => (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTexts({ ...searchTexts, [column]: value });
    };

    const addRow = () => {
        const newRow = { id: rows.length + 1, ...initialColumns.reduce((acc, column) => ({ ...acc, [column.field]: '' }), {}) };
        setRows([...rows, newRow]);
        startEditing(rows.length);
    };

    const deleteRow = (idx) => {
        const updatedRows = [...rows];
        updatedRows.splice(idx, 1);
        setRows(updatedRows);
    };

    const filteredRows = rows.filter(row => {
        for (let col of displayedColumns) {
            const searchText = searchTexts[col.field] || ''; // Ensure searchText is defined
            const cellValue = row[col.field];

            switch (typeof cellValue) {
                case 'number':
                case 'string':
                    if (searchText && cellValue && typeof cellValue === 'string' && !cellValue.toLowerCase().includes(searchText.toLowerCase())) {
                        return false;
                    }
                    break;
                case 'boolean':
                    if (searchText !== '') {
                        const searchActive = searchText.toLowerCase() === 'active';
                        if (cellValue !== searchActive) {
                            return false;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return true;
    });

    return (
        <div>

            <div>
                <FormControl variant="outlined" style={{ marginBottom: '16px', minWidth: 240 }}>
                    <InputLabel id="column-select-label">Select Columns</InputLabel>
                    <Select
                        labelId="column-select-label"
                        multiple
                        value={displayedColumns}
                        onChange={handleColumnChange}
                        renderValue={(selected) => selected.map(col => col.headerName).join(', ')}
                        label="Select Columns"
                    >
                        {initialColumns.map((column) => (
                            <MenuItem key={column.field} value={column} disabled={isColumnAlwaysSelected(column.field)}>
                                <Checkbox checked={displayedColumns.some(col => col.field === column.field)} />
                                <ListItemText primary={column.headerName} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div style={{ marginLeft: '10px', marginRight: '10px'}}>
                <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow >
                                <TableCell>#</TableCell>
                                <TableCell>Actions</TableCell>
                                {displayedColumns.map((col) => (
                                    <TableCell key={col.field} > 
                                        <TableSortLabel
                                            active={orderBy === col.field}
                                            direction={orderBy === col.field ? order : 'asc'}
                                            onClick={() => handleSort(col.field)}
                                        >
                                            {col.headerName}
                                        </TableSortLabel>
                                        <TextField
                                            id={col.field}
                                            label={`Search ${col.headerName}`}
                                            variant="outlined"
                                            onChange={handleSearch(col.field)}
                                            size="small"
                                            style={{ marginLeft: '8px', width: '150px' }}
                                        />
                                    </TableCell>
                                ))}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, idx) => (
                                <TableRow key={row.id}>
                                    <TableCell>{idx + 1}</TableCell> {/* Index */}
                                    <TableCell>
                                        {editIdx === idx ? (
                                            <>
                                                <Tooltip title="Save">
                                                    <IconButton onClick={() => saveRow(idx)}>
                                                        <Save />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel">
                                                    <IconButton onClick={stopEditing}>
                                                        <Cancel />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => startEditing(idx)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => deleteRow(idx)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                    {displayedColumns.map((col) => (
                                        <TableCell key={col.field} style={col.field === 'active' ? { backgroundColor: row[col.field] ? 'green' : 'red', color: 'white' } : {}}>

                                            {editIdx === idx ? (
                                                col.field === 'active' ? (
                                                    <Select
                                                        name="active"
                                                        value={editedRow.active || ''}
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={true}>Active</MenuItem>
                                                        <MenuItem value={false}>Inactive</MenuItem>
                                                    </Select>
                                                ) : (
                                                    <TextField
                                                        name={col.field}
                                                        value={editedRow[col.field] || ''}
                                                        onChange={handleChange}
                                                    />
                                                )
                                            ) : (
                                                col.field === 'active' ? (
                                                    row[col.field] ? 'Active' : 'Inactive'
                                                ) : (
                                                    row[col.field]
                                                )
                                            )}

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={addRow}
                style={{ margin: '16px' }}
            >
                Add Row
            </Button>
        </div>
    );
};

export default EditableTable;
