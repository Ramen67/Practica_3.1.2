import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escuela'
});
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos: ', err);
        return;
    }else{
        console.log('Conexion a la base de datos exitosa!');
    }
});
export default connection;