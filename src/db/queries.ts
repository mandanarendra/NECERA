import { db } from './index.ts';
import { modules, roadmapNodes, learningMaterials, tasks, users } from './schema.ts';
import { eq, or, asc } from 'drizzle-orm';

// 1. Modules Queries
export async function getModulesFromDb() {
  try {
    return await db.select().from(modules).orderBy(asc(modules.title));
  } catch (error) {
    console.error('Database query failed for getModulesFromDb:', error);
    throw new Error('Database query failed. Could not fetch modules.', { cause: error });
  }
}

export async function getModuleByIdFromDb(id: string) {
  try {
    const result = await db.select().from(modules).where(eq(modules.id, id));
    return result[0] || null;
  } catch (error) {
    console.error(`Database query failed for getModuleByIdFromDb(${id}):`, error);
    throw new Error('Database query failed. Could not fetch module.', { cause: error });
  }
}

export async function insertModuleToDb(moduleData: typeof modules.$inferInsert) {
  try {
    const result = await db
      .insert(modules)
      .values(moduleData)
      .onConflictDoUpdate({
        target: modules.id,
        set: {
          title: moduleData.title,
          description: moduleData.description,
          category: moduleData.category,
          difficulty: moduleData.difficulty,
          instructor: moduleData.instructor,
          thumbnail: moduleData.thumbnail,
          estimatedHours: moduleData.estimatedHours,
          prerequisites: moduleData.prerequisites,
          conceptsCount: moduleData.conceptsCount,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database insert failed for insertModuleToDb:', error);
    throw new Error('Database insert failed. Could not save module.', { cause: error });
  }
}

// 2. Roadmap Nodes Queries
export async function getRoadmapNodesFromDb(moduleId: string) {
  try {
    return await db
      .select()
      .from(roadmapNodes)
      .where(eq(roadmapNodes.moduleId, moduleId))
      .orderBy(asc(roadmapNodes.order));
  } catch (error) {
    console.error(`Database query failed for getRoadmapNodesFromDb(${moduleId}):`, error);
    throw new Error('Database query failed. Could not fetch roadmap nodes.', { cause: error });
  }
}

export async function insertRoadmapNodeToDb(nodeData: typeof roadmapNodes.$inferInsert) {
  try {
    const result = await db
      .insert(roadmapNodes)
      .values(nodeData)
      .onConflictDoUpdate({
        target: roadmapNodes.id,
        set: {
          conceptTitle: nodeData.conceptTitle,
          description: nodeData.description,
          difficulty: nodeData.difficulty,
          order: nodeData.order,
          prerequisites: nodeData.prerequisites,
          status: nodeData.status,
          estimatedMinutes: nodeData.estimatedMinutes,
          materialsCount: nodeData.materialsCount,
          tasksCount: nodeData.tasksCount,
          passScoreRequired: nodeData.passScoreRequired,
          weakTopics: nodeData.weakTopics,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database insert failed for insertRoadmapNodeToDb:', error);
    throw new Error('Database insert failed. Could not save roadmap node.', { cause: error });
  }
}

// 3. Learning Materials Queries
export async function getMaterialsFromDb(conceptId: string) {
  try {
    return await db
      .select()
      .from(learningMaterials)
      .where(eq(learningMaterials.conceptId, conceptId));
  } catch (error) {
    console.error(`Database query failed for getMaterialsFromDb(${conceptId}):`, error);
    throw new Error('Database query failed. Could not fetch materials.', { cause: error });
  }
}

export async function insertMaterialToDb(matData: typeof learningMaterials.$inferInsert) {
  try {
    const result = await db
      .insert(learningMaterials)
      .values(matData)
      .onConflictDoUpdate({
        target: learningMaterials.id,
        set: {
          title: matData.title,
          description: matData.description,
          type: matData.type,
          durationOrPages: matData.durationOrPages,
          content: matData.content,
          codeLanguage: matData.codeLanguage,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database insert failed for insertMaterialToDb:', error);
    throw new Error('Database insert failed. Could not save material.', { cause: error });
  }
}

// 4. Tasks Queries
export async function getTasksFromDb(conceptId: string) {
  try {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.conceptId, conceptId));
  } catch (error) {
    console.error(`Database query failed for getTasksFromDb(${conceptId}):`, error);
    throw new Error('Database query failed. Could not fetch tasks.', { cause: error });
  }
}

export async function insertTaskToDb(taskData: typeof tasks.$inferInsert) {
  try {
    const result = await db
      .insert(tasks)
      .values(taskData)
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          title: taskData.title,
          description: taskData.description,
          difficulty: taskData.difficulty,
          taskType: taskData.taskType,
          instructions: taskData.instructions,
          timeEstimateMinutes: taskData.timeEstimateMinutes,
          deadline: taskData.deadline,
          maxScore: taskData.maxScore,
          passingScore: taskData.passingScore,
          starterCode: taskData.starterCode,
          solutionHint: taskData.solutionHint,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database insert failed for insertTaskToDb:', error);
    throw new Error('Database insert failed. Could not save task.', { cause: error });
  }
}

// 5. Bulk Injection / Migration Helper
export async function injectModulesAndRoadmaps(
  moduleList: (typeof modules.$inferInsert)[],
  nodeList: (typeof roadmapNodes.$inferInsert)[],
  materialList?: (typeof learningMaterials.$inferInsert)[],
  taskList?: (typeof tasks.$inferInsert)[]
) {
  try {
    const insertedModules = [];
    for (const m of moduleList) {
      const res = await insertModuleToDb(m);
      insertedModules.push(res);
    }

    const insertedNodes = [];
    for (const n of nodeList) {
      const res = await insertRoadmapNodeToDb(n);
      insertedNodes.push(res);
    }

    if (materialList && materialList.length > 0) {
      for (const mat of materialList) {
        await insertMaterialToDb(mat);
      }
    }

    if (taskList && taskList.length > 0) {
      for (const t of taskList) {
        await insertTaskToDb(t);
      }
    }

    return {
      success: true,
      modulesInjected: insertedModules.length,
      nodesInjected: insertedNodes.length,
    };
  } catch (error) {
    console.error('Bulk injection into database failed:', error);
    throw new Error('Bulk database migration and injection failed.', { cause: error });
  }
}

// 6. User Authentication & Profile Queries
export async function findUserByEmailOrId(identifier: string) {
  try {
    const cleanId = identifier.trim().toLowerCase();
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.email, cleanId), eq(users.collegeId, identifier.trim())));
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed for findUserByEmailOrId:', error);
    throw new Error('Database query failed. Could not locate user.', { cause: error });
  }
}

export async function findUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error(`Database query failed for findUserByUid(${uid}):`, error);
    throw new Error('Database query failed. Could not locate user.', { cause: error });
  }
}

export async function createDbUser(userData: typeof users.$inferInsert) {
  try {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  } catch (error) {
    console.error('Database insert failed for createDbUser:', error);
    throw new Error('Database insert failed. Could not create user account.', { cause: error });
  }
}

export async function updateDbUser(uid: string, updates: Partial<typeof users.$inferInsert>) {
  try {
    const result = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error(`Database update failed for updateDbUser(${uid}):`, error);
    throw new Error('Database update failed. Could not update user profile.', { cause: error });
  }
}

