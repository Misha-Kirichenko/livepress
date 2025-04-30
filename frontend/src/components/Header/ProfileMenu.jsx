import { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import AuthService from "../../api/authService";

const ProfileMenu = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		AuthService.clearTokens();
		navigate("/login");
	};

	return (
		<div>
			<Button
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<ArrowDropDownIcon />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button"
				}}
			>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
		</div>
	);
};

export default ProfileMenu;
