const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const sql = require('mssql');
const sqlConfig = require('./db');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], 
    scriptSrc: ["'self'","'unsafe-inline'"],
    scriptSrcAttr: ["'unsafe-inline'"],
    connectSrc : ["'self'"]
  },
}));

async function initializeDatabase() {
    try {
        await sql.connect(sqlConfig); // 2. EXECUTE the connection
        console.log("Database connection pool established.");
    } catch (err) {
        console.error("FATAL ERROR: Database connection failed.", err);
        // Exit the application if the DB connection fails to prevent issues
        process.exit(1); 
    }
}

// 3. CALL the connection function before starting the server
initializeDatabase().then(() => {
    // 4. Start the Express server only after the database is ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// let express read JSON requests
app.use(express.json());

// serve your UI
app.use('/', express.static(path.join(__dirname, "../html-css-js")));

app.get("/", (req, res) => {
    return res.redirect('/home/home.html');
}); 


// routes (login / menu / orders)
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const menuRoutes = require("./routes/menu");
const adminRoutes = require("./routes/admin");
const { connect } = require("http2");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
