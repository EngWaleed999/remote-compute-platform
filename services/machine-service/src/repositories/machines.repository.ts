import { Prisma,Machine } from '@prisma/client-machine';
import { prisma } from '../config/prisma.js';


class MachineRepository {
    constructor(private db = prisma) { }


    // ═══════════════════════════════════════════════════
    // Core CRUD
    // ═══════════════════════════════════════════════════

    async findManyWithFilters(
        where: Prisma.MachineWhereInput,
        skip?: number,
        take?: number,
        orderBy?: Prisma.MachineOrderByWithRelationInput
    ) {
        return this.db.machine.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                specs: true,
                machineTags: { include: { tag: true } }
            }
        });
    }

    async create(data: Prisma.MachineCreateInput): Promise<Machine> {
        return this.db.machine.create({ data });
    }

    async update(id: string, data: Partial<Machine>): Promise<Machine> {
        return this.db.machine.update({
            where: { id },
            data: data,
        });
    }

    async delete(id: string): Promise<Machine> {
        return this.db.machine.delete({
            where: { id }
        })
    }

    async findById(id: string): Promise<Machine | null> {
        return this.db.machine.findUnique({
            where: { id },
            include: {
                specs: true,
                machineTags: {
                    include: { tag: true }
                }
            }
        });
    }

    async createWithSpecsAndTags(data: Prisma.MachineCreateInput): Promise<Machine> {
        // Prisma's nested writes automatically handle the transaction for you!                                               
        // You just need to pass the specs and tags inside the MachineCreateInput.                                            
        return this.db.machine.create({
            data,
            include: {
                specs: true,
                machineTags: { include: { tag: true } }
            }
        });
    }

}

export const machineRepository = new MachineRepository();                                                                     
