/**
 * Base Repository (Generic CRUD)
 * Provides reusable database operations for any Prisma model.
 * All repositories extend this base to avoid code duplication.
 *
 * Design decision: accepts a Prisma delegate via constructor injection,
 * so if the database changes, only this layer needs updating — service layer stays intact.
 */

/**
 * Minimal interface that any Prisma delegate must satisfy.
 * This keeps the base repository decoupled from specific Prisma model types.
 * ======================================================|
 * This interface calls Contract/Abstraction             |
 * means: انا مايهمني ايش التنفيذ..                         |
 *      اهم شيء عندي اي اوبجكت يجي هنا يلتزم بهذه الدوال  |
 * ----------------------------------------------------|
 * Section            Role                            |
 * --------------------------------------------------|
 * interface      Defin "what do you need"          |
 * ------------------------------------------------|
 * Class        implm "How you use it"            |
 * ----------------------------------------------|
 *
 * what is the diff between interface and this class
 *
 * interface represent Abstraction/Contract
 * يحدد العمليات المطلوبه بدون ربطها بتنفيذ معين
 * ------------------------------------------------------------------------
 * BaseRepository Class represent implm depends on this Abstraction/Contract
 * by "Dependecy injection"
 * ------------------------------------------------------------------------
 *  this design يحقق
 *  1 - decoupling between data layer and ORM(Prisma)
 *  2 - I can testing the delegate with out changing business logic
 *  3 - Support Scalabitiy to any new data soruce
 * ------------------------------------------------------------------------
 */

export interface RepositoryAdapter {
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
}

// export class BaseRepository<T> {
//   /**
//    * Old way 
//    * private delegate: PrismaDelegate;
//    * constructor(delegate: PrismaDelegate){
//    * this.delegate = delegate
//    * }
//    ==================================================
//    new way: 
//   constructor(protected readonly delegate: PrismaDelegate) {}
// ==============================================================
//   1- protected : الطبقات الوريثه تستطيع ان تستعمل this.delegate
//   2- readonly : بعد انشاء الاوبجت ماتقدر تغير
//   3- delegate: يشير الى prisma.user or prisma.old
//    */
//   constructor(protected readonly delegate: RepositoryAdapter) {}

//   /**
//    * Find a single record by its unique ID.
//    */
//   async findById(
//     id: string,
//     include?: Record<string, boolean>
//   ): Promise<T | null> {
//     return this.delegate.findUnique({
//       where: { id },
//       ...(include ? { include } : {}),
//     });
//   }

//   /**
//    * Find the first record matching the given conditions.
//    */
//   async findFirst(
//     where: Record<string, unknown>,
//     include?: Record<string, boolean>
//   ): Promise<T | null> {
//     return this.delegate.findFirst({
//       where,
//       ...(include ? { include } : {}),
//     });
//   }

//   /**
//    * Find all records matching the given conditions.
//    */
//   async findMany(
//     where?: Record<string, unknown>,
//     options?: {
//       skip?: number;
//       take?: number;
//       orderBy?: Record<string, string>;
//       include?: Record<string, boolean>;
//     }
//   ): Promise<T[]> {
//     return this.delegate.findMany({
//       ...(where ? { where } : {}),
//       ...options,
//     });
//   }

//   /**
//    * Create a new record.
//    */
//   async create(
//     data: Record<string, unknown>,
//     include?: Record<string, boolean>
//   ): Promise<T> {
//     return this.delegate.create({
//       data,
//       ...(include ? { include } : {}),
//     });
//   }

//   /**
//    * Update a record by its ID.
//    */
//   async update(
//     id: string,
//     data: Record<string, unknown>,
//     include?: Record<string, boolean>
//   ): Promise<T> {
//     return this.delegate.update({
//       where: { id },
//       data,
//       ...(include ? { include } : {}),
//     });
//   }

//   /**
//    * Delete a record by its ID.
//    */
//   async deleteById(id: string): Promise<T> {
//     return this.delegate.delete({
//       where: { id },
//     });
//   }

//   /**
//    * Count records matching the given conditions.
//    */
//   async count(where?: Record<string, unknown>): Promise<number> {
//     return this.delegate.count(where ? { where } : undefined);
//   }
// }
