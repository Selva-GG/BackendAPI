import Pool from "pg";

export default new Pool.Pool({
  user: "postgres",
  host: "localhost",
  database: "userdb",
  password: "",
  port: 5432,
});
