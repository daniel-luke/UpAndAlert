// server/utils/monitor-clients.ts
const monitorClients = new Map<string, Set<{ send: (string: string) => void }>>() // Set<Peer>

/**
 *
 * @param monitorId
 * @param peer
 * @param peer.send
 */
export function addMonitorClient(monitorId: string, peer: { send: (arg0: string) => void }) {
    if (!monitorClients.has(monitorId)) {
        monitorClients.set(monitorId, new Set())
    }
    monitorClients.get(monitorId)!.add(peer)
}

/**
 *
 * @param monitorId
 * @param peer
 * @param peer.send
 */
export function removeMonitorClient(monitorId: string, peer: { send: (arg0: string) => void }) {
    monitorClients.get(monitorId)?.delete(peer)
    if (monitorClients.get(monitorId)?.size === 0) {
        monitorClients.delete(monitorId)
    }
}

/**
 *
 * @param monitorId
 * @param data
 */
export function sendMonitorUpdate(
    monitorId: string,
    data: {
        created_at: Date
        status: 'up' | 'down' | 'degraded'
        status_code: number
        response_time: number
    }
) {
    const clients = monitorClients.get(monitorId)
    if (!clients) return
    for (const peer of clients) {
        peer.send(
            JSON.stringify({
                action: 'update',
                data: {
                    monitorId: monitorId,
                    heartbeat: data
                }
            })
        )
    }
}
