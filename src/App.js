import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';

import HomeComponent from './pages/home'
import LoginComponent from './pages/login'
import AdminComponent from './pages/admin'
import ProductDetailComponent from './pages/admin/products/detail'
	
import './App.css';

function App() {
	return (
		<AuthProvider>
			<Router>
				<div>
					<Switch>
						<Route exact path="/" component={HomeComponent}/>
						<Route exact path="/login" component={LoginComponent}/>
						<PrivateRoute path="/admin" component={AdminComponent}/>
						<Route exact path="/product/:id" component={ProductDetailComponent}/>
					</Switch>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
