const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../../../..');
const OUTPUT_DIR = path.join(__dirname, '../app');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function processHTML(html) {
  // Extract body
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;
  
  let bodyClassMatch = html.match(/<body[^>]*class="([^"]*)"/i);
  let bodyClass = bodyClassMatch ? bodyClassMatch[1] : 'flex-1 bg-white';

  // Basic replacements
  content = content.replace(/class=/g, 'className=');
  content = content.replace(/<!--[\s\S]*?-->/g, ''); // remove comments
  
  // Replace tags
  const tagMap = {
    'div': 'View', 'header': 'View', 'footer': 'View', 'section': 'View', 
    'nav': 'View', 'ul': 'View', 'li': 'View', 'main': 'ScrollView',
    'span': 'Text', 'p': 'Text', 'h1': 'Text', 'h2': 'Text', 'h3': 'Text',
    'h4': 'Text', 'h5': 'Text', 'h6': 'Text', 'strong': 'Text',
    'button': 'Pressable', 'a': 'Pressable',
    'svg': 'Svg', 'path': 'Path', 'circle': 'Circle', 'rect': 'Rect'
  };

  for (const [htmlTag, rnTag] of Object.entries(tagMap)) {
    // Opening tag (ensure it is the exact tag, followed by space or >)
    let openRegex = new RegExp(`<${htmlTag}(?=\\s|>)([^>]*)>`, 'gi');
    content = content.replace(openRegex, `<${rnTag}$1>`);
    // Closing tag
    let closeRegex = new RegExp(`<\/${htmlTag}>`, 'gi');
    content = content.replace(closeRegex, `</${rnTag}>`);
  }

  // Handle self-closing input, br, hr
  content = content.replace(/<input([^>]*)(?<!\/)>/gi, '<TextInput$1 />');
  content = content.replace(/<br([^>]*)>/gi, '<View className="h-2" />');
  content = content.replace(/<hr([^>]*)>/gi, '<View className="w-full border-t border-gray-200 my-2" />');
  
  // Clean up any stray <style> or <script> that breaks JSX
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Escape stray curly braces inside text nodes that break JSX (heuristic)
  // E.g. tailwind config string in scripts might have { }, but we removed scripts
  // We'll replace { with {'{'} and } with {'}'} outside of tags, but this is hard in regex.
  // We can just rely on the script and style removal above which usually removes 99% of them.
  content = content.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, (match, before, src, after) => {
    // Convert class to className in before/after if present
    let combined = (before + ' ' + after).replace(/class=/g, 'className=').trim();
    return `<Image ${combined} source={{ uri: '${src}' }} />`;
  });

  // Handle inline styles (basic)
  content = content.replace(/style="([^"]*)"/gi, (match, styleStr) => {
    // For simplicity, just wipe out style="font-variation-settings:..."
    // Since React Native doesn't support HTML strings in style
    return ''; 
  });

  // SVG attributes to camelCase
  content = content.replace(/<([A-Z][a-zA-Z]*)([^>]*)>/g, (match, tag, attrs) => {
    if (['Svg', 'Path', 'Circle', 'Rect'].includes(tag)) {
      let newAttrs = attrs.replace(/([a-z]+)-([a-z]+)="([^"]*)"/gi, (m, p1, p2, val) => {
        return `${p1}${p2.charAt(0).toUpperCase() + p2.slice(1)}="${val}"`;
      });
      // specific fixes for SVG
      newAttrs = newAttrs.replace(/viewbox/i, 'viewBox');
      return `<${tag}${newAttrs}>`;
    }
    return match;
  });
  
  // Escape curly braces in text nodes
  // This is very rudimentary, we just replace stray { and } that aren't part of JSX expressions
  // But wait, the only JSX expressions we have are source={{...}}.
  // Let's just fix the known ones if needed later.
  
  // Self close paths/circles if they are not
  content = content.replace(/<(Path|Circle|Rect)([^>]*?)><\/\1>/gi, '<$1$2 />');
  // Some paths in HTML might not have closing tags, fix them
  content = content.replace(/<(Path|Circle|Rect)([^>]*?)(?<!\/)>/gi, '<$1$2 />');

  // Fix bare text inside View/ScrollView
  // This is too hard with pure regex without breaking things, so we will wrap bare text manually if needed
  // Let's assume Stitch puts text in span/h1/p mostly.

  return { content: content.trim(), bodyClass };
}

function convertFile(filePath, folderName) {
  const html = fs.readFileSync(filePath, 'utf-8');
  
  const componentName = folderName
    .replace(/^prema_/, '')
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const { content, bodyClass } = processHTML(html);

  const fileContent = `
import React from 'react';
import { View, Text, ScrollView, Image, Pressable, SafeAreaView, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function ${componentName}() {
  return (
    <SafeAreaView className="${bodyClass}">
      ${content}
    </SafeAreaView>
  );
}
`;

  const outPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
  fs.writeFileSync(outPath, fileContent.trim());
  console.log(`✅ Generated ${componentName}.tsx`);
}

function main() {
  const dirs = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isDirectory() && dir.name.startsWith('prema_')) {
      const htmlFile = path.join(ROOT_DIR, dir.name, 'code.html');
      if (fs.existsSync(htmlFile)) {
        convertFile(htmlFile, dir.name);
      }
    }
  }
}

main();
