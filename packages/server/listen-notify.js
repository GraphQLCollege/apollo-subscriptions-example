// Listen-notify example
const { Pool } = require("pg");
const pool = new Pool();

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

(async () => {
  const client = await pool.connect();
  client.on("notification", async msg => {
    console.log(msg.channel);
    if (msg.payload && typeof msg.payload === "string") {
      console.log("Payload: ", JSON.parse(msg.payload));
    } else {
      console.log("Payload: null");
    }
  });
  try {
    await client.query("LISTEN books");
    const book = JSON.stringify({
      id: 1,
      title: "A Song of Ice and Fire: A Game of Thrones",
      author: "George R.R. Martin"
    });
    await client.query(`NOTIFY books`);
    await client.query(`NOTIFY books, ${client.escapeLiteral(book)}`);
  } finally {
    client.release();
  }
})().catch(e => console.log(e.stack));
