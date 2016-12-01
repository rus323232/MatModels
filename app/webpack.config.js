module.exports = {
    entry: "./modules/index",
    resolve: {
        modulesDirectories: [
            "."
        ],
        alias: {
            jquery: "libs/jquery-1.11.1.min",
            math: "libs/math.min"
        }
    },
    output: {
        path: "./libs/",
        filename: "bundle.js"
    }
};