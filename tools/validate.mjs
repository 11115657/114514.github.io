import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(new URL('..', import.meta.url).pathname);
const required = [
  'index.html',
  'styles.css',
  'app.js',
  'profile.config.js',
  'sw.js',
  'offline.html',
  'site.webmanifest',
  'assets/favicon.svg',
  'assets/social-preview.svg',
  '.nojekyll'
];

const errors = [];
for (const file of required) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing required file: ${file}`);
}

const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');
const app = readFileSync(resolve(root, 'app.js'), 'utf8');
const config = readFileSync(resolve(root, 'profile.config.js'), 'utf8');

const requiredIds = [
  'ambientCanvas', 'brandName', 'heroName', 'heroRole', 'heroSummary', 'metricGrid', 'highlightGrid', 'projectGrid',
  'timeline', 'skillBars', 'radarCanvas', 'questionList', 'answerBox', 'contactActions', 'projectModal', 'commandModal'
];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) errors.push(`Missing DOM id in index.html: ${id}`);
}

if (app.includes('.findLast(')) errors.push('Do not use Array.prototype.findLast for browser compatibility.');
if (!css.includes('prefers-reduced-motion')) errors.push('Missing reduced motion CSS guard.');
if (!html.includes('application/ld+json')) errors.push('Missing JSON-LD schema block.');
if (!html.includes('site.webmanifest')) errors.push('Missing manifest link.');

const context = { window: {} };
try {
  vm.runInNewContext(config, context, { filename: 'profile.config.js' });
  const profile = context.window.RESUME_PROFILE;
  if (!profile) errors.push('profile.config.js does not set window.RESUME_PROFILE.');
  if (!profile?.person?.name) errors.push('profile.person.name is required.');
  if (!Array.isArray(profile?.projects) || profile.projects.length < 1) errors.push('profile.projects must contain at least one project.');
  if (!Array.isArray(profile?.skills) || profile.skills.length < 1) errors.push('profile.skills must contain at least one skill.');
} catch (error) {
  errors.push(`profile.config.js failed to evaluate: ${error.message}`);
}

if (errors.length) {
  console.error('Resume OS validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Resume OS validation passed.');
