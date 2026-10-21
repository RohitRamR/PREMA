const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Monorepo: web/admin/ui use a different React version that gets hoisted to the
// root node_modules. Force every import of React to resolve to this app's copy
// so Expo Go never loads two Reacts ("Invalid hook call" / blank screen).
const singletons = ["react"];
const appModules = path.resolve(__dirname, "node_modules");
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const pkg = singletons.find(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`)
  );
  if (pkg) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(appModules, "index.js") },
      moduleName,
      platform
    );
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
