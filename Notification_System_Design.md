# Notification System Design - Stage 1

The main problem is dealing with high notification volumes where users might miss important updates like Placements or Results. We need a way to show the top N most important unread notifications.

### Priority Calculation

Each notification gets a score calculated based on its type and how recent it is.
Formula: `Priority = Type Weight + Recency`

Current weights decided:
- Placement: 300
- Result: 200
- Event: 100

For the recency bonus, we sort by timestamp desc and assign a higher bonus to newer ones (starting from total count * 10). This makes sure recent stuff ranks higher.

### How it works right now

1. Get data from API
2. Sort it by date to figure out the recency bonuses
3. Compute total score for each notification
4. Sort by the final score and take the top 10 (or whatever N is chosen).

Right now this runs in O(n log n) which is perfectly fine for basic batch fetching.

### How to optimize for dynamic streams

To make this better for high throughput (like continuous streams), we could use a Min-Heap restricted to size N.

Logic:
- When a new item comes, calculate its score.
- If heap has < N items, add it.
- Else, compare its score to the root (minimum item currently in top N).
- If new item is larger than min, remove root and add the new one.

This makes inserts O(log N) instead of having to re-sort everything every time, saving memory and processing.
