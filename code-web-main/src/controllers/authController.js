const sql = require('mssql');
const bcrypt = require('bcryptjs'); 

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 3. Query the database to find the user by username
        const result = await sql.query`SELECT tennguoidung, matkhau FROM taikhoan WHERE tennguoidung = ${username}`;

        // Check if a user was found
        const user = result.recordset[0];

        // 4. User Not Found Check (Failure Point #1)
        if (!user) {
            // Use generic error message for security
            return res.status(401).json({ error: "Invalid username or password." });
        }


        const isMatch = (await bcrypt.compare(password, user.matkhau));

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // 6. SUCCESS: If user found and password matches
        // In production, you would generate a JWT or set a session cookie here.
        return res.status(200).json({ message: "Login successful!" });

    } catch (err) {
        console.error("Database or authentication error:", err.message);
        // 7. Internal Server Error
        return res.status(500).json({ error: "Internal server error during login." });
    }
};

exports.register = async (req, res) =>{
    const {username , password} = req.body;

    try{
        const result = await sql.query`SELECT * FROM taikhoan WHERE tennguoidung = ${username}`;

        if (result.recordset.length > 0){
            return res.status(501).json({error: "Name has already existed before"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        const insertquery = await sql.query`INSERT INTO taikhoan(tennguoidung,matkhau,trangthai,LevelID)
                                            Values(${username}, ${hashpassword}, 1, 2)`
        
        
        const request = await new sql.Request();

        await request.query(insertquery);

        return res.status(201).json({ message: 'Registration successful.' });
    }
    catch (error){
        console.error("Registration error:", error);
        return res.status(502).json({ message: 'Server error during registration.' });
    }
}