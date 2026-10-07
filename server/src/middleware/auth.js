const crypto = require("crypto");

if (process.env.NODE_ENV === "production" && !process.env.AUTH_TOKEN_SECRET) {
  throw new Error("AUTH_TOKEN_SECRET must be configured in production");
}

const secret = process.env.AUTH_TOKEN_SECRET || "development-only-secret";

const signToken = (userId) => {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Authentication required" });

  const [payload, signature] = token.split(".");
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.userId || data.expiresAt < Date.now()) throw new Error("Expired token");
    req.user = { id: data.userId };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired authentication token" });
  }
};

module.exports = { requireAuth, signToken };
