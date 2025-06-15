import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "../../pages/Login";
import WithAuth from "../HOC/WithAuth";
import Main from "../../pages/Main";
import Article from "../../pages/Article";
import ErrorPage from "../ErrorPage";
import EditArticle from "../../pages/EditArticle";
import Header from "../Header";
import CreateArticle from "../../pages/CreateArticle";

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
					exact
					path="/article/create"
					element={
						<WithAuth>
							<Header />
							<CreateArticle />
						</WithAuth>
					}
				/>
				<Route
					exact
					path="/article/edit/:id"
					element={
						<WithAuth>
							<Header />
							<EditArticle />
						</WithAuth>
					}
				/>
				<Route
					path="/article/:id"
					element={
						<WithAuth>
							<Article />
						</WithAuth>
					}
				/>
				<Route path="*" element={<ErrorPage status={404} />} />
			</Routes>
		</Router>
	);
};

export default App;
