module.exports = {
    "env": {
        "es2021": true
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "no-unused-vars": "off",
      "no-underscore-dangle": [
        "error",
        {
          "allow": [
            "_id"
          ]
        }
      ]
    }
}


