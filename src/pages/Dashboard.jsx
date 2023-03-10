import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/system";
import {
  Card,
  Typography,
  CardActions,
  CardContent,
  Button,
  Grid,
  Container,
  CardHeader,
  IconButton,
  Stack,
  AppBar,
  Toolbar,
  Avatar,
  Popover,
  Modal,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import { streamOrders, getFirebase } from "../utils/firebaseConfig";
import { query, orderBy, startAt, onSnapshot, collection, where, limit, getDocs } from "firebase/firestore";
import MenuToggle from "../components/MenuToggle";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { useMenu } from "../context/MenuContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CollapsibleTable from "../components/OrderTable";
import StallOrderCard from "../components/OrderCard";
import { useAuth } from "../context/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { md: 3 }, py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const { handleSignOut } = useAuth();
  const [details, setDetails] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    if (searchValue?.length !== 6) {
      return;
    }
    const { streamSearch } = streamOrders();

    const unsub = streamSearch(searchValue, (orders) => {
      setSearchOrders(orders);
    });

    return () => unsub();
  }, [searchValue]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const { menuList } = useMenu();
  const [orders, setOrders] = useState([]);
  const [readyorders, setreadyOrders] = useState([]);
  const [servedorders, setservedOrders] = useState([]);
  const [cancelledorders, setcancelledOrders] = useState([]);
  const [refundedorders, setrefundedOrders] = useState([]);
  const [searchOrders, setSearchOrders] = useState([]);

  const { user } = useAuth()
  useEffect(() => {



    const ORDERS_COLLECTION_ID = "orders";
    const { firestore, auth } = getFirebase();

    const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
    console.log(user)

    // const qtest = query(
    //   orderCol,
    //   orderBy("stall_order." + user.role + ".status"),
    // );

    // getDocs(qtest).then(
    //   querySnapshot => {
    //     const orderss = querySnapshot.docs.map((doc) => {
    //       return {
    //         id: doc.id,
    //         ...doc.data(),
    //       };
    //     });
    //     console.log(orderss);
    //   }
    // );
    const q = query(
      orderCol,
      where("stall_order." + user.role + ".status", "==", "inprogress"),
      orderBy("order_placed_timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersreceived = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setOrders(ordersreceived);
    });


    return () => unsub();
  }, []);
  useEffect(() => {

    const ORDERS_COLLECTION_ID = "orders";
    const { firestore, auth } = getFirebase();

    const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
    console.log(user)

    const q = query(
      orderCol,
      where("stall_order." + user.role + ".status", "==", "ready"),
      orderBy("order_placed_timestamp", "asc"),
      limit(15)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersreceived = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setreadyOrders(ordersreceived);
    });
    //TODO: UPDATES SECURITY RULES


    return () => unsub();
  }, []);
  useEffect(() => {

    const ORDERS_COLLECTION_ID = "orders";
    const { firestore, auth } = getFirebase();

    const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
    console.log(user)

    const q = query(
      orderCol,
      where("stall_order." + user.role + ".status", "==", "served"),
      orderBy("order_placed_timestamp", "asc"),
      limit(15)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersreceived = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log(ordersreceived);

      setservedOrders(ordersreceived);
    });
    //TODO: UPDATES SECURITY RULES


    return () => unsub();
  }, []);
  useEffect(() => {

    const ORDERS_COLLECTION_ID = "orders";
    const { firestore, auth } = getFirebase();

    const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
    console.log(user)

    const q = query(
      orderCol,
      where("stall_order." + user.role + ".status", "==", "cancelled"),
      orderBy("order_placed_timestamp", "asc"),
      limit(15)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersreceived = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log(ordersreceived);

      setcancelledOrders(ordersreceived);
    });


    return () => unsub();
  }, []);
  useEffect(() => {

    const ORDERS_COLLECTION_ID = "orders";
    const { firestore, auth } = getFirebase();

    const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
    console.log(user)

    const q = query(
      orderCol,
      where("stall_order." + user.role + ".status", "==", "refunded"),
      orderBy("order_placed_timestamp", "asc"),
      limit(15)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const ordersreceived = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log(ordersreceived);

      setrefundedOrders(ordersreceived);
    });


    return () => unsub();
  }, []);

  const theme = useTheme();
  const [value, setValue] = React.useState(0);


  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <EMobiledataIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stall Admin App
          </Typography>
          <SearchBar
            handleChangeIndex={handleChangeIndex}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Stack direction="row" spacing={2}>
            <Button id="profile-button-bruh" variant="contained" color="secondary" onClick={handleOpenModal}>
              Menu
            </Button>
            <Button id="profile-button" onClick={handleClick}>
              <Avatar src={user?.photoURL}>{user?.displayName[0]}</Avatar>
            </Button>
          </Stack>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{
              position: 'absolute',
              overflow: 'scroll',
              height: '100%',
              display: 'block',
            }}>
              <MenuToggle />
          </Modal>
          <Popover
            anchorEl={anchor}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar src={user?.photoURL}>{user?.displayName[0]}</Avatar>
                }
                title={user?.displayName}
                subheader={user?.email}
              />
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Button onClick={handleSignOut}>Logout</Button>
              </Box>
            </Card>
          </Popover>
        </Toolbar>
      </AppBar>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        // variant="fullWidth"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="full width tabs example"
      >
        <Tab label="Search" {...a11yProps(0)} />
        <Tab label="Inprogress" {...a11yProps(1)} />
        <Tab label="Ready" {...a11yProps(2)} />
        <Tab label="Served" {...a11yProps(3)} />
        <Tab label="Cancelled" {...a11yProps(4)} />
        <Tab label="Refunded" {...a11yProps(5)} />
      </Tabs>

      <TabPanel value={value} index={0} dir={theme.direction}>
        {searchOrders.map((order, index) => {
          return (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <StallOrderCard order={order} />
            </Grid>
          );
        })}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {orders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <StallOrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {readyorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <StallOrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {servedorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <StallOrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {cancelledorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <StallOrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={5} dir={theme.direction}>
        <Grid
          container
          spacing={{ xs: 2 }}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        >
          {refundedorders.map((order, index) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <StallOrderCard order={order} />
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
