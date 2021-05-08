import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { ListItems } from "./drawerItems";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    listItem: {
        paddingLeft: '40px'
    }
}));

const LeftDrawer = () => {
    const classes = useStyles();
    const history = useHistory();
    const [active, setActive] = useState('Products')

    const handleItemClick = (item) => {
        setActive(item.title)
        history.push(item.path)
    }

    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <Toolbar />                    
                    <List>
                        {ListItems.map((item, index) => (
                            <ListItem onClick={() => handleItemClick(item)} button key={item.title} className={classes.listItem} selected={active === item.title}>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    )
}

export default LeftDrawer;