const mysql = require("mysql");

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'clearGlass',
  user     : 'root',
  password : '',
  multipleStatements: true
});
  connection.connect(function(err) {
    if (err) {
      console.error('Error in connecting DataBase: ' + err.stack);
      return;
    }
    console.log('DataBase connected successfully');
  });

module.exports=connection;

