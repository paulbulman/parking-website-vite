import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { MOCK_TEST_MODE } from "./tests/config";

const mockAuthAliases = {
  "aws-amplify/auth": path.resolve(__dirname, "tests/mocks/amplify-auth.ts"),
  "aws-amplify": path.resolve(__dirname, "tests/mocks/amplify.ts"),
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve:
    mode === MOCK_TEST_MODE ? { alias: mockAuthAliases } : undefined,
}));
