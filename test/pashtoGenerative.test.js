import { describe, it } from "node:test";
import assert from "node:assert/strict";
import PashtoGenerative, { PashtoLexicaError } from "../pashtoGenerative.js";

describe("PashtoGenerative configuration", () => {
    it("requires apiKey or proxyUrl", () => {
        assert.throws(() => new PashtoGenerative({}), PashtoLexicaError);
    });

    it("rejects apiKey and proxyUrl together", () => {
        assert.throws(
            () =>
                new PashtoGenerative({
                    apiKey: "test-key",
                    proxyUrl: "https://example.com/api",
                }),
            PashtoLexicaError,
        );
    });

    it("accepts string apiKey shorthand", () => {
        const instance = new PashtoGenerative("test-key");
        assert.ok(instance);
    });

    it("accepts apiKey string with optional model string", () => {
        const instance = new PashtoGenerative("test-key", "gemini-3.8-flash");
        assert.equal(instance.modelId, "gemini-3.8-flash");
    });

    it("accepts apiKey string with extra options object", () => {
        const instance = new PashtoGenerative("test-key", { model: "custom-model" });
        assert.equal(instance.modelId, "custom-model");
    });

    it("uses default model when model option is omitted", () => {
        const instance = new PashtoGenerative({ apiKey: "test-key" });
        assert.equal(instance.modelId, "gemini-3.8-flash");
    });
});

describe("processText validation", () => {
    it("rejects empty text", async () => {
        const lexica = new PashtoGenerative({ proxyUrl: "https://example.com/api" });
        await assert.rejects(() => lexica.processText("   "), (err) => {
            assert.equal(err.code, "EMPTY_INPUT");
            return true;
        });
    });

    it("rejects oversized text", async () => {
        const lexica = new PashtoGenerative({
            proxyUrl: "https://example.com/api",
            maxFileBytes: 16,
        });
        await assert.rejects(() => lexica.processText("this text is definitely too long"), (err) => {
            assert.equal(err.code, "FILE_TOO_LARGE");
            return true;
        });
    });
});
