module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}", "!messages/**"],
  output: "generated-raports/locales/$LOCALE/$NAMESPACE.json",
  options: {
    debug: false,
    func: {
      list: ["t", "i18next.t", "useTranslation.t", "getTranslations.t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    trans: {
      component: "Trans",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      fallbackKey: false,
    },
    keepRemoved: false,
  },
};
