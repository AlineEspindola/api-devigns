const mysql = require("mysql");
const chapters = require("../data/chapters.json");
const options = require("../data/options.json");

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

      createTables();

      insertTables();
    });
  });
}

function createTables() {
  const createTables = [
    {
      name: "turn",
      sql: `
        CREATE TABLE IF NOT EXISTS turn (
          turn_ID INT AUTO_INCREMENT PRIMARY KEY,
          status ENUM('DONE', 'IN_PROGRESS') NOT NULL DEFAULT 'IN_PROGRESS',
          sanity TINYINT NOT NULL DEFAULT 50,
          knowledge TINYINT NOT NULL DEFAULT 50,
          money TINYINT NOT NULL DEFAULT 50
        );
      `,
    },
    {
      name: "chapter",
      sql: `
        CREATE TABLE IF NOT EXISTS chapter (
          chapter_ID INT AUTO_INCREMENT PRIMARY KEY,
          text TEXT NOT NULL,
          is_sequel TINYINT(1) NOT NULL DEFAULT 0,
          turn_ID INT,
          CONSTRAINT fk_turn
            FOREIGN KEY (turn_ID) REFERENCES turn(turn_ID)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        );
      `,
    },
    {
      name: "options",
      sql: `
        CREATE TABLE IF NOT EXISTS options (
        options_ID INT AUTO_INCREMENT PRIMARY KEY,
        right_text TEXT NOT NULL,
        left_text TEXT NOT NULL,
        right_sanity TINYINT NOT NULL,
        right_knowledge TINYINT NOT NULL,
        right_money TINYINT NOT NULL,
        left_sanity TINYINT NOT NULL,
        left_knowledge TINYINT NOT NULL,
        left_money TINYINT NOT NULL,
        chapter_ID INT,
        next_chapter_right INT,
        next_chapter_left INT,
        CONSTRAINT fk_options_chapter
          FOREIGN KEY (chapter_ID) REFERENCES chapter(chapter_ID)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_options_next_right
          FOREIGN KEY (next_chapter_right) REFERENCES chapter(chapter_ID)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_options_next_left
          FOREIGN KEY (next_chapter_left) REFERENCES chapter(chapter_ID)
          ON DELETE SET NULL
          ON UPDATE CASCADE
        );
      `,
    },
  ];

  createTables.forEach((table) => {
    db.query(table.sql, (err) => {
      if (err) {
        console.error(`Erro ao criar tabela "${table.name}" :`, err.message);
      } else {
        console.log(`Tabela "${table.name}" verificada/criada`);
      }
    });
  });
}

function insertTables() {
  chapters.forEach((chapter) => {
    const { chapter_ID, text, is_sequel } = chapter;

    const checkSql = "SELECT 1 FROM chapter WHERE chapter_ID = ? LIMIT 1";
    db.query(checkSql, [chapter_ID], (err, results) => {
      if (err) {
        console.error(`Erro ao verificar capítulo ${chapter_ID}:`, err);
        return;
      }

      if (results.length > 0) {
        console.log(`Capítulo ${chapter_ID} já existe. Ignorando...`);
      } else {
        const insertSql =
          "INSERT INTO chapter (chapter_ID, text, is_sequel) VALUES (?, ?, ?)";
        db.query(insertSql, [chapter_ID, text, is_sequel], (insertErr) => {
          if (insertErr) {
            console.error(`Erro ao inserir capítulo ${chapter_ID}:`, insertErr);
          } else {
            console.log(`Capítulo ${chapter_ID} inserido com sucesso`);
          }
        });
      }
    });
  });

  options.forEach((option) => {
    const {
      options_ID,
      chapter_ID,
      right_text,
      left_text,
      right_sanity,
      right_knowledge,
      right_money,
      left_sanity,
      left_knowledge,
      left_money,
      next_chapter_right,
      next_chapter_left,
    } = option;

    const checkSql = "SELECT 1 FROM options WHERE options_ID = ? LIMIT 1";
    db.query(checkSql, [options_ID], (err, results) => {
      if (err) {
        console.error(`Erro ao verificar as opções ${options_ID}: `, err);
        return;
      }

      if (results.length > 0) {
        console.log(`Opções ${options_ID} já existe. Ignorando...`);
      } else {
        const insertSql =
          "INSERT INTO options (options_ID, chapter_ID, right_text, left_text, right_sanity, right_knowledge, right_money, left_sanity, left_knowledge, left_money, next_chapter_right, next_chapter_left) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          insertSql,
          [
            options_ID,
            chapter_ID,
            right_text,
            left_text,
            right_sanity,
            right_knowledge,
            right_money,
            left_sanity,
            left_knowledge,
            left_money,
            next_chapter_right,
            next_chapter_left,
          ],
          (insertErr) => {
            if (insertErr) {
              console.error(
                `Erro ao inserir capítulo ${options_ID}:`,
                insertErr
              );
            } else {
              console.log(`Opções ${options_ID} inserido com sucesso`);
            }
          }
        );
      }
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
