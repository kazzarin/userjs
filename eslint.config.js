import globals from "globals";
import js from "@eslint/js";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.greasemonkey
            }
        },
        files: ["**/*.js"],
        rules: js.configs.recommended.rules
    }
];
