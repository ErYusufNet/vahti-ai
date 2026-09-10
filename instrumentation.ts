/**
 * Next.js instrumentation-koukku. Ajetaan kerran palvelimen käynnistyessä.
 * Görev 8: käynnistää node-cron-ajastimen (vain Node.js-runtimessa ja jos
 * ENABLE_CRON !== "false").
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if ((process.env.ENABLE_CRON ?? "true") === "false") {
    console.log("[instrumentation] ENABLE_CRON=false — ajastinta ei käynnistetä.");
    return;
  }
  const { startScheduler } = await import("./lib/workflows/scheduler");
  startScheduler();
}
