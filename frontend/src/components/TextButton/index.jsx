import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const TextButton = ({ text, action, disabled = false }) => (
	<Button variant="outlined" onClick={action} disabled={disabled}>
		{text}
	</Button>
);

TextButton.propTypes = {
	text: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

export default TextButton;
