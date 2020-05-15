import Table, { TableProps } from './Table';
import { Cell, Column, HeaderCell } from 'rsuite-table';
import TablePagination, { TablePaginationProps } from './TablePagination';

Table.Column = Column;
Table.Cell = Cell;
Table.HeaderCell = HeaderCell;
Table.Pagination = TablePagination;

export default Table;
export { TableProps, TablePaginationProps };
export { TableColumnProps } from './TableColumn';
export { TableCellProps } from './TableCell.d';
