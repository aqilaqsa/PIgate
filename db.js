import sql from "mssql";

const config = {
  server: "10.199.14.47",
  database: "GATE_DEV",
  user: "integratif",
  password: "G3rb4ng!",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, 
    trustServerCertificate: false 
  }
};

const insertLog = async (tableName, idKartuAkses, idRegisterGate, isValid) => {
  try {
    const dateTime = new Date();
    const result = await pool
      .request()
      .input("id_kartu_akses", sql.VarChar, idKartuAkses)
      .input("id_register_gate", sql.VarChar, idRegisterGate)
      .input("date_time", sql.DateTime, dateTime)
      .input("is_valid", sql.Bit, isValid)
      .query(
        `INSERT INTO ${tableName} (id_kartu_akses, id_register_gate, date_time, is_valid) VALUES (@id_kartu_akses, @id_register_gate, @date_time, @is_valid)`
      );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { goQuery, insertLog };


const pool = new sql.ConnectionPool(config);

try {
  await pool.connect();
} catch (error) {
  console.log(error);
}

const goQuery = async (query) => {
  try {
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default goQuery;
