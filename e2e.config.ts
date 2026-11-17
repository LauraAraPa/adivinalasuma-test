import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { google } from '@ai-sdk/google';

export default {
  targets: [{ engine: web(), app: { url: 'http://localhost:8000' } }],
  agents: {
    default: { model: google('gemini-2.5-flash') },
  },
} satisfies E2EConfig;
