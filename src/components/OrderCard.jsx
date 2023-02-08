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
    setOpen(false);
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
    const stall_id = "stall" + user.role[user.role.length - 1]
    updatedOrder.stall_order[stall_id].status = "cancelled"

    console.log("updating to ", updatedOrder.stall_order[stall_id].status);
    await updateDoc(docRef, updatedOrder);
    setOpen(false);
  }
  const { order } = props;

  function checkAvail(order) {
    const orderObj = order;
    const { menuList } = useMenu();

    for (let stall_order in orderObj.stall_order) {
      for (let itemId in orderObj.stall_order[stall_order].items_ordered) {
        if (menuList[stall_order][itemId].availability == false) {
          return false;
        }
      }
    }
    return true;
  }

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

  const { user } = useAuth()
  const rows = order;
  const rowObject = rows.stall_order["stall" + user.role[user.role.length - 1]]
  const stallId = "stall" + user.role[user.role.length - 1]
  const statusObj = {
    inprogress: "ready",
    ready: "served",

  }
  return (
    <Card sx={{ minWidth: 275 }} variant="outlined">
      <CardHeader
        sx={order.payment_status === "unpaid" || order.payment_status === "cancelled" ? unpaidstyleobject : paidstyleobject}
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
              disabled={rowObject.status === "served"}
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
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!checkAvail(order) ? (
                <Typography color="error">
                  Some Items in the Order Have Gone Out of Stock
                </Typography>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                if (rowObject.status === "inprogress") {

                  handleSubmit(order);
                } else if (rowObject.status === "ready") {

                  handleSubmitServed(order);
                }
              }}
              autoFocus
              disabled={!checkAvail(order)}
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
          <DialogTitle id="alert-dialog-title">{rowObject.status === "inprogress" ? "Is the Order Ready?" : rowObject.status === "ready" ? "Served to Customer" : ""}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!checkAvail(order) ? (
                <Typography color="error">
                  Some Items in the Order Have Gone Out of Stock
                </Typography>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancel}>Disagree</Button>
            <Button
              onClick={() => {
                handleCancel(order);
              }}
              autoFocus
              disabled={!checkAvail(order)}
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
