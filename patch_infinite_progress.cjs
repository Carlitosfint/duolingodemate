const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  /const \[user, setUser\] = useState<UserState \| null>\(\(\) => \{/,
  `const [infiniteProgress, setInfiniteProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('fin_infinite_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('fin_infinite_progress', JSON.stringify(infiniteProgress));
  }, [infiniteProgress]);

  const [user, setUser] = useState<UserState | null>(() => {`
);
fs.writeFileSync('src/App.tsx', appCode);
