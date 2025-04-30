import PropTypes from "prop-types";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Stack, Typography } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const AdminReactions = ({ reactions }) => {
    
	const { likes, dislikes } = reactions;

	return (
		<Stack direction="row" spacing={2}>
			<Stack direction="row" alignItems="center" spacing={0.5}>
				<ThumbUpIcon sx={{ color: "text.disabled" }} />
				<Typography variant="body2" color="text.disabled">
					{likes}
				</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={0.5}>
				<ThumbDownIcon sx={{ color: "text.disabled" }} />
				<Typography variant="body2" color="text.disabled">
					{dislikes}
				</Typography>
			</Stack>
		</Stack>
	);
};

AdminReactions.propTypes = {
	reactions: PropTypes.shape({
		likes: PropTypes.number.isRequired,
		dislikes: PropTypes.number.isRequired,
		myReaction: PropTypes.string
	}).isRequired
};

export default AdminReactions;
