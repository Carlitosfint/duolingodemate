const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const ticketsBlock = `            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl mt-4">
              <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-3">Tickets por Tema</h4>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                {Object.keys(stats.ticketsByTopic || {}).length === 0 ? <p className="text-slate-400 font-medium italic text-[11px]">Aún no hay tickets.</p> : Object.entries(stats.ticketsByTopic || {}).map(([topic, tickets]) => (
                  <div key={topic} className="flex justify-between">
                    <span className="truncate pr-2">{topic}:</span>
                    <span className="text-blue-600 font-black flex items-center gap-1"><Icon name="ticket" size={14} className="inline-block" /> {tickets}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>`;

code = code.replace(
  /              <\/div>\s*<\/div>\s*<\/div>\s*<div className="md:col-span-2 space-y-4">/,
  ticketsBlock + `\n          <div className="md:col-span-2 space-y-4">`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
