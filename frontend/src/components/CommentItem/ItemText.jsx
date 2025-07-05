import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import * as he from "he";
import { commentAuthorPropTypes } from "../../propTypes/commentAuthorPropTypes";

const ItemText = ({ text, author, userRole }) => {
	const blockReasonString = author.blockReason
		? `Author is blocked for: ${author.blockReason}`
		: "Author is blocked";

	const canSeeBlockedInfo = userRole === "ADMIN" && author.isBlocked;

	const styles = {
		whiteSpace: "pre-wrap",
		wordBreak: "break-word"
	};

	return (
		<Box>
			{canSeeBlockedInfo ? (
				<Typography
					variant="body2"
					color="error"
					fontWeight="bold"
					sx={{
						...styles,
						fontStyle: "italic"
					}}
				>
					{blockReasonString}
				</Typography>
			) : (
				<Typography variant="body1" sx={styles}>
					{he.decode(text)}
				</Typography>
			)}
		</Box>
	);
};

ItemText.propTypes = {
	text: PropTypes.string.isRequired,
	author: commentAuthorPropTypes,
	userRole: PropTypes.string.isRequired
};

export default ItemText;
