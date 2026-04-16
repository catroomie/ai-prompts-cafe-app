import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  dangerous: {
    disableIncrementalCache: true,
    disableTagCache: true,
  },
});
