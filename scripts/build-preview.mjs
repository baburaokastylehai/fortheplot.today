import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets/previews', { recursive: true });
for (const asset of ['tripboard-map.png', 'previews/tripboard.jpg']) {
  await cp(`assets/${asset}`, `dist/assets/${asset}`);
}
const result = await build({
  entryPoints: ['conversation/app.js'],
  outfile: 'dist/app.js',
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2022'],
  legalComments: 'eof',
  write: false
});
const javascript = result.outputFiles[0].text;
const stylesheet = await readFile('conversation/styles.css', 'utf8');
const hash = content => createHash('sha256').update(content).digest('hex').slice(0, 12);
const scriptName = `app.${hash(javascript)}.js`;
const styleName = `styles.${hash(stylesheet)}.css`;
const html = (await readFile('conversation/index.html', 'utf8')).replace('./app.js', `./${scriptName}`).replace('./styles.css', `./${styleName}`);
await writeFile(`dist/${scriptName}`, javascript);
await writeFile(`dist/${styleName}`, stylesheet);
await writeFile('dist/index.html', html);
console.log('Conversation preview built in dist/');
