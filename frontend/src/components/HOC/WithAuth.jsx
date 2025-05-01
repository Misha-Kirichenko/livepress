import PropTypes from "prop-types";
import AuthContext from "../../contexts/AuthContext";
import useAuth from "../../hooks/useAuth";
import Loader from "../Loader";

const WithAuth = ({ children }) => {
	// This component is a Higher Order Component (HOC) that provides authentication context to its children.
	//Navigate to the login page if the user is not authenticated is written in the useAuth hook.

	const { userData, isLoading } = useAuth();
	if (isLoading)
		return <Loader type="block" width="25px" height="25px" align="flex-end" />;

	return (
		<AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
	);
};

WithAuth.propTypes = {
	children: PropTypes.node.isRequired
};

export default WithAuth;
