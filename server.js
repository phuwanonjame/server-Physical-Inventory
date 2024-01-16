const sql = require("mssql");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { log } = require("console");
const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "phuwanon",
  password: "0881509604",
  server: "localhost",
  database: "ProductionDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
let pool;
sql
  .connect(config)
  .then((p) => {
    pool = p;
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

app.post("/loaddata", (req, res) => {
  const Case = req.body.Case;
  console.log(Case);
  if (Case === 1) {
    const sqlload =
      "SELECT u.*, d.Dname FROM db_user u LEFT JOIN db_department d ON u.department_id = d.Department_id;";
    const request = pool.request();
    request.query(sqlload, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.recordset);
      }
    });
  } else if (Case === 2) {
    const sqlload =
      "SELECT u.*, d1.Fname AS Fname1, d1.Lname AS Lname1, d2.Fname AS Fname2, d2.Lname AS Lname2, d3.Sname AS Sname FROM db_work u LEFT JOIN db_user d1 ON u.IDuser = d1.Employee_id LEFT JOIN db_user d2 ON u.IDusero = d2.Employee_id  LEFT JOIN db_store d3 ON u.warehouse = d3.id_store;";
    const request = pool.request();
    request.query(sqlload, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.recordset);
      }
    });
  }
});
app.post("/loaddatastore", (req, res) => {
  const store = "SELECT * FROM db_store";
  const request = pool.request();
  request.query(store, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.recordset);
    }
  });
});
app.post("/Product", (req, res) => {
  const store = "SELECT * FROM db_product";
  const request = pool.request();
  request.query(store, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.recordset);
    }
  });
});
app.post("/adddatawork",(req,res)=>{
  const data = req.body
  const selectedProductsJson = JSON.stringify(data.selectedProducts);
  const sqlwork = "INSERT INTO db_work (Idpage,productid,Datein,Dateout,warehouse,Line,comment,IDuser,IDusero) VALUES (@Idpage,@productid,@Datein,@Dateout,@warehouse,@Line,@comment,@IDuser,@IDusero)"
  const request = pool.request();
  request.input("Idpage",sql.NVarChar,data.Idpage)
  request.input("productid",sql.NVarChar,selectedProductsJson)
  request.input("Datein",sql.NVarChar,data.Datein)
  request.input("Dateout",sql.NVarChar,data.Dateout)
  request.input("warehouse",sql.NVarChar,data.warehouse)
  request.input("Line",sql.Int,data.Line)
  request.input("comment",sql.NVarChar,data.comment)
  request.input("IDuser",sql.NVarChar,data.IDuser)
  request.input("IDusero",sql.NVarChar,data.IDusero)


  request.query(sqlwork,(err,result)=>{
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.recordset);
    }
  })
  console.log(data);
})

app.post("/dleorder", (req, res) => {
  const data = req.body.ID;
  console.log(data);
  const store = "DELETE FROM db_work WHERE ID = @ID;";
  const request = pool.request();
  request.input("ID", sql.Int, data);
  request.query(store, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.recordset);
    }
  });
});

const port = 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
