import { async } from '@firebase/util';
import { Box, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useAuth } from "../context/AuthContext";
import { useMenu } from '../context/MenuContext';
import { getFirebase } from '../utils/firebaseConfig';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow:"scroll",
    height:  "220px"
};


const MenuToggle = () => {
    const { menuList } = useMenu()
    const { user } = useAuth()
    const stallID = user.role

    const handleChange = async (event) => {
        const { firestore } = getFirebase();
        const docRef = doc(firestore, "menu", "menu_items");
        console.log(menuList[stallID]);
        const itemID = event.target.value
        const checked = event.target.checked
        console.log(itemID);
        console.log(checked);
        const newMenu = menuList;
        newMenu[stallID][itemID]['availability'] = checked
        await updateDoc(docRef, newMenu);

    }
    return (
        <Box sx={style}>

            <Typography id="modal-modal-title" variant="h6" component="h2">
                Availabilty Switch
            </Typography>
            <FormGroup>
                {Object.keys(menuList[stallID]).map((itemID, keys) => {
                    return (
                        <FormControlLabel key={keys} control={<Switch checked={menuList[stallID][itemID].availability} value={itemID} onChange={handleChange} />} label={menuList[stallID][itemID].name} />
                    )
                })}
            </FormGroup>

        </Box>
    )
}

export default MenuToggle