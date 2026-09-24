// Keeping the student's coins and tickets in step with the server.
//
// The device used to send its totals, and the server stored them as they
// came — so a reward the teacher gave while the student was playing was
// erased by the next sync. Now the device sends what changed ("+30 coins"),
// and the database adds it.
//
// Changes, unlike totals, must not be applied twice. A sync sent while the
// tab closes gets no answer the device ever sees, and would be sent again
// next time. So each batch carries a sequence number from this device, and
// the server skips one it has already applied (see applyUserSync).

export interface Balance {
  coins: number;
  tickets: number;
}

export interface SyncState {
  uid: string;
  // The balance the server last confirmed.
  base: Balance;
  // A batch that was sent but not confirmed yet, resent as-is — same
  // device, same number — until it is.
  pending: { seq: number; device?: string; delta: Balance } | null;
}

export const ZERO: Balance = { coins: 0, tickets: 0 };
export const add = (a: Balance, b: Balance): Balance => ({ coins: a.coins + b.coins, tickets: a.tickets + b.tickets });
export const sub = (a: Balance, b: Balance): Balance => ({ coins: a.coins - b.coins, tickets: a.tickets - b.tickets });
export const isZero = (b: Balance) => b.coins === 0 && b.tickets === 0;
const floorAtZero = (b: Balance): Balance => ({ coins: Math.max(0, b.coins), tickets: Math.max(0, b.tickets) });

// What the server knows about, or is about to: confirmed plus in flight.
const accounted = (state: SyncState) => add(state.base, state.pending?.delta ?? ZERO);

// At sign-in, with the server's balance in hand.
export function onSignIn(server: Balance, local: Balance | null, state: SyncState | null, uid: string) {
  if (state && state.uid === uid && local) {
    // Whatever this device earned or spent that the server hasn't heard of
    // stays on top of the server's balance, rewards from the teacher
    // included. A pending batch may or may not have landed; it's resent
    // under the same number, which the server applies at most once.
    const unsent = sub(local, accounted(state));
    return {
      local: floorAtZero(add(add(server, state.pending?.delta ?? ZERO), unsent)),
      state: { uid, base: server, pending: state.pending },
    };
  }
  // No record from this device (first sign-in here, or before this
  // existed): keep whichever side is ahead, as the app always did. The
  // first sync then sends the difference.
  return {
    local: { coins: Math.max(server.coins, local?.coins ?? 0), tickets: Math.max(server.tickets, local?.tickets ?? 0) },
    state: { uid, base: server, pending: null } as SyncState,
  };
}

// What the next sync sends: the unconfirmed batch again if there is one,
// otherwise whatever changed since the last confirmation (possibly nothing).
export function nextBatch(local: Balance, state: SyncState): { seq: number | null; delta: Balance } {
  if (state.pending) return { seq: state.pending.seq, delta: state.pending.delta };
  return { seq: null, delta: sub(local, state.base) };
}

// Once the server confirms, with the balance it now has. Anything that
// changed on the device while the request was out is still owed. (A
// non-zero change is always recorded as `pending` before it's sent.)
export function onConfirmed(server: Balance, localNow: Balance, state: SyncState) {
  const unsent = sub(localNow, accounted(state));
  return {
    local: floorAtZero(add(server, unsent)),
    state: { uid: state.uid, base: server, pending: null } as SyncState,
    unsent,
  };
}
