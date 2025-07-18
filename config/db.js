const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

function initDatabase() {
  db.query("CREATE DATABASE IF NOT EXISTS devigns", (err) => {
    if (err) {
      console.error("Erro ao criar o banco de dados:  ", err.message);
      return;
    }
    console.log("Banco de dados verificado/criado");

    db.changeUser({ database: "devigns" }, (err) => {
      if (err) {
        console.error("Erro ao mudar para o banco devigns: ", err.message);
        return;
      }
      console.log("Usando banco de dados: devigns");

      const createTable1 = `
        CREATE TABLE IF NOT EXISTS turn (
          turn_ID INT AUTO_INCREMENT PRIMARY KEY,
          status ENUM('DONE', 'IN_PROGRESS') NOT NULL DEFAULT 'IN_PROGRESS',
          sanity TINYINT NOT NULL DEFAULT 50,
          knowledge TINYINT NOT NULL DEFAULT 50,
          money TINYINT NOT NULL DEFAULT 50
        );
      `;

      // const createTable2 = `
      //   CREATE TABLE IF NOT EXISTS chapter (
      //     chapter_ID INT AUTO_INCREMENT PRIMARY KEY,
      //     text TEXT NOT NULL,
      //     turn_ID INT,
      //     CONSTRAINT fk_turn
      //       FOREIGN KEY (turn_ID) REFERENCES turn(id)
      //       ON DELETE SET NULL
      //       ON UPDATE CASCADE
      //     );
      // `;

      db.query(createTable1, (err) => {
        if (err) {
          console.error('Erro ao criar tabela "turn" :', err.message);
          return;
        }
        console.log('Tabela "turn" verificada/criada');
      });
    });
  });
}

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err.message);
    return;
  }
  console.log("Conectado ao MySQL com sucesso!");
  initDatabase();
});

module.exports = db;
