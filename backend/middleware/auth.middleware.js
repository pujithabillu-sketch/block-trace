import { verifyToken } from '../utils/jwt.utils.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Access token missing' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, error: 'Forbidden: User role not assigned' });
    }

    if (req.user.role === 'ADMIN') {
      return next(); // ADMIN has global permissions
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Insufficient privileges for role '${req.user.role}'. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};
