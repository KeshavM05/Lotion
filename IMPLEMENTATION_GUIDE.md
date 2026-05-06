# Zustand Store → Database Integration Guide

## Current Status

✅ **COMPLETED:**
- Database schema matches app structure
- All API routes use Supabase auth
- API client library ready ([src/lib/api-client.ts](src/lib/api-client.ts))
- Auth flow working (sign up/in, protected routes)

⏳ **TODO: Update Zustand Store**

The Zustand store ([src/lib/store.tsx](src/lib/store.tsx)) currently manages state in memory only. We need to connect it to the database API.

## Pattern to Follow

### 1. Add API Client Import

```tsx
import { goalsApi, tasksApi, milestonesApi, journalApi, eventsApi, aiMemoryApi } from "./api-client";
```

### 2. Add Loading State

```tsx
const [loading, setLoading] = useState(true);
const [initialized, setInitialized] = useState(false);
```

### 3. Add Load Initial Data Function

```tsx
const loadInitialData = useCallback(async () => {
  if (initialized) return;

  try {
    setLoading(true);
    const [goalsData, tasksData, journalData, eventsData, memoryData] = await Promise.all([
      goalsApi.list(),
      tasksApi.list(),
      journalApi.list(),
      eventsApi.list(),
      aiMemoryApi.get(),
    ]);

    setGoals(goalsData);
    setTasks(tasksData);
    setJournalEntries(journalData);
    setEvents(eventsData);
    setAiMemoryState(memoryData.memory);
    setInitialized(true);
  } catch (error) {
    console.error("Failed to load initial data:", error);
  } finally {
    setLoading(false);
  }
}, [initialized]);
```

### 4. Update CRUD Functions (Optimistic Updates Pattern)

**Before (memory only):**
```tsx
const addGoal = useCallback((data) => {
  const goal = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  setGoals([...goals, goal]);
  return goal;
}, []);
```

**After (with database):**
```tsx
const addGoal = useCallback(async (data) => {
  // 1. Optimistic update (instant UI)
  const tempId = `temp-${crypto.randomUUID()}`;
  const tempGoal = { ...data, id: tempId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  setGoals(prev => [...prev, tempGoal]);

  try {
    // 2. Save to database
    const savedGoal = await goalsApi.create(data);

    // 3. Replace temp with real data
    setGoals(prev => prev.map(g => g.id === tempId ? savedGoal : g));

    return savedGoal;
  } catch (error) {
    // 4. Rollback on error
    setGoals(prev => prev.filter(g => g.id !== tempId));
    console.error("Failed to create goal:", error);
    throw error;
  }
}, []);
```

### 5. Same Pattern for Update/Delete

**Update:**
```tsx
const updateGoal = useCallback(async (id, updates) => {
  const oldGoal = goals.find(g => g.id === id);

  // Optimistic update
  setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g));

  try {
    const updated = await goalsApi.update(id, updates);
    setGoals(prev => prev.map(g => g.id === id ? updated : g));
  } catch (error) {
    // Rollback
    setGoals(prev => prev.map(g => g.id === id ? oldGoal : g));
    throw error;
  }
}, [goals]);
```

**Delete:**
```tsx
const deleteGoal = useCallback(async (id) => {
  const oldGoal = goals.find(g => g.id === id);

  // Optimistic delete
  setGoals(prev => prev.filter(g => g.id !== id));

  try {
    await goalsApi.delete(id);
  } catch (error) {
    // Rollback
    setGoals(prev => [...prev, oldGoal]);
    throw error;
  }
}, [goals]);
```

### 6. Call loadInitialData on Mount

In `StoreProvider`:

```tsx
useEffect(() => {
  loadInitialData();
}, [loadInitialData]);
```

### 7. Add to Context Interface

```tsx
interface StoreContextType {
  // ... existing fields
  loading: boolean;
  loadInitialData: () => Promise<void>;
}
```

## Apply This Pattern To:

- ✅ Goals (addGoal, updateGoal, deleteGoal)
- ✅ Milestones (addMilestone, updateMilestone, deleteMilestone)
- ✅ Tasks (addTask, updateTask, deleteTask)
- ✅ Journal (addJournalEntry, updateJournalEntry, deleteJournalEntry)
- ✅ Events (addEvent, updateEvent, deleteEvent)
- ✅ AI Memory (setAiMemory)
- ⚠️ Chat Messages - Keep in-memory for now (AI not wired yet)

## User Initialization

Add to `DashboardInner` component in [src/app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx):

```tsx
import { initializeUser } from "@/lib/api-client";

useEffect(() => {
  if (user) {
    // Initialize user in database
    initializeUser().then(() => {
      // Then load all data
      loadInitialData();
    });
  }
}, [user]);
```

## Testing Checklist

After implementing:

1. ✅ Sign up creates user in database
2. ✅ Create goal → shows in UI immediately → persists on refresh
3. ✅ Update goal → updates immediately → persists on refresh
4. ✅ Delete goal → removes immediately → gone on refresh
5. ✅ Same for tasks, milestones, journal, events
6. ✅ AI Memory updates persist
7. ✅ Sign out → sign back in → all data still there

## Quick Start

```bash
# 1. Create .env.local
cp .env.local.example .env.local
# Edit with your Neon DATABASE_URL and Supabase credentials

# 2. Push database schema
npm run db:push

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
# 5. Sign up with email/password
# 6. Try creating goals, tasks, etc.
```

## Notes

- **Optimistic updates** keep UI feeling instant
- **Rollback on error** prevents data loss
- **loadInitialData** called once on mount
- **All mutations are async** - add error handling in UI components
- **Chat messages** stay in-memory until AI is wired to Bedrock
