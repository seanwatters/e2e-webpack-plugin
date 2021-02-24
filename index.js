const { exec } = require('child_process');

class e2eWebpackPlugin {
  constructor({ script, e2ePath, jestConfigPath, flags }) {
    this.script = script;
    this.e2ePath = e2ePath;
    this.jestConfigPath = jestConfigPath;
    this.flags = flags;
  }

  apply(compiler) {
    if (!this.script) {
      this.script = `npx jest ${this.e2ePath || 'e2e'} --config=${
        this.jestConfigPath || 'jest.config.js'
      } ${this.flags?.reduce((acc, flag) => `${acc} --${flag}`, '') || ''}`;
    }

    compiler.hooks.done.tap('E2eWebpackPlugin', () => {
      exec(this.script, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          process.exit(1);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          process.exit();
        }
        console.log(`stdout: ${stdout}`);
        process.exit();
      });
    });
  }
};

module.exports = e2eWebpackPlugin;