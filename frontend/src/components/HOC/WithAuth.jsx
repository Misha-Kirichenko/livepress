import PropTypes from "prop-types";
import AuthContext from "../../contexts/AuthContext";
import useAuth from "../../hooks/useAuth";

const WithAuth = ({ children }) => {
	const { userData, isLoading } = useAuth();
	if (isLoading) return "loading...";

	return (
		<AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
	);
};

WithAuth.propTypes = {
	children: PropTypes.node.isRequired
};

export default WithAuth;
