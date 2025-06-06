import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "../../pages/Login";
import WithAuth from "../HOC/WithAuth";
import Main from "../../pages/Main";
import Article from "../../pages/Article";
import NotFound from "../NotFound";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					index
					path="/"
					element={
						<WithAuth>
							<Main />
						</WithAuth>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route
					path="/article/:id"
					element={
						<WithAuth>
							<Article />
						</WithAuth>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default App;
