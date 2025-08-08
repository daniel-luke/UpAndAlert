// server/routes/ws/heartbeat/[id].ts
import { defineWebSocketHandler } from 'h3'
import { MonitorService } from '~~/server/modules/monitoring/services/MonitorService'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'

type IncomingMessage = {
    action: string
    monitorList?: number[]
    data?: string
}

type OutgoingMessage = {
    action: string
    data: string | object[] | object
}

export default defineWebSocketHandler({
    async open(peer) {
        peer.send(JSON.stringify({ action: 'connect', data: 'Welcome to the pool!' }))
    },
    async message(peer, message) {
        let incomingMessage: IncomingMessage
        try {
            incomingMessage = JSON.parse(message.text())
        } catch {
            peer.send(JSON.stringify({ error: 'Invalid JSON' }))
            return
        }

        if (!incomingMessage.action) {
            peer.send(JSON.stringify({ error: 'Action missing' }))
            return
        }

        switch (incomingMessage.action) {
            case 'subscribe':
                await subscribe(incomingMessage, peer)
                break
            case 'unsubscribe':
                await unsubscribe(incomingMessage, peer)
                break
            case 'close':
                peer.send('Goodbye!')
                peer.close()
                break
            default:
                peer.send('Unknown message')
        }
    },

    close(peer) {
        peer.close()
    },

    error(peer, error) {
        console.error('WebSocket error:', error)
    }
})

/**
 * Subscribes to a list of monitors and sends the data to the client
 * @param msg
 * @param peer
 * @param peer.send
 */
async function subscribe(msg: IncomingMessage, peer: { send: (arg0: string) => void }) {
    if (!msg.monitorList) {
        peer.send(JSON.stringify({ error: 'Monitor list missing' }))
        return
    }

    const monitorService: MonitorService = MonitorService.getInstance()
    const response: OutgoingMessage = {
        action: 'subscribe',
        data: []
    }

    const dataArray = []
    for (let i = 0; i < msg.monitorList.length; i++) {
        const foundMonitor: Monitor | undefined = await monitorService.getMonitorById(
            msg.monitorList[i]
        )
        if (!foundMonitor) break

        const history = (await monitorService.getHeartBeatHistory(foundMonitor, 14)).reverse()
        const hbHistory = []

        for (const heartbeat of history) {
            hbHistory.push({
                created_at: heartbeat.created_at,
                status: heartbeat.status,
                status_code: heartbeat.status_code,
                response_time: Math.floor(heartbeat.response_time)
            })
        }

        dataArray.push({
            id: foundMonitor.id,
            data: hbHistory
        })
        addMonitorClient(foundMonitor.id.toString(), peer)
    }
    response.data = dataArray
    peer.send(JSON.stringify(response))
}

/**
 * Unsubscribes from a list of monitors
 * @param msg
 * @param peer
 * @param peer.send
 */
async function unsubscribe(msg: IncomingMessage, peer: { send: (arg0: string) => void }) {
    if (!msg.monitorList) {
        peer.send(JSON.stringify({ error: 'Monitor list missing' }))
        return
    }
    for (let i = 0; i < msg.monitorList.length; i++) {
        removeMonitorClient(msg.monitorList[i].toString(), peer)
    }
}
