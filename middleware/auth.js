import { UnAuthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';



const auth = (req, res, next) => {
    console.log('Authenticate user');
   
    const {authorization } = req.headers;
     if (!authorization || !authorization.startsWith('Bearer'))  {
        throw new UnAuthenticatedError('Authentication Invalid')
    }
    const token = authorization.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId};
    } catch(error) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }

    next()
}

export default auth;