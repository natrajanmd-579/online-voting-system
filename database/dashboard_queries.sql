-- 1. Get Dashboard Summary Totals
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM candidates) AS total_candidates,
    (SELECT COUNT(*) FROM elections) AS total_elections,
    (SELECT COUNT(*) FROM votes) AS total_votes,
    (SELECT COUNT(*) FROM elections WHERE status = 'active') AS active_elections,
    (SELECT COUNT(*) FROM elections WHERE status = 'completed') AS completed_elections;

-- 2. Get Live Vote Counts and Percentages for a Specific Election
SELECT 
    c.id AS candidate_id,
    c.name AS candidate_name,
    c.party,
    COUNT(v.id) AS total_votes,
    ROUND(
        (COUNT(v.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM votes WHERE election_id = c.election_id), 0)), 2
    ) AS vote_percentage
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
WHERE c.election_id = ?
GROUP BY c.id, c.name, c.party
ORDER BY total_votes DESC;

-- 3. Winner Detection for an Election
SELECT 
    c.id AS candidate_id,
    c.name AS candidate_name,
    c.party,
    COUNT(v.id) AS winning_votes
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
WHERE c.election_id = ?
GROUP BY c.id, c.name, c.party
ORDER BY winning_votes DESC
LIMIT 1;