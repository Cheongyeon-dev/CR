/**
 * CR raw — 캐릭터 RP만. 배경(C1~C3)·UI는 lorebox-worker/public/assets/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw');

const CHARS = ['SL', 'KR', 'CH', 'RN', 'LZ', 'OV'];
const SITUATIONS = ['1', '2', '3', '4', '5', '6', '7', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3'];

// raw에 잘못 들어간 배경 폴더 제거
for (const stray of ['C1', 'C2', 'C3']) {
  const p = path.join(RAW, stray);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });

for (const char of CHARS) {
  for (const sit of SITUATIONS) {
    fs.mkdirSync(path.join(RAW, char, sit), { recursive: true });
  }
}

console.log(`raw: 캐릭터 ${CHARS.length} × ${SITUATIONS.length} (배경은 raw에 없음)`);
console.log(`배경 C1/C2/C3 → lorebox-worker/public/assets/bg/`);
