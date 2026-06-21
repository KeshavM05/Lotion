import type { Tool } from '@aws-sdk/client-bedrock-runtime';

export const IMMEDIATE_TOOLS = new Set(['save_memory', 'search_knowledge']);

export const toolDefinitions: Tool[] = [
  {
    toolSpec: {
      name: 'create_task',
      description:
        'Create a task for the user. Use when they ask you to add a to-do, reminder, or action item.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Optional details' },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Priority level (default: medium)',
            },
            goalId: { type: 'string', description: 'ID of related goal, if any' },
            deadline: {
              type: 'string',
              description: 'Deadline as ISO 8601 datetime string',
            },
            durationMinutes: {
              type: 'number',
              description: 'Estimated duration in minutes (default: 30)',
            },
          },
          required: ['title'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'create_goal',
      description:
        'Create a new life goal for the user. Use when they express a new ambition, objective, or long-term aspiration.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Goal title' },
            description: { type: 'string', description: 'Goal description' },
            category: {
              type: 'string',
              enum: ['career', 'business', 'finance', 'personal', 'health', 'creative'],
              description: 'Goal category',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Priority level',
            },
            targetDate: {
              type: 'string',
              description: 'Target completion date as ISO 8601 string',
            },
            color: { type: 'string', description: 'Hex color for the goal card' },
          },
          required: ['title', 'category'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'create_milestone',
      description: 'Add a milestone to an existing goal. Use to break a goal into checkpoints.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            goalId: { type: 'string', description: 'ID of the parent goal' },
            title: { type: 'string', description: 'Milestone title' },
            description: { type: 'string', description: 'Optional details' },
            targetDate: {
              type: 'string',
              description: 'Target date as ISO 8601 string',
            },
          },
          required: ['goalId', 'title'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'create_event',
      description:
        'Schedule a calendar event. Use when the user asks to block time, schedule a meeting, or add something to their calendar.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Event title' },
            start: { type: 'string', description: 'Start time as ISO 8601 datetime' },
            end: { type: 'string', description: 'End time as ISO 8601 datetime' },
            description: { type: 'string', description: 'Optional description' },
            allDay: { type: 'boolean', description: 'Whether this is an all-day event' },
            color: { type: 'string', description: 'Hex color for the event' },
          },
          required: ['title', 'start', 'end'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'move_event',
      description: 'Reschedule an existing calendar event to a new time.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            eventId: { type: 'string', description: 'ID of the event to move' },
            newStart: { type: 'string', description: 'New start time as ISO 8601 datetime' },
            newEnd: { type: 'string', description: 'New end time as ISO 8601 datetime' },
          },
          required: ['eventId', 'newStart', 'newEnd'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'save_memory',
      description:
        'Save important information about the user to long-term memory. Use when the user tells you something about themselves that should be remembered for future conversations — preferences, life events, habits, decisions, corrections.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The fact or information to remember (one concise sentence)',
            },
          },
          required: ['content'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'search_knowledge',
      description:
        "Search the user's journals, knowledge base, and past memories. Use when you need to look up something the user mentioned before, or when they ask about past entries.",
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Natural language search query',
            },
          },
          required: ['query'],
        },
      },
    },
  },
];
