import PropTypes from "prop-types";

export const commentAuthorPropTypes = PropTypes.shape({
	isBlocked: PropTypes.bool.isRequired,
	blockReason: PropTypes.string,
	name: PropTypes.string,
	surname: PropTypes.string,
	nickName: PropTypes.string
}).isRequired;
