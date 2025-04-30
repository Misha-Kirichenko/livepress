import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "../../pages/Login";
import WithAuth from "../HOC/WithAuth";
import "./App.css";
import Main from "../../pages/Main";
import Article from "../../pages/Article";
import Header from "../Header";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					index
					path="/"
					element={
						<WithAuth>
							<Header />
							<Main />
						</WithAuth>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route
					path="/article/:id"
					element={
						<WithAuth>
							<Header />
							<Article />
						</WithAuth>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
