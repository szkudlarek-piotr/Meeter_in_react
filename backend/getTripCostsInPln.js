import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getTripCostsInPln(trip_id) {
    const reqText = `
        SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, currency, SUM(ROUND(cost / number_of_people, 2)) AS cost_per_person 
        FROM trip_expenses
        WHERE trip_id = ?
        GROUP BY currency, date;
    `
    const [reqResult] = await pool.query(reqText, [trip_id])
    let trip_cost = 0.0;
    for (let expense of reqResult) {
        if (expense.currency === "PLN") {
            trip_cost += expense.cost_per_person;
        }
        else {
            const currency = expense.currency
            const [y, m, d] = expense.date.split("-");
            
            const checkedDate = new Date(y, m-1, d)
            const weekday = checkedDate.getDay()
            
            if (weekday === 0) {       // niedziela
                checkedDate.setDate(checkedDate.getDate() - 2);
            }
            else if (weekday === 6) {  // sobota
                checkedDate.setDate(checkedDate.getDate() - 1);
            }

            let ratioJson = null;
            let midRate = null;
            while (true) {
                let formattedDate = checkedDate.toISOString().slice(0, 10);
                const ratioReq = await fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currency}/${formattedDate}/?format=json`)
                
                try {
                    ratioJson = await ratioReq.json()
                    midRate = ratioJson["rates"][0]["mid"]
                    break
                }
                catch {
                    console.log(`Nie udało sie pobrać danych z ${formattedDate}  z adresu https://api.nbp.pl/api/exchangerates/rates/a/${currency}/${formattedDate}/?format=json.`)
                    checkedDate.setDate(checkedDate.getDate() - 1);
                }
            }

            trip_cost += Math.round(midRate * expense.cost_per_person, 2)
        }
    }
    console.log(trip_cost)
    return trip_cost
}