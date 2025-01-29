#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the CLI script
const cli = spawn('node', [path.join(__dirname, 'src/torch/bin/cli.js')], {
  stdio: 'inherit'
});

cli.on('error', (error) => {
  console.error('Failed to start CLI:', error);
  process.exit(1);
});

cli.on('exit', (code) => {
  process.exit(code);
}); 