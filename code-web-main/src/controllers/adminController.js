const sql = require('mssql');

exports.getAllMenuData = async (req,res) => {
    try{
        const menu = await sql.query`SELECT * FROM product p JOIN ProdCategory c ON p.TypeProd = c.IDCate ORDER BY IDProd`;

        const menulist = menu.recordset;

        const list = {menulist};

        const groupedmenu = menulist.reduce((acc,product) => {
            const type = product.CateName.toLowerCase().replace(/\s/g, '_');

            if(!acc[type]){
                acc[type] = [];
            }
            acc[type].push(product);
            return acc;
        },{})

        return res.status(200).json(list);
    }
    catch(err){
        console.error("Database error fetching all menu data:", err.message);
        return res.status(501).json({ error: "Could not retrieve menu data." });
    }
}

exports.getAllCateData = async (req,res) => {
    try{
        const cateprod = await sql.query`SELECT * FROM ProdCategory ORDER BY IDCate`;

        const result = cateprod.recordset;

        return res.status(200).json(result);
    }
    catch(err){
        console.error("Database error fetching all Category data:", err.message);
        return res.status(500).json({ error: "Could not retrieve Category data." });
    }
}

exports.edit = async (req,res) =>{
    try{
        const {type, ...array} = req.body;

        const params = array.params

        if (type == 'category'){
            console.log(`${params.id}`);
            const consql = await sql.query`SELECT * FROM ProdCategory WHERE IDCate = ${params.id}`
            const result = consql.recordset;
            console.log(result);
            if (!result){
                return res.status(401).json({ error: "The Item doesn't exist." });
            }

            const updatesql = await sql.query`UPDATE ProdCategory SET CateName = ${params.name} WHERE IDCate = ${params.id}`

            const request = await new sql.Request();
            
            await request.query(updatesql);

            return res.status(201).json({ message: 'Update Successful' });
        }
        else if (type == 'food'){
            const consql = await sql.query`SELECT * FROM product WHERE IDProd = ${params.id}`
            const result = consql.recordset;
            console.log(result);
            if (!result){
                return res.status(401).json({ error: "The Item doesn't exist." });
            }

            const updatesql = await sql.query`UPDATE product SET NameProd = ${params.name}, Price = ${params.price}, TypeProd = ${params.type}  WHERE IDProd = ${params.id}`

            const request = await new sql.Request();
            
            await request.query(updatesql);

            return res.status(201).json({ message: 'Update Successful' });
        }
    }
    catch(err){
        console.error("Database error fetching all menu data:", err.message);
        return res.status(502).json({error: "Could not Update Category data."})
    }
}

exports.delete = async (req,res) =>{
    try{
        const {type, ...array} = req.body;

        const params = array.params

        console.log(type);

        if (type == 'category'){
            console.log(`${params.id}`);
            const consql = await sql.query`SELECT * FROM ProdCategory WHERE IDCate = ${params.id}`
            const result = consql.recordset;
            console.log(result);
            if (!result){
                return res.status(401).json({ error: "The Item doesn't exist." });
            }

            const deletesql = await sql.query`DELETE FROM ProdCategory WHERE IDCate = ${params.id}`

            const request = await new sql.Request();
            
            await request.query(deletesql);

            return res.status(201).json({ message: 'Delete Successful' });
        }
        else if (type == 'food'){
            const consql = await sql.query`SELECT * FROM product WHERE IDProd = ${params.id}`
            const result = consql.recordset;
            console.log(result);
            if (!result){
                return res.status(401).json({ error: "The Item doesn't exist." });
            }
            console.log(params.id);
            const deletesql = await sql.query`DELETE FROM product WHERE IDProd = ${params.id}`

            const request = await new sql.Request();
            
            await request.query(deletesql);

            return res.status(201).json({ message: 'Delete Successful' });
        }
    }
    catch(err){
        console.error("Database error fetching all menu data:", err.message);
        return res.status(502).json({error: "Could not Update Category data."})
    }
}
exports.insert = async (req,res) =>{
    try{
        const {type, ...array} = req.body;

        const params = array.params

        if (type == 'category'){

            const insertsql = await sql.query`INSERT INTO ProdCategory (CateName) VALUES (${params.name})`

            const request = await new sql.Request();
            
            await request.query(insertsql);

            return res.status(201).json({ message: 'Insert Successful' });
        }
        else if (type == 'food'){
            const insertsql = await sql.query`Insert Into product (NameProd, Price, ImageProd, Size, Khuyenmai, DescProd, TypeProd) VALUES (${params.name}, ${params.price}, '/menu/img-menu/pizza.jpg', 9, 0, 'trống', ${params.type})`

            const request = await new sql.Request();
            
            await request.query(insertsql);

            return res.status(201).json({ message: 'Insert Successful' });
        }
    }
    catch(err){
        console.error("Database error fetching all menu data:", err.message);
        return res.status(502).json({error: "Could not Update Category data."})
    }
}

exports.search = async (req,res) => {
    try{
        const {type, ...array} = req.body;

        const params = array.params;

        console.log(params.data);

        if(type =='category'){
        const menu = `SELECT * FROM ProdCategory WHERE IDCate LIKE '%${params.data}%' OR CateName LIKE '%${params.data}%' ORDER BY IDCate `;

        const menulist = (await sql.query(menu)).recordset;

        if(menulist.length == 0){
            console.log("failed search");
            return res.status(501).json("Couldn't find matching item");
        }

        return res.status(200).json(menulist);
        }
        else if(type == 'food'){
            //const menu = await sql.query`SELECT * FROM product p JOIN ProdCategory c ON p.TypeProd = c.IDCate WHERE IDProd LIKE '%a%' OR NameProd LIKE '%a%' OR Price LIKE '%a%' OR DescProd LIKE 'a%%' OR CateName LIKE '%a%' ORDER BY IDProd `
            const menu = `SELECT * FROM product p JOIN ProdCategory c ON p.TypeProd = c.IDCate WHERE IDProd LIKE '%${params.data}%' OR NameProd LIKE '%${params.data}%' OR Price LIKE '%${params.data}%' OR DescProd LIKE '%${params.data}%' OR CateName LIKE '%${params.data}%' ORDER BY IDProd `;

            const menulist = (await sql.query(menu)).recordset;  
            
            console.log(menulist);

        if(menulist.length == 0){
            console.log("failed search");
            return res.status(501).json({error:"Couldn't find matching item"});
        }
        const list = {menulist};

        console.log(list);

        return res.status(200).json(list);
        }
    }
    catch(err){
        console.error("Database error fetching all menu data:", err.message);
        return res.status(501).json({ error: "Could not retrieve menu data." });
    }
}