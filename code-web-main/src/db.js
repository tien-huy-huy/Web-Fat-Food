const sql = require("mssql");

const dbConfig = {
  user: "sa",               // tên user SQL
  password: "123456",            // mật khẩu
  server: "localhost",         // tên server (VD: localhost, . hoặc MSSQLSERVER)
  port : 1433,
  database: "tintuconline",            // database của bạn
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionCollation: "Vietnamese_CI_AS",
  },
};

const poolPromise = sql.connect(dbConfig);

module.exports = { sql, poolPromise };
