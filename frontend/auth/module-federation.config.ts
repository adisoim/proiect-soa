export const mfConfig = {
  name: "auth",
  filename: "remoteEntry.js",
  exposes: {
    "./Login": "./src/Login.tsx",
    "./Register": "./src/Register.tsx",
  },
  shared: {
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
  },
};