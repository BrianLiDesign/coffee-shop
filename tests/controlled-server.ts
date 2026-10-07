import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

export async function startControlledServer() {
  const portReservation = createServer();
  portReservation.listen(0, "127.0.0.1");
  await once(portReservation, "listening");
  const address = portReservation.address();
  const port = typeof address === "object" && address ? address.port : 3000;
  await new Promise<void>((resolve, reject) => {
    portReservation.close((error) => (error ? reject(error) : resolve()));
  });

  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)],
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
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  async function stop() {
    if (server.exitCode !== null || server.signalCode !== null || !server.pid) return;

    const exited = once(server, "exit");
    if (process.platform === "win32") {
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
      if (server.exitCode !== null || server.signalCode !== null) {
        throw new Error(`Server exited before becoming ready.\n${output}`);
      }

      try {
        const response = await fetch(`${baseUrl}/api/offerings`, {
          signal: AbortSignal.timeout(3000),
        });
        await response.arrayBuffer();
        if (response.ok) {
          return { baseUrl, stop };
        }
      } catch {
        // app is still starting
      }

      await delay(250);
    }

    throw new Error(`Server did not become ready in time.\n${output}`);
  } catch (error) {
    await stop();
    throw error;
  }
}
