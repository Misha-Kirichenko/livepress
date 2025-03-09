import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "../../pages/Login";
import WithAuth from "../HOC/WithAuth";
import "./App.css";
import Main from "../../pages/Main";

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
			</Routes>
		</Router>
	);
};

export default App;
