import { describe, expect, it } from 'vitest';
import { nextBatch, onConfirmed, onSignIn, type Balance, type SyncState } from './balance.ts';

const b = (coins: number, tickets = 0): Balance => ({ coins, tickets });

// A tiny server: applies each (seq) batch at most once, like applyUserSync.
function server(start: Balance) {
  let balance = start;
  const seen = new Set<number>();
  return {
    get: () => balance,
    award: (delta: Balance) => { balance = { coins: balance.coins + delta.coins, tickets: balance.tickets + delta.tickets }; },
    sync: (seq: number | null, delta: Balance) => {
      if (seq !== null && !seen.has(seq)) {
        seen.add(seq);
        balance = { coins: Math.max(0, balance.coins + delta.coins), tickets: Math.max(0, balance.tickets + delta.tickets) };
      }
      return balance;
    },
  };
}

// One sync from the device, the way App.tsx runs it.
function sync(srv: ReturnType<typeof server>, local: Balance, state: SyncState, seq: number, deliver = true) {
  const batch = nextBatch(local, state);
  let s = state;
  let useSeq = batch.seq;
  if (useSeq === null && (batch.delta.coins || batch.delta.tickets)) {
    useSeq = seq;
    s = { ...state, pending: { seq, delta: batch.delta } };
  }
  const response = srv.sync(useSeq, batch.delta);
  if (!deliver) return { local, state: s }; // the tab closed: no answer arrives
  const confirmed = onConfirmed(response, local, s);
  return { local: confirmed.local, state: confirmed.state };
}

describe('onSignIn', () => {
  it('without a record from this device, keeps whichever side is ahead', () => {
    expect(onSignIn(b(100), b(150), null, 'u').local).toEqual(b(150));
    expect(onSignIn(b(100), b(40), null, 'u').local).toEqual(b(100));
    expect(onSignIn(b(100), null, null, 'u').local).toEqual(b(100));
  });

  it('ignores a record left by another account on this device', () => {
    const other: SyncState = { uid: 'otro', base: b(0), pending: null };
    expect(onSignIn(b(100), b(900), other, 'u').local).toEqual(b(900)); // legacy merge, not other's diff
  });

  it('puts what the device earned offline on top of the server, rewards included', () => {
    // Confirmed 100; earned 30 offline; the teacher gave 50 meanwhile.
    const state: SyncState = { uid: 'u', base: b(100), pending: null };
    expect(onSignIn(b(150), b(130), state, 'u').local).toEqual(b(180));
  });
});

describe('the whole loop', () => {
  it('a reward given while the student plays is not erased by their next sync', () => {
    const srv = server(b(350));
    let { local, state } = onSignIn(srv.get(), b(350), null, 'u');
    srv.award(b(100));                       // the teacher, from the panel
    local = { ...local, coins: local.coins + 20 }; // the student answers right
    ({ local, state } = sync(srv, local, state, 1));
    expect(srv.get()).toEqual(b(470));
    expect(local).toEqual(b(470));           // and the student now sees it
  });

  // The case that makes plain "send the change" double coins: the answer
  // to a sync sent while the tab closes never reaches the device.
  it('a batch that landed but whose answer was lost is not applied twice', () => {
    const srv = server(b(100));
    let { local, state } = onSignIn(srv.get(), b(100), null, 'u');
    local = b(130);
    ({ local, state } = sync(srv, local, state, 1, false)); // tab closed
    expect(srv.get()).toEqual(b(130));

    // Next day, same device.
    ({ local, state } = onSignIn(srv.get(), local, state, 'u'));
    ({ local, state } = sync(srv, local, state, 2));        // resends batch 1
    expect(srv.get()).toEqual(b(130));
    expect(local).toEqual(b(130));
  });

  it('a batch that never landed is still delivered, once', () => {
    const srv = server(b(100));
    let { local, state } = onSignIn(srv.get(), b(100), null, 'u');
    local = b(130);
    const batch = nextBatch(local, state);
    state = { ...state, pending: { seq: 1, delta: batch.delta } }; // recorded, then the network failed

    ({ local, state } = onSignIn(srv.get(), local, state, 'u'));
    expect(local).toEqual(b(130));
    ({ local, state } = sync(srv, local, state, 2));
    expect(srv.get()).toEqual(b(130));
    ({ local, state } = sync(srv, local, state, 3));
    expect(srv.get()).toEqual(b(130));
  });

  it('keeps what changed on the device while a request was out', () => {
    const srv = server(b(100));
    let { state } = onSignIn(srv.get(), b(100), null, 'u');
    // Sent +30; before the answer came back the student spent 50.
    const sentLocal = b(130);
    const batch = nextBatch(sentLocal, state);
    const pending: SyncState = { ...state, pending: { seq: 1, delta: batch.delta } };
    const response = srv.sync(1, batch.delta);
    const after = onConfirmed(response, b(80), pending);
    expect(after.local).toEqual(b(80));
    expect(after.unsent).toEqual(b(-50));
    state = after.state;
    // The next sync sends the -50.
    expect(nextBatch(after.local, state).delta).toEqual(b(-50));
  });

  it('tracks tickets the same way', () => {
    const srv = server(b(0, 10));
    let { local, state } = onSignIn(srv.get(), b(0, 10), null, 'u');
    srv.award(b(0, 5));
    local = b(0, 7); // spent 3
    ({ local } = sync(srv, local, state, 1));
    expect(local).toEqual(b(0, 12));
  });
});
