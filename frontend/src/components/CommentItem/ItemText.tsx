import { Box, Typography } from "@mui/material";
import * as he from "he";

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

export default ItemText;
