// server/utils/monitor-clients.ts
const monitorClients = new Map<string, Set<any>>() // Set<Peer>

export function addMonitorClient(monitorId: string, peer: any) {
    if (!monitorClients.has(monitorId)) {
        monitorClients.set(monitorId, new Set())
    }
    monitorClients.get(monitorId)!.add(peer)
}

export function removeMonitorClient(monitorId: string, peer: any) {
    monitorClients.get(monitorId)?.delete(peer)
    if (monitorClients.get(monitorId)?.size === 0) {
        monitorClients.delete(monitorId)
    }
}

export function sendMonitorUpdate(monitorId: string, data: any) {
    const clients = monitorClients.get(monitorId)
    if (!clients) return
    for (const peer of clients) {
        peer.send(JSON.stringify(data))
    }
}
