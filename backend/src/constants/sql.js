const REACTIONS_QUERY = `SELECT 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'LIKE') AS likes, 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'DISLIKE') AS dislikes`;

module.exports = { REACTIONS_QUERY };
