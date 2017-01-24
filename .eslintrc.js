module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "ecmaFeatures": {
        "jsx": true,
        "modules": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": ["react"],
    "rules": {
        "no-console": 0,
        "no-unused-vars": 1,
        // "no-unexpected-multilines": 0,
        "indent": [
            "warn", 4
        ],
        "linebreak-style": [
            "error", "unix"
        ],
        "quotes": [
            "error", "single"
        ],
        "semi": [
            "error", "always"
        ],
        "react/jsx-boolean-value": 0,
        "jsx-quotes": 1,
        "react/jsx-no-undef": 1,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/no-did-mount-set-state": 0,
        "react/no-did-update-set-state": 2,
        "react/no-multi-comp": 1,
        "react/no-unknown-property": 1,
        "react/self-closing-comp": 1
    }
};
