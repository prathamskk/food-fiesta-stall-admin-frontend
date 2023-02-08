// import * as React  from 'react';
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Row(props) {
  const { row, stallNo, subtotal } = props;
  const [open, setOpen] = useState(true);
  return (
    <>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Desc</TableCell>
                    <TableCell>Qty.</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Sum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(row.items_ordered).map((itemRow, index) => {
                    const items = row.items_ordered[itemRow];
                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {items.name}
                        </TableCell>
                        <TableCell>{items.qty}</TableCell>
                        <TableCell align="right">{items.price}</TableCell>
                        <TableCell align="right">
                          {items.price * items.qty}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function createTotalObj(rows) {
  const totalObj = {};
  let Total = 0;
  for (let stallid in rows.stall_order) {
    let subtotal = 0;
    for (let itemid in rows.stall_order[stallid]["items_ordered"]) {
      subtotal +=
        rows.stall_order[stallid]["items_ordered"][itemid].price *
        rows.stall_order[stallid]["items_ordered"][itemid].qty;
    }

    totalObj[stallid] = subtotal;
    Total += subtotal;
  }
  return {
    Total: Total,
    subTotalObj: totalObj,
  };
}

export default function CollapsibleTable(props) {

  const { user } = useAuth()
  const { rows } = props;
  const rowObject = rows.stall_order["stall" + user.role[user.role.length - 1]]
  const row = "stall" + user.role[user.role.length - 1]
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableBody>
          <Row
            key={row}
            stallNo={row}
            row={rowObject}
            subtotal={createTotalObj(rows)}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
