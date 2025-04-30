import PropTypes from "prop-types";
import AdminReactions from "./AdminReactions";
import UserReactions from "./UserReactions";

const Reactions = ({ role, reactions }) => {
	if (role === "ADMIN") {
		return <AdminReactions reactions={reactions} />;
	}

	if (role === "USER") {
		return <UserReactions reactions={reactions} />;
	}
};

Reactions.propTypes = {
	role: PropTypes.string.isRequired,
	reactions: PropTypes.object.isRequired
};

export default Reactions;
