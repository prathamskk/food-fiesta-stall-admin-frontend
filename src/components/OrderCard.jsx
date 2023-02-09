import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import React, { useEffect, useState } from "react";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CollapsibleTable from "./OrderTable";
import { useMenu } from "../context/MenuContext";
import { getFirebase } from "../utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useAuth } from "../context/AuthContext";
const StallOrderCard = (props) => {
  const [open, setOpen] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleSubmit = async (order) => {
    const { firestore } = getFirebase();
    const docRef = doc(firestore, "orders", order.id);
    const updatedOrder = order;
    delete updatedOrder.id;
    const stall_id = "stall" + user.role[user.role.length - 1]
    if (order.stall_order[stall_id].status == "inprogress") {

      updatedOrder.stall_order[stall_id].status = "ready"
    }
    console.log("updating to ", updatedOrder.stall_order[stall_id].status);
    await updateDoc(docRef, updatedOrder);
    setOpen(false);
  };
  const handleSubmitServed = async (order) => {
    const { firestore } = getFirebase();
    const docRef = doc(firestore, "orders", order.id);
    const updatedOrder = order;
    delete updatedOrder.id;
    const stall_id = "stall" + user.role[user.role.length - 1]

    if (order.stall_order[stall_id].status == "ready") {
      updatedOrder.stall_order[stall_id].status = "served"
    }
    console.log("updating to ", updatedOrder.stall_order[stall_id].status);
    await updateDoc(docRef, updatedOrder);
    setOpen(false);
  };
  const handleCancel = async (order) => {
    const { firestore } = getFirebase();
    const docRef = doc(firestore, "orders", order.id);
    const updatedOrder = order;
    delete updatedOrder.id;
    updatedOrder.payment_status = "cancelled"
    const stall_id = "stall" + user.role[user.role.length - 1]
    updatedOrder.stall_order[stall_id].status = "cancelled"

    console.log("updating to ", updatedOrder.stall_order[stall_id].status);
    await updateDoc(docRef, updatedOrder);
    setOpen(false);
  }
  const { order } = props;


  const paidstyleobject = {
    bgcolor: "#d4edda",
    color: "#155724",
    textOverflow: "ellipsis",
  }

  const unpaidstyleobject = {
    bgcolor: "#f8d7da",
    color: "#721c24",
    textOverflow: "ellipsis",
  }

  const styleObj = {
    'inprogress': {
      bgcolor: "#fff3cd",
      color: "#856404",
      textOverflow: "ellipsis",
    },
    'ready': {
      bgcolor: "#d4edda",
      color: "#155724",
      textOverflow: "ellipsis",
    },
    'served': {
      bgcolor: "#cce5ff",
      color: "#004085",
      textOverflow: "ellipsis",
    },
    'cancelled': {
      bgcolor: "#f8d7da",
      color: "#721c24",
      textOverflow: "ellipsis",
    },
    'refunded': {
      bgcolor: "#e2e3e5",
      color: "#383d41",
      textOverflow: "ellipsis",
    }
  }

  const { user } = useAuth()
  const rows = order;
  const rowObject = rows.stall_order["stall" + user.role[user.role.length - 1]]
  const stallId = "stall" + user.role[user.role.length - 1]
  return (
    <Card sx={{ minWidth: 275 }} variant="outlined">
      <CardHeader
        sx={styleObj[rowObject.status]}
        title={
          <Stack justifyContent="flex-start" alignItems="flex-start">
            <Container maxWidth={false} disableGutters>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Button color="inherit">#{order.order_id}</Button>
                <Button color="inherit">{stallId}</Button>
                <Button color="inherit">{rowObject.status}</Button>
              </Stack>
            </Container>

            <Typography variant="body2">{order.user_info.name}</Typography>
            <Typography variant="caption">{order.user_info.email}</Typography>
          </Stack>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <CollapsibleTable rows={order} />
      </CardContent>
      <CardActions>
        <Container maxWidth={false} disableGutters>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Button
              onClick={handleClickOpen}
              variant="contained"
              disabled={rowObject.status === "served" || rowObject.status === "cancelled" || rowObject.status === "refunded"}
              color="secondary"
            >
              {rowObject.status === "inprogress" ? "ready" : "served"}
            </Button>
            <Button
              disabled={rowObject.status === "served" || rowObject.status === "cancelled" || rowObject.status === "refunded"}
              onClick={handleClickOpenCancel}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </Stack>
        </Container>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{rowObject.status === "inprogress" ? "Is the Order Ready?" : rowObject.status === "ready" ? "Served to Customer?" : ""}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={async () => {
                if (rowObject.status === "inprogress") {

                  await handleSubmit(order);
                } else if (rowObject.status === "ready") {

                  await handleSubmitServed(order);
                }
                handleClose()
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openCancel}
          onClose={handleCloseCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are You Sure You Wish To Cancel Order?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseCancel}>Disagree</Button>
            <Button
              onClick={() => {
                handleCancel(order);
                setOpenCancel(false)
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default StallOrderCard;
