export const rateLimitMiddleware = async (req, res, next) => {
  // Store in-memory rate limit tracking (pour simplifier sans Redis)
  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Utilisateur non authentifié'
    });
  }

  const now = Date.now();
  const windowStart = now - (parseInt(process.env.RATE_LIMIT_WINDOW) * 1000 || 3600000);
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5;

  if (!global.rateLimitStore[userId]) {
    global.rateLimitStore[userId] = [];
  }

  // Clean old entries
  global.rateLimitStore[userId] = global.rateLimitStore[userId].filter(
    (timestamp) => timestamp > windowStart
  );

  // Check limit
  if (global.rateLimitStore[userId].length >= maxRequests) {
    const oldestRequest = global.rateLimitStore[userId][0];
    const resetTime = new Date(oldestRequest + (parseInt(process.env.RATE_LIMIT_WINDOW) * 1000 || 3600000));
    return res.status(429).json({
      success: false,
      message: `Trop de requêtes. Réessayez après ${resetTime.toLocaleTimeString('fr-FR')}`,
      retryAfter: Math.ceil((resetTime - now) / 1000)
    });
  }

  // Record this request
  global.rateLimitStore[userId].push(now);
  next();
};

export default rateLimitMiddleware;
