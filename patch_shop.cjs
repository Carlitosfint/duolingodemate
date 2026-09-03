const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Cofre Basico
code = code.replace(
  /if \(user\.coins >= 500\) \{ setUser\(prev => prev \? \{ \.\.\.prev, coins: prev\.coins - 500 \} : null\); openRandomChest\('common'\); playClickSound\(\); \} else \{ alert\("Monedas insuficientes"\); \}/,
  'if (user.tickets >= 100) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 100 } : null); openRandomChest(\'common\'); playClickSound(); } else { alert("Tickets insuficientes"); }'
);
code = code.replace(
  /<Icon name="coins" size=\{16\} \/> 500/,
  '<Icon name="ticket" size={16} /> 100'
);

// Cofre Raro
code = code.replace(
  /if \(user\.coins >= 1500\) \{ setUser\(prev => prev \? \{ \.\.\.prev, coins: prev\.coins - 1500 \} : null\); openRandomChest\('rare'\); playClickSound\(\); \} else \{ alert\("Monedas insuficientes"\); \}/,
  'if (user.tickets >= 300) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 300 } : null); openRandomChest(\'rare\'); playClickSound(); } else { alert("Tickets insuficientes"); }'
);
code = code.replace(
  /<Icon name="coins" size=\{16\} \/> 1500/,
  '<Icon name="ticket" size={16} /> 300'
);

// Cofre Epico
code = code.replace(
  /if \(user\.coins >= 5000\) \{ setUser\(prev => prev \? \{ \.\.\.prev, coins: prev\.coins - 5000 \} : null\); openRandomChest\('legendary'\); playClickSound\(\); \} else \{ alert\("Monedas insuficientes"\); \}/,
  'if (user.tickets >= 1000) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 1000 } : null); openRandomChest(\'legendary\'); playClickSound(); } else { alert("Tickets insuficientes"); }'
);
code = code.replace(
  /<Icon name="coins" size=\{16\} \/> 5000/,
  '<Icon name="ticket" size={16} /> 1000'
);

fs.writeFileSync('src/App.tsx', code);
