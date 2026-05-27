# Event Flows

## Event Creation

### Part 1: Open Create Event

1. **Navigate to Event Creation**
   - User goes to `/league/{leagueId}/schedule` and clicks "Add Event" for a round
   - Event creation modal or panel opens
   - Controller in [src/features/leagues/forms/Schedule/EventForm/EventForm.tsx](src/features/leagues/forms/Schedule/EventForm/EventForm.tsx)

2. **Fill Event Details**
   - User enters event name, date, time, and selects track/cars
   - Form validates required fields and date/time logic
   - Validation schema in [src/features/leagues/forms/Schedule/EventForm/eventFormSchema.ts](src/features/leagues/forms/Schedule/EventForm/eventFormSchema.ts)

3. **Submit Event**
   - Dispatches `createEvent` mutation
   - Event is added to the round in the schedule
   - API in [src/rtkQuery/API/eventApi.ts](src/rtkQuery/API/eventApi.ts)

---

## Event Deletion

### Part 1: Open Delete Event

1. **Open Event Actions**
   - User opens event actions menu ("..." or similar) on the event card
   - Clicks "Delete Event"
   - Confirmation modal opens
   - Modal in [src/features/leagues/forms/Schedule/DeleteEvent/DeleteEvent.tsx](src/features/leagues/forms/Schedule/DeleteEvent/DeleteEvent.tsx)

2. **Confirm Deletion**
   - User must confirm deletion (may require typing event name)
   - Schema in [src/features/leagues/forms/Schedule/DeleteEvent/deleteEventSchema.ts](src/features/leagues/forms/Schedule/DeleteEvent/deleteEventSchema.ts)

3. **Submit Deletion**
   - Dispatches `deleteEvent` mutation
   - Event is removed from the round
   - API in [src/rtkQuery/API/eventApi.ts](src/rtkQuery/API/eventApi.ts)

---

## Event Briefing

### Part 1: Open/Edit Briefing

1. **Open Briefing Modal**
   - User clicks "Briefing" button for a round or event
   - Briefing modal opens
   - Modal in [src/pages/League/modals/BriefingModal/BriefingModal.tsx](src/pages/League/modals/BriefingModal/BriefingModal.tsx)

2. **Edit Briefing Content**
   - User enters or edits rich text briefing (TipTap editor)
   - Briefing may include images, links, formatting
   - Editor in [src/features/leagues/forms/Schedule/BriefingEditor/BriefingEditor.tsx](src/features/leagues/forms/Schedule/BriefingEditor/BriefingEditor.tsx)

3. **Save Briefing**
   - Dispatches `updateEventBriefing` mutation
   - Briefing is saved to the event/round
   - API in [src/rtkQuery/API/eventApi.ts](src/rtkQuery/API/eventApi.ts)

---

## Event Name Change

### Part 1: Edit Event Name

1. **Open Event Edit**
   - User opens event actions menu and selects "Edit Event"
   - Event form modal opens with current event details
   - Form in [src/features/leagues/forms/Schedule/EventForm/EventForm.tsx](src/features/leagues/forms/Schedule/EventForm/EventForm.tsx)

2. **Change Event Name**
   - User edits the event name field
   - Validation checks for required and unique name
   - Schema in [src/features/leagues/forms/Schedule/EventForm/eventFormSchema.ts](src/features/leagues/forms/Schedule/EventForm/eventFormSchema.ts)

3. **Submit Name Change**
   - Dispatches `updateEvent` mutation
   - Event name is updated in the schedule
   - API in [src/rtkQuery/API/eventApi.ts](src/rtkQuery/API/eventApi.ts)
