import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import { MonitorRepository } from '~~/server/modules/monitoring/repositories/MonitorRepository'
import { HttpMonitor } from '~~/server/modules/monitoring/models/HttpMonitor'
import type { Status } from '~~/server/modules/monitoring/types/Status'

/**
 * @name UserService
 * @description Service class for handling user-related operations.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export class MonitorService {
    private static instance: MonitorService

    private activeMonitorJobs: unknown[]

    /**
     * @name constructor
     * @description Private constructor to enforce singleton pattern.
     * @private
     * @param monitorRepository
     */
    private constructor(private monitorRepository: MonitorRepository) {
        this.activeMonitorJobs = []
    }

    /**
     * @name getInstance
     * @description Gets the singleton instance of the UserService.
     * @returns {UserService} The singleton instance of the UserService.
     */
    static getInstance(): MonitorService {
        if (!MonitorService.instance) {
            MonitorService.instance = new MonitorService(MonitorRepository.getInstance())
        }
        return MonitorService.instance
    }

    /**
     * @name getUserById
     * @description Retrieves a user by their ID.
     * @param id - The ID of the user to retrieve.
     * @returns {Promise<User | undefined>} A promise that resolves to the user if found, or undefined if not found.
     */
    async getUserById(id: number): Promise<Monitor | undefined> {
        return this.monitorRepository.findById(id)
    }

    /**
     * @name createUser
     * @param data.email
     * @param data.password
     * @param data.first_name
     * @param data.last_name
     * @param data
     * @param data.name
     * @param data.monitor_type
     * @param data.address
     * @param data.polling_interval
     * @param data.is_admin
     * @description Creates a new user.
     * @returns {Promise<User>} A promise that resolves to the created user.
     */
    async createMonitor(data: {
        name: string
        monitor_type: string
        address: string
        polling_interval: number
    }): Promise<Monitor> {
        return this.monitorRepository.create({
            name: data.name,
            monitor_type: data.monitor_type,
            address: data.address,
            polling_interval: data.polling_interval
        })
    }

    /**
     * @name updateUser
     * @description Updates a user's information.
     * @param id - The ID of the user to update.
     * @param updates - The updates to apply to the user.
     * @returns {Promise<User | undefined>} A promise that resolves to the updated user if found, or undefined if not found.
     */
    async updateMonitor(
        id: number,
        updates: Partial<Omit<Monitor, 'id' | 'in_maintenance' | 'is_active'>>
    ): Promise<Monitor | undefined> {
        return this.monitorRepository.update(id, updates)
    }

    /**
     * @name deleteUser
     * @description Deletes a user by their ID.
     * @param id - The ID of the user to delete.
     * @returns {Promise<void>} A promise that resolves when the user is deleted.
     */
    async deleteMonitor(id: number): Promise<void> {
        await this.monitorRepository.delete(id)
    }

    /**
     * @name listUsers
     * @description Lists all users.
     * @returns {Promise<User[]>} A promise that resolves to an array of all users.
     */
    async listMonitors(): Promise<Monitor[]> {
        return this.monitorRepository.all()
    }

    async startMonitor(monitor: Monitor) {
        switch (monitor.monitor_type) {
            case 'http': {
                const httpMonitor = new HttpMonitor(monitor)
                httpMonitor.startJob()
                this.activeMonitorJobs.push(httpMonitor)
                break
            }
            default:
                throw new Error('Invalid monitor type')
        }
    }

    async registerHeartBeat(monitor: Monitor, statusCode: number, status: Status) {
        return this.monitorRepository.registerHeartbeat(monitor, statusCode, status)
    }
}
