import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

/** Start the real HTTP interface with separate output and no Atlas credentials. */
export async function startHttpServer() {
  const portReservation = createServer();
  portReservation.listen(0, "127.0.0.1");
  await once(portReservation, "listening");
  const { port } = portReservation.address();
  await new Promise((resolve, reject) => portReservation.close((error) => (error ? reject(error) : resolve())));

  const server = spawn(
    process.execPath,
    [require.resolve("next/dist/bin/next"), "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        NODE_ENV: "development",
        MONGO_URI: "",
        COFFEE_SHOP_HTTP_TEST: "1",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      windowsHide: true,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  let startupError;
  server.on("error", (error) => {
    startupError = error;
  });
  for (const stream of [server.stdout, server.stderr]) {
    stream.on("data", (chunk) => {
      output = (output + chunk.toString()).slice(-4000);
    });
  }

  async function stop() {
    if (server.exitCode !== null || server.signalCode !== null || !server.pid) return;
    const exited = once(server, "exit");
    if (process.platform === "win32") {
      // Next dev has a worker process; stop only this harness's process tree.
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
      await once(killer, "close");
    } else {
      process.kill(-server.pid, "SIGTERM");
    }
    await exited;
  }

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 90_000;
  try {
    while (Date.now() < deadline) {
      if (startupError) throw startupError;
      if (server.exitCode !== null || server.signalCode !== null) {
        throw new Error(`HTTP test server exited before becoming ready.\n${output}`);
      }
      try {
        const response = await fetch(`${baseUrl}/api/offerings`, { signal: AbortSignal.timeout(3000) });
        await response.arrayBuffer();
        if (response.ok) return { baseUrl, stop };
      } catch {
        // The listener and first route compilation may still be starting.
      }
      await delay(250);
    }
    throw new Error(`HTTP test server did not become ready within 90 seconds.\n${output}`);
  } catch (error) {
    await stop();
    throw error;
  }
}
