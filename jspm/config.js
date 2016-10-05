SystemJS.config({
  browserConfig: {
    "paths": {
      "npm:": "/jspm/jspm_packages/npm/",
      "github:": "/jspm/jspm_packages/github/",
      "challenge/": "/src/"
    }
  },
  nodeConfig: {
    "paths": {
      "npm:": "jspm/jspm_packages/npm/",
      "github:": "jspm/jspm_packages/github/",
      "challenge/": "src/"
    }
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.16",
      "core-js": "npm:core-js@2.4.1",
      "babel": "npm:babel-core@5.8.38",
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
      "process": "github:jspm/nodelibs-process@0.2.0-alpha",
      "path": "github:jspm/nodelibs-path@0.2.0-alpha",
      "fs": "github:jspm/nodelibs-fs@0.2.0-alpha"
    },
    "packages": {
      "npm:babel-plugin-transform-react-jsx@6.8.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.9.0",
          "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.13.0"
        }
      },
      "npm:babel-runtime@6.11.6": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
        }
      },
      "npm:babel-helper-builder-react-jsx@6.9.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "esutils": "npm:esutils@2.0.2",
          "babel-types": "npm:babel-types@6.16.0",
          "lodash": "npm:lodash@4.16.3"
        }
      },
      "npm:babel-types@6.16.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.11.6",
          "esutils": "npm:esutils@2.0.2",
          "lodash": "npm:lodash@4.16.3",
          "to-fast-properties": "npm:to-fast-properties@1.0.2"
        }
      }
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "challenge": {
      "main": "challenge.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel",
          "babelOptions": {
            "plugins": [
              "babel-plugin-transform-react-jsx"
            ]
          }
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {},
  packages: {}
});
