import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
} from '@material-ui/core'
import { MouseEvent, useState } from 'react'
import * as _ from 'lodash'

type OrderBy = [boolean, string]
type TableData = TableEntry[]
type TableEntry = any

export interface TableColumn {
  key: string
  label: string
  numeric: boolean
}

export const TableHeader: React.FunctionComponent<{
  orderBy: OrderBy
  columns: TableColumn[]
  onChangeOrderBy: (orderBy: OrderBy) => void
}> = ({ columns, onChangeOrderBy, orderBy: [orderDirection, orderKey] }) => {
  const onClickSort = (column: TableColumn) => (event: MouseEvent<HTMLElement>) => {
    onChangeOrderBy([orderKey === column.key ? !orderDirection : column.numeric, column.key])
  }

  const renderCell = (column: TableColumn) => {
    return (
      <TableCell key={column.key}>
        <TableSortLabel
          active={orderKey === column.key}
          direction={orderDirection ? 'asc' : 'desc'}
          onClick={onClickSort(column)}
        >
          {column.label}
        </TableSortLabel>
      </TableCell>
    )
  }

  return (
    <TableHead>
      <TableRow>{columns.map(column => renderCell(column))}</TableRow>
    </TableHead>
  )
}

export const SortableTableRow: React.FunctionComponent<{
  entry: TableEntry
  columns: TableColumn[]
  rowRenderer: (entry: TableEntry, column: TableColumn) => any
}> = ({ entry, columns, rowRenderer }) => {
  return (
    <TableRow>
      {columns.map(column => (
        <TableCell>{rowRenderer ? rowRenderer(entry, column) : entry[column.label]}</TableCell>
      ))}
    </TableRow>
  )
}

export const SortableTable: React.FunctionComponent<{
  defaultOrderBy: OrderBy
  data: TableData
  rowsPerPage: number
  columns: TableColumn[]
  rowRenderer: (entry: TableEntry, column: TableColumn) => any
  className?: string
}> = ({ data, columns, rowsPerPage, rowRenderer, className, defaultOrderBy }) => {
  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [page, setPage] = useState(0)

  const rows = _.orderBy(data, [orderBy[1]], [orderBy[0] ? 'desc' : 'asc']).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  return (
    <Table className={className}>
      <TableHeader orderBy={orderBy} onChangeOrderBy={setOrderBy} columns={columns} />
      <TableBody>
        {rows.map((entry: TableEntry, index: number) => (
          <SortableTableRow key={index} rowRenderer={rowRenderer} entry={entry} columns={columns} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={columns.length}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            rowsPerPageOptions={[]}
            onChangePage={(_event, newPage) => setPage(newPage)}
          />
        </TableRow>
      </TableFooter>
    </Table>
  )
}
