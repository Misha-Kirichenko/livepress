import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextButton from "../TextButton";
import { Box } from "@mui/material";
import { DEFAULT_IMG_URL } from "../../constants";

const Article = ({ articleData }) => {
	const navigate = useNavigate();
	const { id, title, category, author, img, createDate } = articleData;
	const [[firstNameInit], [lastNameInit]] = author.split(" ");

	const date = new Date(Number(createDate));

	const formattedDate = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});

	return (
		<Card sx={{ maxWidth: 345, width: "100%" }}>
			<CardHeader
				avatar={
					<Avatar aria-label="author">{`${firstNameInit}.${lastNameInit}`}</Avatar>
				}
				title={title}
				subheader={formattedDate}
			/>
			<CardMedia
				component="img"
				height="194"
				image={img || DEFAULT_IMG_URL}
				alt={title}
			/>
			<CardContent>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1
					}}
				>
					<Typography variant="body1" fontWeight="bold">
						Category:
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{category}
						{Object.prototype.hasOwnProperty.call(
							articleData,
							"subOnCategory"
						) &&
							!articleData.subOnCategory && <sup>&nbsp;not subscibed</sup>}
					</Typography>
					<Box style={{ marginLeft: "auto" }}>
						<TextButton text="read" action={() => navigate(`/article/${id}`)} />
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

Article.propTypes = {
	articleData: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		author: PropTypes.string.isRequired,
		img: PropTypes.string,
		subOnCategory: PropTypes.bool,
		createDate: PropTypes.string
	})
};

export default Article;
