// passwordWorker.js
import { parentPort } from "worker_threads";
import bcrypt from "bcrypt";

parentPort.on("message", async ({ password }) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    parentPort.postMessage({ success: true, hashed });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});
