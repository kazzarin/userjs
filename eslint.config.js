import globals from "globals";

export default [
    "eslint:recommended",
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.greasemonkey
            }
        }
    }
];
