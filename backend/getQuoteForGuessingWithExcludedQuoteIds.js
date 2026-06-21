import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const pool = mysql.createPool({
  host     : process.env.host,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD, // jeśli masz
  database : process.env.MYSQL_DATABASE
}).promise();

export default async function getQuoteForGuessingWithExcludedQuoteIds(
  excludedQuoteIdsString,
  playerId
) {
  if (playerId == null) {
    playerId = 0
  }

  const excludedIds = excludedQuoteIdsString
    .split(",")
    .map(Number)
    .filter(Number.isInteger);

  console.log("[DEBUG] excludedIds:", excludedIds);
  console.log("[DEBUG] playerId:", playerId);

  const sql = `
    SELECT golden_quotes.quote_id, golden_quotes.quote
    FROM golden_quotes
    JOIN party_people ON golden_quotes.human_id = party_people.ID
    WHERE golden_quotes.is_public = 1
      AND golden_quotes.quote_id IS NOT NULL
      AND golden_quotes.quote_id NOT IN (?)
      AND party_people.ID <> ?
      AND party_people.klika_id NOT IN (15, 16)
    ORDER BY RAND()
    LIMIT 1;
  `;

  const [rows] = await pool.query(sql, [excludedIds, playerId]);

  console.log("[DEBUG] query result:", rows);

  return rows;
}


//getQuoteForGuessingWithExcludedQuoteIds("1,2,3", "13")