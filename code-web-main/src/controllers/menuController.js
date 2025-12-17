const sql = require('mssql');
exports.getAllMenuData = async (req, res) => {
    try {
        // Fetch ALL necessary product data from the database
        const productResult = await sql.query`SELECT * FROM product p JOIN ProdCategory c ON p.TypeProd = c.IDCate ORDER BY TypeProd`; 
        
        const products = productResult.recordset;

        // Group the products by their type for easier access on the frontend
        const groupedProducts = products.reduce((acc, product) => {
            const type = product.CateName.toLowerCase().replace(/\s/g, '_');
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(product);
            return acc;
        }, {});

        // Send the structured data to the frontend
        return res.status(200).json(groupedProducts);

    } catch (err) {
        console.error("Database error fetching all menu data:", err.message);
        return res.status(500).json({ error: "Could not retrieve menu data." });
    }
};