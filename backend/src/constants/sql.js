const REACTIONS_QUERY = `SELECT 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'LIKE') AS likes, 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'DISLIKE') AS dislikes`;

const USER_ASSOC_ARTICLE_QUERY = `SELECT 
			EXISTS (SELECT 1 FROM articles WHERE id = :article_id) AS exist`;

module.exports = { REACTIONS_QUERY, USER_ASSOC_ARTICLE_QUERY };
