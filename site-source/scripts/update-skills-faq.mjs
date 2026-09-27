import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import vm from 'node:vm';
import * as cheerio from 'cheerio';

const sourceUrl = 'https://chaosage.ru/help.php?section=2';
const sourcePath = new URL('../src/components/SkillsProps.jsx', import.meta.url);
const execFileAsync = promisify(execFile);
const source = await readFile(sourcePath, 'utf8');
const oldDefinition = source.split('export default skillsSummary;')[0];
const skills = vm.runInNewContext(`${oldDefinition}\nskillsSummary`);
const html = process.argv[2]
  ? await readFile(process.argv[2], 'utf8')
  : (await execFileAsync('curl', ['-fLsS', '--max-time', '30', sourceUrl], { maxBuffer: 2_000_000 })).stdout;
const $ = cheerio.load(html);
const faq = new Map();
const labels = { 'Новичок:': 'contentNoob', 'Эксперт:': 'contentExpert', 'Мастер:': 'contentMaster', 'Грандмастер:': 'contentGrandmaster' };

for (const heading of $('font.caption').toArray()) {
  const name = $(heading).text().trim();
  const li = $(heading).closest('li')[0];
  if (!li) continue;
  const descriptions = {};
  let current;
  for (let node = li.nextSibling; node && node.name !== 'li'; node = node.nextSibling) {
    const label = node.name === 'b' ? $(node).text().trim() : null;
    if (label && labels[label]) { current = labels[label]; descriptions[current] = ''; continue; }
    if (!current) continue;
    descriptions[current] += node.name === 'br' ? ' ' : $(node).text();
  }
  for (const key of Object.keys(descriptions)) descriptions[key] = descriptions[key].replace(/\s+/g, ' ').trim();
  faq.set(name, descriptions);
}

if (faq.size !== skills.length) throw new Error(`FAQ has ${faq.size} skills; catalog has ${skills.length}. Review names before updating.`);
for (const skill of skills) {
  const name = skill.secondName || skill.name;
  const descriptions = faq.get(name);
  if (!descriptions?.contentNoob || !descriptions.contentExpert || !descriptions.contentMaster) {
    throw new Error(`Missing FAQ description: ${name}`);
  }
  Object.assign(skill, descriptions);
  if (!descriptions.contentGrandmaster) delete skill.contentGrandmaster;
}
const rankFour = skills.filter(skill => skill.contentGrandmaster).map(skill => skill.secondName || skill.name);
if (rankFour.length !== 4) throw new Error(`Expected 4 Grandmaster skills, found ${rankFour.length}`);
await writeFile(sourcePath, `// Official skill descriptions: ${sourceUrl}\nconst skillsSummary = ${JSON.stringify(skills, null, 2)};\n\nexport default skillsSummary;\n`);
console.log(`Updated ${skills.length} skill descriptions; Grandmaster: ${rankFour.join(', ')}`);
