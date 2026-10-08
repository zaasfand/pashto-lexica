/**
 * Optional live test (not run in CI). Usage:
 *   GEMINI_API_KEY=your_key node test/integration-live.mjs
 */
import PashtoGenerative, { PashtoLexicaError } from "../pashtoGenerative.js";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Set GEMINI_API_KEY to run this script.");
    process.exit(1);
}

const lexica = new PashtoGenerative({ apiKey });
const text = "salam, za khpal waheed yam";

try {
    const out = await lexica.processText(text);
    console.log(JSON.stringify(out, null, 2));
} catch (error) {
    if (error instanceof PashtoLexicaError) {
        console.error(`${error.code}: ${error.message}`);
    } else {
        console.error(error);
    }
    process.exit(1);
}
