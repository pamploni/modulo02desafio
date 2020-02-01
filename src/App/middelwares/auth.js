import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../src/config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // usando desestruturação para separar o bearer do token
  // como só vai ser aproveitado o token, podemos deixar
  // a primeira parte do array em branco
  const [, token] = authHeader.split(' ');

  try {
    // importante saber que aqiui o retorno será uma função
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
