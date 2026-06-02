import dotenv from 'dotenv'
import mysql from 'mysql2'
import getHumanPhotoUrl from './getHumanPhotoUrl.js'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()


export default async function getCliques() {
    const cliquesAndHUmansQuery = `
        WITH all_interactions AS (
        SELECT pp.id AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name, v.visit_date AS interaction_date, ROUND(get_exponential_decay_fraction (v.visit_date, CURRENT_DATE(), 720), 3) * 6 AS points, cn.id AS clique_id, cn.clique_name
        FROM party_people pp
        JOIN cliques_names cn ON pp.klika_id = cn.id
        JOIN visit_guest vg ON pp.ID = vg.guest_id
        JOIN visits v ON vg.visit_id = v.visit_id
        UNION ALL
        SELECT pp.id AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name, m.meeting_date AS interaction_date, ROUND(get_exponential_decay_fraction (m.meeting_date, CURRENT_DATE(), 360), 3) * 3 AS points, cn.id AS clique_id, cn.clique_name
        FROM party_people pp
        JOIN cliques_names cn ON pp.klika_id = cn.id
        JOIN meeting_human mh ON pp.ID = mh.human_id
        JOIN meetings m ON mh.meeting_id = m.ID
        UNION ALL
        SELECT pp.id AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name, e.meLeavingDate AS interaction_date, ROUND(get_exponential_decay_fraction(e.meLeavingDate, CURRENT_DATE(), 180), 3) * 1 AS points, cn.id AS clique_id, cn.clique_name
        FROM party_people pp
        JOIN cliques_names cn ON pp.klika_id = cn.id
        JOIN event_companion ec ON ec.human_id = pp.ID
        JOIN events e ON e.id = ec.event_id
        UNION ALL
        SELECT pp.ID AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name, c.Date_stop AS interaction_date, ROUND(get_exponential_decay_fraction(c.Date_stop, CURRENT_DATE(), 3650), 3) * 3 AS points, cn.id AS clique_id, cn.clique_name
        FROM party_people pp
        JOIN cliques_names cn ON pp.klika_id = cn.id
        JOIN citybreak_companion cc ON pp.ID = cc.human_id
        JOIN citybreaks c ON cc.citybreak_id = c.ID
        UNION ALL
        SELECT pp.ID AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name
        , w.date AS interaction_date
        , CASE
            WHEN pp.klika_id != 5 THEN  ROUND(get_exponential_decay_fraction(w.date, CURRENT_DATE(), 3650), 3) * 15 
            ELSE ROUND(get_exponential_decay_fraction(w.date, CURRENT_DATE(), 3650), 3) * 3 
        END AS points, cn.id AS clique_id, cn.clique_name
        FROM party_people pp
        JOIN cliques_names cn ON pp.klika_id = cn.id
        JOIN weddings w ON w.man_id = pp.ID OR w.woman_id = pp.ID
        WHERE w.was_i_invited = 1

    ) 
    SELECT human_id, full_name AS human_name, clique_id, clique_name
    FROM all_interactions
    GROUP BY human_id, full_name
    ORDER BY SUM(points) DESC;`
    const [humansInCliquesReq] = await pool.query(cliquesAndHUmansQuery);
    const cliquesData = {};
    for (let human of humansInCliquesReq) {
        if (!cliquesData[human.clique_id]) {
            let cliqueToAdd = {
                "clique_id": human.clique_id,
                "clique_name": human.clique_name, 
                "clique_photo": `http://localhost:3000/clique-photo/${human.clique_id}`,
                "members": [{"human_name": human.human_name, "human_photo": getHumanPhotoUrl(human.human_id)}]
            }
            cliquesData[human.clique_id] = cliqueToAdd
        }
        else {
            cliquesData[human.clique_id]["members"].push({"human_name": human.human_name, "human_photo": getHumanPhotoUrl(human.human_id)})
        }
    }
    return Object.values(cliquesData)
}
