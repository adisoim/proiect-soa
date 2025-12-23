export const mfConfig = {
  name: "host",
  remotes: {
    auth: "auth@http://localhost:3001/remoteEntry.js",
    tasks: "tasks@http://localhost:3002/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
  },
};