import PropTypes from "prop-types";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Button, Stack } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const UserReactions = ({ reactions, handleReaction }) => {
	const { likes, dislikes, myReaction } = reactions;

	const getIconColor = (type) => {
		if (myReaction === type) return "primary.main";
		return "text.disabled";
	};

	return (
		<Stack direction="row" spacing={2}>
			<Button
				variant="outlined"
				startIcon={<ThumbUpIcon sx={{ color: getIconColor("LIKE") }} />}
				onClick={() => handleReaction("LIKE")}
			>
				{likes}
			</Button>
			<Button
				variant="outlined"
				startIcon={<ThumbDownIcon sx={{ color: getIconColor("DISLIKE") }} />}
				onClick={() => handleReaction("DISLIKE")}
			>
				{dislikes}
			</Button>
		</Stack>
	);
};

UserReactions.propTypes = {
	reactions: PropTypes.shape({
		likes: PropTypes.number.isRequired,
		dislikes: PropTypes.number.isRequired,
		myReaction: PropTypes.string,
	}).isRequired,
	handleReaction: PropTypes.func.isRequired
};

export default UserReactions;
