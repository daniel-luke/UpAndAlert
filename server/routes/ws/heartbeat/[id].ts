// server/routes/ws/heartbeat/[id].ts
import { defineWebSocketHandler } from 'h3'
import { addMonitorClient, removeMonitorClient } from '~~/server/utils/monitor-clients'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'

export default defineWebSocketHandler({
    async open(peer) {
        const monitorId = peer.websocket.url?.split('/').pop()
        if (!monitorId) {
            peer.send(JSON.stringify({ error: 'Monitor ID missing' }))
            peer.close()
            return
        }

        const monitorService = MonitorService.getInstance()
        const monitor = await monitorService.getMonitorById(parseInt(monitorId))
        if (!monitor) {
            peer.send(JSON.stringify({ error: 'Monitor not found' }))
            peer.close()
            return
        }

        const history = await monitorService.getHeartBeatHistory(monitor, 28)

        for (const heartbeat of history) {
            peer.send(
                JSON.stringify({
                    created_at: heartbeat.created_at,
                    status: heartbeat.status,
                    status_code: heartbeat.status_code
                })
            )
        }
        addMonitorClient(monitorId, peer)
    },

    close(peer) {
        const monitorId = peer.context?.params?.id
        if (!monitorId) return
        removeMonitorClient(monitorId, peer)
    },

    error(peer, error) {
        console.error('WebSocket error:', error)
    }
})
