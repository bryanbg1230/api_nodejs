import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verificarToken = (req, res, next) => {
    //const token = req.headers['authorization'];
     const token = req.headers['authorization']?.split(' ')[1]; // Divide 'Bearer token'
    if (!token) return res.status(403).json({ message: 'Token no provisto' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Agrega esto para depuración
            return res.status(500).json({ message: 'Fallo en la autenticación del token' });
        }
        req.user = decoded;
        //req.user = { id: decoded.id }; // Asegúrate de que aquí esté el ID del usuario
        next();
    });
};
