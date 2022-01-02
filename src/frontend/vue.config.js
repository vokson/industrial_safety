if (process.env.NODE_ENV === "production") {
  module.exports = {
    // Необходимо, чтобы build VueJS содержал исходные имена классов
    chainWebpack: (config) => {
      config.optimization.minimizer("terser").tap((args) => {
        const { terserOptions } = args[0];
        terserOptions.keep_classnames = true;
        terserOptions.keep_fnames = true;
        return args;
      });
    },
  };
}
