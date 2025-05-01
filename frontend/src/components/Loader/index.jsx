import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { LOADER_URL } from "../../constants";

const Loader = ({ align, type, width, height }) => {
	if (type === "block") {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: align
				}}
			>
				<Box sx={{ width, height }}>
					<img
						src={LOADER_URL}
						alt="loader"
						style={{ width: "100%", height: "auto" }}
					/>
				</Box>
			</Box>
		);
	}

	if (type === "inline") {
		return (
			<Box component="span">
				<img src={LOADER_URL} alt="loader" style={{ width, height }} />
			</Box>
		);
	}
};

Loader.propTypes = {
	align: PropTypes.string,
	type: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string
};

export default Loader;
