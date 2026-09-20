// Who may do what. Lifted out of server.ts so the rules can be read — and
// tested — on their own instead of buried inside a 900-line route file.

export type Role = 'student' | 'teacher' | 'secretary' | 'admin';

// School staff hierarchy: admin (director) > secretary (matrícula) >
// teacher > student. A secretary can enroll/transfer students — the job an
// admin would otherwise do themselves or hand off by making that person a
// full admin — but never creates other staff.
export function canManageEnrollment(role: string): boolean {
  return role === 'admin' || role === 'secretary';
}

export function isStaff(role: string): boolean {
  return role === 'admin' || role === 'secretary' || role === 'teacher';
}

// Enrollment data: who the student is and where they're registered. The DNI
// is unique platform-wide and the section decides the roster, so this is
// registrar work — the admin and the secretary, not every teacher.
export const ENROLLMENT_FIELDS = ['name', 'dni', 'grade', 'section', 'classroom'] as const;

// Classroom incentives. A teacher handing out coins, or moving a student
// past a unit the class already covered, is them doing their job.
export const TEACHING_FIELDS = ['avatar', 'coins', 'tickets', 'progress'] as const;

export function editableFieldsFor(role: string): readonly string[] {
  return canManageEnrollment(role) ? [...ENROLLMENT_FIELDS, ...TEACHING_FIELDS] : TEACHING_FIELDS;
}

// A teacher only sees the classrooms assigned to them; empty means the whole
// school, which is the sane default for a small school with one teacher and
// what keeps accounts created before this feature working unchanged.
// Admin and secretary always see everyone.
export function visibleStudentsFor<T extends { classroom?: string | null }>(
  caller: { role?: string | null; classrooms?: unknown },
  students: T[]
): T[] {
  const assigned = Array.isArray(caller.classrooms) ? (caller.classrooms as string[]) : [];
  if (caller.role !== 'teacher' || assigned.length === 0) return students;
  return students.filter((s) => !!s.classroom && assigned.includes(s.classroom));
}
