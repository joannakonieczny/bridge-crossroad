#!/usr/bin/env node

/**
 * Translation Key Sync Tool
 *
 * This tool helps maintain synchronization between:
 * - generated-raports/locales/en/translation.json (keys found in code by i18next-parser)
 * - messages/pl.ts (actual Polish translations used by next-intl)
 *
 * Usage:
 *   node scripts/sync-translation-keys.js              # Show differences
 *   node scripts/sync-translation-keys.js --full       # Show all keys
 *   node scripts/sync-translation-keys.js --json       # Output as JSON
 *   node scripts/sync-translation-keys.js --save       # Save results to file
 */

const fs = require("fs");
const path = require("path");

// Configuration
const CONFIG = {
  TRANSLATION_JSON_PATH: "generated-raports/locales/en/translation.json",
  PL_MESSAGES_PATH: "messages/pl.ts",
  OUTPUT_FILE: "generated-raports/key-sync-report.json",
};

// Command line arguments
const args = process.argv.slice(2);
const options = {
  full: args.includes("--full"),
  json: args.includes("--json"),
  save: args.includes("--save"),
  help: args.includes("--help") || args.includes("-h"),
};

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🔧 Translation Key Sync Tool

This tool compares translation keys between your code (found by i18next-parser) 
and your Polish translation file (messages/pl.ts).

Usage:
  npm run i18n:compare                    # Show key differences
  npm run i18n:compare -- --full          # Show all keys with details
  npm run i18n:compare -- --json          # Output results as JSON
  npm run i18n:compare -- --save          # Save report to file
  npm run i18n:compare -- --help          # Show this help

Files analyzed:
  📄 ${CONFIG.TRANSLATION_JSON_PATH}
  📄 ${CONFIG.PL_MESSAGES_PATH}

Workflow:
  1. Write code using useTranslations("key") or t("key")
  2. Run: npm run i18n:extract (to find keys in your code)
  3. Run: npm run i18n:compare (to see what needs translation)
  4. Update messages/pl.ts with missing Polish translations
  5. Repeat until all keys are synchronized
