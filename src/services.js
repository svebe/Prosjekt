import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'robinhs',
    password: 'GQhfsP11',
    database: 'robinhs'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

// Class that performs database queries related to customers
class CustomerService {
  getCustomers(callback) {
    connection.query('SELECT * FROM Customers', (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  getCustomer(id, callback) {
    connection.query('SELECT * FROM Customers WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  addCustomer(firstName, city, callback) {
    connection.query('INSERT INTO Customers (firstName, city) values (?, ?)', [firstName, city], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  removeCustomer(id, callback) {
    connection.query('DELETE FROM Customers where id = ?', [id], function(error, results, fields){
      if (error) throw error;

      callback();
    });
  }

  editCustomer(firstName, city, id, callback) {
    connection.query('UPDATE Customers SET firstName = ?, city = ? WHERE id = ?', [firstName, city, id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

}

class LoginService {
  checkLogin (brukernavn, passord, callback) {
    connection.query('SELECT * from medlem WHERE epost = ?', [brukernavn], (error, result) => {
      if (error) throw error;
      let login = false
      let medlem_nr = null
      if (result[0].passord === passord) {
        login = true
        medlem_nr = result[0].medlem_nr;
      } else {
        login = false
      }

      callback(login, medlem_nr);
    })
  }
}

let customerService = new CustomerService()
let loginService = new LoginService()

export { customerService, loginService };
