module.exports = (grunt) => {
    "use strict";

    grunt.initConfig({
        ts: {
            app: {
                files: [{
                    src: ["src/\*\*/\*.ts", "!src/.baseDir.ts", "!src/_all.d.ts"],
                    dest: "./dest"
                }],
                options: {
                    module: "commonjs",
                    noLib: true,
                    target: "es6",
                    sourceMap: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "ts"
    ]);
};