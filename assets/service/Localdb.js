import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('repartidores.db');

export const localDB = {
  init: () => {
    db.execSync(`CREATE TABLE IF NOT EXISTS sesion (id INTEGER PRIMARY KEY NOT NULL, usuario_json TEXT NOT NULL);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS pedido_actual (id INTEGER PRIMARY KEY NOT NULL, datos TEXT NOT NULL);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS estado_rider (id INTEGER PRIMARY KEY NOT NULL, status TEXT NOT NULL);`);
  },
  saveSession: (usuario) => {
    db.runSync('DELETE FROM sesion'); 
    db.runSync('INSERT INTO sesion (id, usuario_json) VALUES (1, ?);', [JSON.stringify(usuario)]);
  },
  getSession: () => {
    const row = db.getFirstSync('SELECT * FROM sesion WHERE id = 1');
    return row ? JSON.parse(row.usuario_json) : null;
  },
  saveStatus: (status) => {
    db.runSync('DELETE FROM estado_rider');
    db.runSync('INSERT INTO estado_rider (id, status) VALUES (1, ?);', [status]);
  },
  getStatus: () => {
    const row = db.getFirstSync('SELECT * FROM estado_rider WHERE id = 1');
    return row ? row.status : "inactivo";
  },
  deleteSession: () => {
    db.runSync('DELETE FROM sesion');
    db.runSync('DELETE FROM pedido_actual');
    db.runSync('DELETE FROM estado_rider');
  }
};

export const baseDatosPedido = {
  guardar: (pedido) => {
    db.runSync('DELETE FROM pedido_actual');
    db.runSync('INSERT INTO pedido_actual (id, datos) VALUES (1, ?);', [JSON.stringify(pedido)]);
  },
  obtener: () => {
    const fila = db.getFirstSync('SELECT * FROM pedido_actual WHERE id = 1');
    return fila ? JSON.parse(fila.datos) : null;
  },
  borrar: () => {
    db.runSync('DELETE FROM pedido_actual');
  }
};