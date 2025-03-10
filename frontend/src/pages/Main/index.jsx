import AdminContent from "../../components/AdminContent";
import Header from "../../components/Header";
import UserContent from "../../components/UserContent";
import AuthContext from "../../contexts/AuthContext";
import useAuth from "../../hooks/useAuth";

const Main = () => {
	const authData = useAuth();
	const { userData } = authData;

	if (!userData) return "loading...";
	const { role } = userData;
	return (
		<AuthContext.Provider value={authData}>
			<Header />
			{(role === "ADMIN" && <AdminContent />) ||
				(role === "USER" && <UserContent />)}
		</AuthContext.Provider>
	);
};

export default Main;
