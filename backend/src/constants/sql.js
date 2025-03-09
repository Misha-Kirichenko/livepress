const REACTIONS_QUERY = `SELECT 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'LIKE') AS likes, 
			(SELECT COUNT(id) FROM reactions WHERE article_id = :id AND reaction = 'DISLIKE') AS dislikes`;

const USER_ASSOC_ARTICLE_QUERY = `SELECT 
			EXISTS (SELECT 1 FROM articles WHERE id = :article_id) AS exist,
			EXISTS (
				SELECT 1 FROM articles 
				WHERE id = :article_id 
				AND category_id IN (
					SELECT category_id FROM user_categories WHERE user_id = :user_id
				)
			) AS "isInUserSubs"`;

module.exports = { REACTIONS_QUERY, USER_ASSOC_ARTICLE_QUERY };
