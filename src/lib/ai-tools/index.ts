import { toolDefinitions, IMMEDIATE_TOOLS } from './definitions';
import {
  handleCreateTask,
  handleCreateGoal,
  handleCreateMilestone,
  handleCreateEvent,
  handleMoveEvent,
  handleSaveMemory,
  handleSearchKnowledge,
  type ToolResult,
} from './handlers';

export { toolDefinitions, IMMEDIATE_TOOLS };
export type { ToolResult };

export interface ProposedAction {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  summary: string;
}

export async function executeToolCall(
  toolName: string,
  input: Record<string, unknown>,
  userId: string
): Promise<ToolResult> {
  switch (toolName) {
    case 'create_task':
      return handleCreateTask(input as Parameters<typeof handleCreateTask>[0], userId);
    case 'create_goal':
      return handleCreateGoal(input as Parameters<typeof handleCreateGoal>[0], userId);
    case 'create_milestone':
      return handleCreateMilestone(input as Parameters<typeof handleCreateMilestone>[0], userId);
    case 'create_event':
      return handleCreateEvent(input as Parameters<typeof handleCreateEvent>[0], userId);
    case 'move_event':
      return handleMoveEvent(input as Parameters<typeof handleMoveEvent>[0], userId);
    case 'save_memory':
      return handleSaveMemory(input as Parameters<typeof handleSaveMemory>[0], userId);
    case 'search_knowledge':
      return handleSearchKnowledge(input as Parameters<typeof handleSearchKnowledge>[0], userId);
    default:
      return { summary: `Unknown tool: ${toolName}`, data: { error: 'Unknown tool' } };
  }
}
