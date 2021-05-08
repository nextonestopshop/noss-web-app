import { Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

import Header from "../../common/components/header";
import LeftDrawer from "../../common/components/left-drawer";
import ProductListComponent from "./products/list";
import AddProductComponent from "./products/add";
import CategoryListComponent from "./category/list";
import AddCategoryComponent from "./category/add";
import BlogListComponent from "./blogs/list";

import './index.css';

const useStyles = makeStyles((theme) => ({
    adminContainer: {
        marginLeft: '240px',
        padding: '20px'
    }
}));

function AdminComponent({match}) {
    const classes = useStyles();

    return (
        <>
            <Header />
            <LeftDrawer />
            <div className={classes.adminContainer}>
                <Toolbar />
                <>
                    <Route exact path={`${match.path}`} render={() => (<Redirect to={`${match.path}/product-list`} />)}/>
                    <Route exact path={`${match.path}/product-list`} component={ProductListComponent}/>
                    <Route exact path={`${match.path}/product`} component={AddProductComponent}/>
                    <Route exact path={`${match.path}/category-list`} component={CategoryListComponent}/>
                    <Route exact path={`${match.path}/category`} component={AddCategoryComponent}/>
                    <Route exact path={`${match.path}/blog-list`} component={BlogListComponent}/>
                </>
            </div>
        </>
  );
}

export default AdminComponent;
