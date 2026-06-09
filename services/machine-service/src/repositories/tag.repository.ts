import { Prisma, Tag, Machine } from '@prisma/client-machine';
import { prisma } from '../config/prisma.js';

class TagRepository {
    constructor(private db = prisma) { }


    // ═══════════════════════════════════════════════════
    // Core CRUD
    // ═══════════════════════════════════════════════════

    async findAll() {
        return this.db.machine.findMany()
    }

    async create(data: Prisma.TagCreateInput): Promise<Tag> {
        return this.db.tag.create({ data })
    }

}

export const tagRepository = new TagRepository();                                                                             