/* import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verificarToken = (req, res, next) => {
    //const token = req.headers['authorization'];
    const token = req.headers['authorization']?.split(' ')[1]; // Divide 'Bearer token'
    console.log('Authorization header:', token); // Depuración (SA)
    if (!token) return res.status(403).json({ message: 'Token no provisto' });

    if (!token || !token.startsWith('Bearer ')) {    //(SA)
        return res.status(401).json({ message: 'Fallo en la autenticación del token' });    //(SA)
    }    //(SA)

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Agrega esto para depuración
            return res.status(500).json({ message: 'Fallo en la autenticación del token' });
        }
        req.user = decoded;
        //req.user = { id: decoded.id }; // Asegúrate de que aquí esté el ID del usuario
        next();
    });
}; */

// middlewares/authJWT.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET está correctamente importado

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Encabezado Authorization recibido:', authHeader); // Depuración

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
};
