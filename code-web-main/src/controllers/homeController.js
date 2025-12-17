const sql = require('mssql');
exports.getAllMenuData = async (req, res) => {
    try {
        // Fetch ALL necessary product data from the database
        const productResult = await sql.query`SELECT * FROM product p JOIN ProdCategory c ON p.TypeProd = c.IDCate ORDER BY TypeProd`; 
                
                const products = productResult.recordset;
        
                const limit = 2;
        
                const pizzaItems = products.filter(p => p.TypeProd == "1" && p.Khuyenmai == 1).slice(0,limit);
        
                const gaItems = products.filter(p => p.TypeProd == "2" && p.Khuyenmai == 1).slice(0,limit);
        
                const promotedItems = [...pizzaItems, ...gaItems];

                return res.status(200).json(promotedItems);

    } catch (err) {
        console.error("Database error fetching all menu data:", err.message);
        return res.status(500).json({ error: "Could not retrieve menu data." });
    }
};