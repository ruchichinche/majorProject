import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Support token in custom header `token` or standard `Authorization: Bearer <token>`
        let token = req.headers.token || req.headers.authorization;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized access: token missing' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log('authUser error:', error.message);
        return res.status(401).json({ success: false, message: 'Unauthorized: ' + error.message });
    }
};

export default authUser;