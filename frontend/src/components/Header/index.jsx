import { Box } from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const Header = () => {
	const { userData, isLoading } = useContext(AuthContext);

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "flex-end",
				cursor: "pointer",
				height: "70px"
			}}
		>
			<Box
				sx={{
					width: "35%",
					display: "flex",
					height: "100px",
					justifyContent: "flex-end"
				}}
			>
				{isLoading ? (
					"loading..."
				) : (
					<>
						<Box sx={{ paddingTop: "15px", display: "flex" }}>
							<span>
								<NotificationsRoundedIcon />
							</span>
							<span>{`${userData.name[0]}.${userData.surname[0]}`}</span>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default Header;
