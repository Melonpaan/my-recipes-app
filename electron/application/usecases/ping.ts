export async function ping(): Promise<{ ok: true; timestamp: number }> {
  return { ok: true, timestamp: Date.now() }
}


