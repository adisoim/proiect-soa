export const mfConfig = {
  name: "tasks",
  filename: "remoteEntry.js",
  exposes: {
    "./TaskManager": "./src/TaskManager.tsx",
  },
  shared: {
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
  },
};