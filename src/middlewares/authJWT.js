/* import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verificarToken = (req, res, next) => {
    //const token = req.headers['authorization'];     //VALE CON POSTMAN PERO NO CON LA APP
    const token = req.headers['authorization']?.split(' ')[1]; // Divide 'Bearer token'      //VALE CON ESTO EN LA APP PERO AL PARECER CON EL POSTMAN NO
    console.log('Authorization header:', token); // Depuración (SA)
    if (!token) return res.status(403).json({ message: 'Token no provisto' });

    if (!token || !token.startsWith('Bearer ')) {    //(SA)        -------> Si descomento esto cuando esto, cuando lo deje par funcionar con el postman y app,
        return res.status(401).json({ message: 'Fallo en la autenticación del token' });    //(SA)      ---------> va a parecer un mensaje de fallo en la
    }    //(SA)                                                          ---------> autenticación del token

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Agrega esto para depuración
            return res.status(500).json({ message: 'Fallo en la autenticación del token' });
        }
        req.user = decoded;  //VALE CON LA APP Y CON POSTMAN
        //req.user = { id: decoded.id }; // Asegúrate de que aquí esté el ID del usuario  //VALE CON LA APP Y CON POSTMAN
        next();
    });
}; */

// middlewares/authJWT.js
/* import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET está correctamente importado

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Encabezado Authorization recibido:', authHeader); // Depuración
  console.log('Headers recibidos:', req.headers);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Fallo en la autenticación del token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Fallo en la autenticación del token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err.message);
      return res.status(403).json({ message: 'Fallo en la autenticación del token' });
    }
    req.user = decoded;
    console.log('Usuario autenticado:', req.user);
    next();
  });
}; */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Encabezado Authorization recibido:', authHeader); // Depuración

    // Validar si no hay encabezado
    if (!authHeader) {
        return res.status(403).json({ message: 'Token no provisto' });
    }

    // Procesar token (si tiene o no prefijo "Bearer ")
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]  // Token con "Bearer"
        : authHeader;              // Token simple (sin "Bearer")

    console.log('Token extraído:', token); // Depuración

    if (!token) {
        return res.status(401).json({ message: 'Fallo en la autenticación del token' });
    }

    // Verificar el token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err.message); // Depuración
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        req.user = decoded; // Guardar información del usuario decodificada en la solicitud
        console.log('Usuario autenticado:', req.user); // Depuración
        next(); // Pasar al siguiente middleware
    });
};
