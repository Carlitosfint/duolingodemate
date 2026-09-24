import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ensureLocalUser, getUserState } from '../db/users.ts';
import { isEmbeddedDatabase } from '../db/index.ts';
import { getSchool } from '../db/schools.ts';
import { users } from '../db/schema.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  // The caller's own row (includes schoolId/role) — every school-scoped
  // route reads this instead of re-querying, and uses its schoolId to
  // scope whatever it does.
  dbUser?: typeof users.$inferSelect;
  // Their school, already loaded to check it isn't suspended.
  school?: Awaited<ReturnType<typeof getSchool>>;
}

// Who operates the platform itself, read from the environment rather than
// from a role in the database. Two reasons: a users row must belong to a
// school (schoolId is NOT NULL) and a platform operator belongs to none;
// and more importantly this leaves no in-app path to the role — granting it
// takes server access, so no school admin can ever escalate into it.
const platformAdminEmails = () =>
  (process.env.PLATFORM_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isPlatformAdminEmail = (email?: string | null) =>
  !!email && platformAdminEmails().includes(email.toLowerCase());

// Platform routes deliberately skip the school user lookup: the operator
// has no school, and nothing under /api/platform may read student data.
export const requirePlatformAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    if (!isPlatformAdminEmail(decoded.email)) {
      return res.status(403).json({ error: 'No autorizado.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

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
    let dbUser = await getUserState(decodedToken.uid);
    if (!dbUser && isEmbeddedDatabase) {
      dbUser = await ensureLocalUser({
        uid: decodedToken.uid,
        email: decodedToken.email || `${decodedToken.uid}@local.test`,
        name: typeof decodedToken.name === 'string'
          ? decodedToken.name
          : decodedToken.email?.split('@')[0] || 'Usuario local',
      });
    }
    if (!dbUser) {
      return res.status(403).json({ error: 'No hay una cuenta registrada para este usuario. Contacta a tu colegio.' });
    }
    // Deactivating disables the Firebase account too, but an ID token
    // already issued stays valid for up to an hour — this closes that
    // window, so the session stops working the moment they're given leave.
    if (dbUser.active === false) {
      return res.status(403).json({ error: 'Tu cuenta está dada de baja. Contacta a tu colegio.' });
    }
    // schools.status existed but nothing ever read it, so a suspended school
    // kept working exactly like a paying one.
    const school = await getSchool(dbUser.schoolId);
    if (school && school.status !== 'active') {
      return res.status(403).json({
        error: 'El acceso de tu colegio está suspendido. Contacta al administrador de tu colegio.',
        code: 'school_suspended',
      });
    }
    req.dbUser = dbUser;
    req.school = school;
    next();
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return res.status(500).json({ error: 'No se pudo conectar con la base de datos.' });
  }
};
