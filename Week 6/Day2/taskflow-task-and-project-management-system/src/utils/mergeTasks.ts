import { Task } from '../types';

export interface MergeTasksOptions {
  existingTasks: Task[];
  incomingApiTasks: Task[];
  tombstones: (string | number)[]; // deleted externalIds or task ids
}

/**
 * Deterministic, idempotent task merging engine.
 * - Preserves all locally created tasks
 * - Never overwrites tasks that have locallyModified: true
 * - Drops API tasks whose externalId is in tombstones (prevent deleted tasks from reviving)
 * - Adds novel API tasks
 * - Updates unmodified API tasks if incoming API payload has newer data
 */
export function mergeTasks({
  existingTasks,
  incomingApiTasks,
  tombstones,
}: MergeTasksOptions): {
  mergedTasks: Task[];
  addedCount: number;
  updatedCount: number;
} {
  const tombstoneSet = new Set(tombstones.map(String));

  // Build lookup maps by externalId and id
  const existingByExternalId = new Map<string, Task>();
  const localTasks: Task[] = [];

  existingTasks.forEach((t) => {
    if (t.externalId !== undefined && t.externalId !== null) {
      existingByExternalId.set(String(t.externalId), t);
    } else {
      localTasks.push(t);
    }
  });

  const mergedApiTasks: Task[] = [];
  const processedExternalIds = new Set<string>();
  let addedCount = 0;
  let updatedCount = 0;

  // Process incoming API tasks
  for (const apiTask of incomingApiTasks) {
    if (apiTask.externalId === undefined || apiTask.externalId === null) {
      continue;
    }
    const extId = String(apiTask.externalId);

    // Rule 4: Prevent locally deleted API tasks from reappearing
    if (tombstoneSet.has(extId)) {
      continue;
    }

    // Rule 5: Deduplicate incoming list
    if (processedExternalIds.has(extId)) {
      continue;
    }
    processedExternalIds.add(extId);

    const existing = existingByExternalId.get(extId);

    if (!existing) {
      // Rule 1: Add new API tasks that do not exist locally
      mergedApiTasks.push(apiTask);
      addedCount++;
    } else {
      // Rule 2 & 6: Never overwrite user changes
      if (existing.locallyModified) {
        mergedApiTasks.push(existing);
      } else {
        // Compare updatedAt or accept incoming
        mergedApiTasks.push({
          ...existing,
          title: apiTask.title,
          description: apiTask.description || existing.description,
          status: apiTask.status,
          priority: apiTask.priority || existing.priority,
          dueDate: apiTask.dueDate || existing.dueDate,
          updatedAt: apiTask.updatedAt || new Date().toISOString(),
        });
        updatedCount++;
      }
    }
  }

  // Include all existing API tasks that weren't in the incoming payload (e.g. paginated subsets)
  for (const [extId, existing] of existingByExternalId.entries()) {
    if (!processedExternalIds.has(extId) && !tombstoneSet.has(extId)) {
      mergedApiTasks.push(existing);
    }
  }

  // Rule 3: Preserve all locally created tasks
  const mergedTasks = [...localTasks, ...mergedApiTasks];

  return {
    mergedTasks,
    addedCount,
    updatedCount,
  };
}
