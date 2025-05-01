import PropTypes from "prop-types";
import AdminReactions from "./AdminReactions";
import UserReactions from "./UserReactions";

const Reactions = ({ role, reactions, isReactionsLoading, handleReaction }) => {
	if (role === "ADMIN") {
		return <AdminReactions reactions={reactions} />;
	}

	if (role === "USER") {
		return (
			<UserReactions
				reactions={reactions}
				handleReaction={handleReaction}
				isReactionsLoading={isReactionsLoading}
			/>
		);
	}
};

Reactions.propTypes = {
	role: PropTypes.string.isRequired,
	reactions: PropTypes.object.isRequired,
	handleReaction: PropTypes.func,
	isReactionsLoading: PropTypes.bool.isRequired,
};

export default Reactions;
