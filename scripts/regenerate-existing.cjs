#!/usr/bin/env node
/**
 * Quick script to regenerate ONLY the existing HTML files in public/programmatic/
 * Run: node scripts/regenerate-existing.cjs
 */
const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = path.join(__dirname, '../public/programmatic');

// Just require and run the main generator
console.log('Running main generator to overwrite all existing files...');
require('./generate-all.cjs');
