import { useContext } from "react";
import AdminContent from "../../components/AdminContent";
import UserContent from "../../components/UserContent";
import AuthContext from "../../contexts/AuthContext";

const Main = () => {
	const { role } = useContext(AuthContext);

	return (
		<>
			{(role === "ADMIN" && <AdminContent />) ||
				(role === "USER" && <UserContent />)}
		</>
	);
};

export default Main;
