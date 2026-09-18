import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getUserState } from '../db/users.ts';
import { users } from '../db/schema.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  // The caller's own row (includes schoolId/role) — every school-scoped
  // route reads this instead of re-querying, and uses its schoolId to
  // scope whatever it does.
  dbUser?: typeof users.$inferSelect;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  req.user = decodedToken;

  try {
    // Accounts are provisioned by a school admin/teacher, never
    // self-registered — a Firebase-authenticated user with no matching
    // row here isn't part of any school, so the request is rejected
    // rather than silently given a schoolless row.
    const dbUser = await getUserState(decodedToken.uid);
    if (!dbUser) {
      return res.status(403).json({ error: 'No hay una cuenta registrada para este usuario. Contacta a tu colegio.' });
    }
    // Deactivating disables the Firebase account too, but an ID token
    // already issued stays valid for up to an hour — this closes that
    // window, so the session stops working the moment they're given leave.
    if (dbUser.active === false) {
      return res.status(403).json({ error: 'Tu cuenta está dada de baja. Contacta a tu colegio.' });
    }
    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return res.status(500).json({ error: 'No se pudo conectar con la base de datos.' });
  }
};
