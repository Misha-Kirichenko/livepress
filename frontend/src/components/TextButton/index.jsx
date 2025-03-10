import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const TextButton = ({ text, action }) => (
	<Button variant="outlined" onClick={action}>
		{text}
	</Button>
);

TextButton.propTypes = {
	text: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired
};

export default TextButton;