`);
}

/**
 * Recursively extract all keys from nested object
 */
function extractKeys(obj, prefix = "") {
  if (typeof obj !== "object" || obj === null) {
    return [];
  }

  const keys = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        keys.push(...extractKeys(obj[key], currentKey));
      } else {
        keys.push(currentKey);
      }
    }
  }
  return keys;
}

/**
 * Parse TypeScript messages file structure
 */
function parseMessagesFileStructure(content) {
  // Extract all potential translation keys from the TypeScript file
  const keys = new Set();

  // Remove comments and clean up
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/import\s+.*?from\s+.*?;/g, "");

  // Find object property keys
  const propertyPattern = /(\w+):\s*["'`]/g;
  const nestedPropertyPattern = /(\w+):\s*\{/g;

  let match;

  // Extract simple properties
  while ((match = propertyPattern.exec(cleanContent)) !== null) {
    keys.add(match[1]);
  }

  // Extract nested structure by analyzing the const definitions and references
  const constPattern = /const\s+(\w+)\s*=\s*\{[\s\S]*?\};/g;
  const constRefs = new Map();

  while ((match = constPattern.exec(cleanContent)) !== null) {
    const constName = match[1];
    const constBody = match[0];

    // Extract properties from this const
    const propPattern = /(\w+):\s*["'`]/g;
    let propMatch;
    while ((propMatch = propPattern.exec(constBody)) !== null) {
      if (!constRefs.has(constName)) {
        constRefs.set(constName, []);
      }
      constRefs.get(constName).push(propMatch[1]);
    }
  }

  // Find the main export structure
  const exportMatch = cleanContent.match(/export\s+default\s+\{([\s\S]*?)\};/);
  if (exportMatch) {
    const exportBody = exportMatch[1];

    // Find references to const objects
    const refPattern = /(\w+):\s*(\w+)[,\s]/g;
    while ((match = refPattern.exec(exportBody)) !== null) {
      const exportKey = match[1];
      const refName = match[2];

      if (constRefs.has(refName)) {
        // Add nested keys
        constRefs.get(refName).forEach((prop) => {
          keys.add(`${exportKey}.${prop}`);
        });
      }
    }

    // Find direct properties in export
    const directPropPattern = /(\w+):\s*\{[\s\S]*?\}/g;
    while ((match = directPropPattern.exec(exportBody)) !== null) {
      const sectionName = match[1];
      const sectionBody = match[0];

      // Extract properties from this section
      const sectionPropPattern = /(\w+):\s*["'`]/g;
      let sectionPropMatch;
      while (
        (sectionPropMatch = sectionPropPattern.exec(sectionBody)) !== null
      ) {
        keys.add(`${sectionName}.${sectionPropMatch[1]}`);
      }
    }
  }

  return Array.from(keys).sort();
}

/**
 * Analyze and compare translation keys
 */
function analyzeKeys() {
  const results = {
    timestamp: new Date().toISOString(),
    files: {
      translationJson: CONFIG.TRANSLATION_JSON_PATH,
      polishMessages: CONFIG.PL_MESSAGES_PATH,
    },
    stats: {},
    missingInPolish: [],
    missingInTranslation: [],
    synchronized: [],
    errors: [],
  };

  try {
    // Read translation.json
    if (!fs.existsSync(CONFIG.TRANSLATION_JSON_PATH)) {
      results.errors.push(
        `Translation file not found: ${CONFIG.TRANSLATION_JSON_PATH}`
      );
      return results;
    }

    const translationJson = JSON.parse(
      fs.readFileSync(CONFIG.TRANSLATION_JSON_PATH, "utf8")
    );
    const translationKeys = extractKeys(translationJson).sort();

    // Read and parse messages/pl.ts
    if (!fs.existsSync(CONFIG.PL_MESSAGES_PATH)) {
      results.errors.push(
        `Polish messages file not found: ${CONFIG.PL_MESSAGES_PATH}`
      );
      return results;
    }

    const plMessagesContent = fs.readFileSync(CONFIG.PL_MESSAGES_PATH, "utf8");
    const plKeys = parseMessagesFileStructure(plMessagesContent).sort();

    // Calculate differences
    results.missingInPolish = translationKeys.filter(
      (key) => !plKeys.includes(key)
    );
    results.missingInTranslation = plKeys.filter(
      (key) => !translationKeys.includes(key)
    );
    results.synchronized = translationKeys.filter((key) =>
      plKeys.includes(key)
    );

    // Calculate stats
    results.stats = {
      totalTranslationKeys: translationKeys.length,
      totalPolishKeys: plKeys.length,
      synchronized: results.synchronized.length,
      missingInPolish: results.missingInPolish.length,
      missingInTranslation: results.missingInTranslation.length,
      syncPercentage: Math.round(
        (results.synchronized.length /
          Math.max(translationKeys.length, plKeys.length)) *
          100
      ),
    };

    // Add all keys for full report
    if (options.full) {
      results.allTranslationKeys = translationKeys;
      results.allPolishKeys = plKeys;
    }
  } catch (error) {
    results.errors.push(`Analysis error: ${error.message}`);
  }

  return results;
}

/**
 * Display results in console
 */
function displayResults(results) {
  if (results.errors.length > 0) {
    console.log("❌ Errors:");
    results.errors.forEach((error) => console.log(`   ${error}`));
    console.log();
    return;
  }

  const stats = results.stats;

  console.log("🔍 Translation Key Synchronization Report");
  console.log("=".repeat(50));
  console.log(`📊 Statistics:`);
  console.log(`   Keys in translation.json: ${stats.totalTranslationKeys}`);
  console.log(`   Keys in messages/pl.ts:   ${stats.totalPolishKeys}`);
  console.log(`   Synchronized keys:        ${stats.synchronized}`);
  console.log(`   Sync percentage:          ${stats.syncPercentage}%`);
  console.log();

  if (results.missingInPolish.length > 0) {
    console.log("🚫 Keys found in code but MISSING Polish translations:");
    console.log("   (Add these to messages/pl.ts)");
    console.log("-".repeat(60));

    const displayCount = options.full
      ? results.missingInPolish.length
      : Math.min(15, results.missingInPolish.length);

    for (let i = 0; i < displayCount; i++) {
      const key = results.missingInPolish[i];
      console.log(`   ${(i + 1).toString().padStart(3, " ")}. ${key}`);
    }

    if (results.missingInPolish.length > displayCount) {
      console.log(
        `   ... and ${results.missingInPolish.length - displayCount} more keys`
      );
      console.log(`   (Use --full flag to see all keys)`);
    }
    console.log();
  }

  if (results.missingInTranslation.length > 0) {
    console.log("🔍 Keys in messages/pl.ts but NOT FOUND in code:");
    console.log("   (Either use these keys in components or remove them)");
    console.log("-".repeat(60));

    const displayCount = options.full
      ? results.missingInTranslation.length
      : Math.min(10, results.missingInTranslation.length);

    for (let i = 0; i < displayCount; i++) {
      const key = results.missingInTranslation[i];
      console.log(`   ${(i + 1).toString().padStart(3, " ")}. ${key}`);
    }

    if (results.missingInTranslation.length > displayCount) {
      console.log(
        `   ... and ${
          results.missingInTranslation.length - displayCount
        } more keys`
      );
    }
    console.log();
  }

  if (stats.syncPercentage === 100) {
    console.log("🎉 Perfect! All translation keys are synchronized.");
  } else {
    console.log("⚠️  Next steps:");
    if (results.missingInPolish.length > 0) {
      console.log("   1. Add missing Polish translations to messages/pl.ts");
    }
    if (results.missingInTranslation.length > 0) {
      console.log(
        "   2. Use translation keys in your components or remove unused ones"
      );
    }
    console.log("   3. Run npm run i18n:extract to update translation.json");
    console.log("   4. Run this tool again to verify synchronization");
  }
  console.log();
}

/**
 * Main function
 */
function main() {
  if (options.help) {
    showHelp();
    return;
  }

  const results = analyzeKeys();

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    displayResults(results);
  }

  if (options.save) {
    // Ensure directory exists
    const outputDir = path.dirname(CONFIG.OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(CONFIG.OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`📁 Report saved to: ${CONFIG.OUTPUT_FILE}`);
  }
}

// Run the tool
if (require.main === module) {
  main();
}

module.exports = { analyzeKeys, extractKeys, parseMessagesFileStructure };
