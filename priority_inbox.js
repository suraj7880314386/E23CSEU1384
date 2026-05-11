// Stage 1 priority inbox implementation

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

// custom logger to avoid console.log for business logic as requested
const logger = {
  info: (msg, meta = {}) =>
    console.log(
      JSON.stringify({ level: "INFO", timestamp: new Date().toISOString(), message: msg, ...meta })
    ),
  warn: (msg, meta = {}) =>
    console.warn(
      JSON.stringify({ level: "WARN", timestamp: new Date().toISOString(), message: msg, ...meta })
    ),
  error: (msg, meta = {}) =>
    console.error(
      JSON.stringify({ level: "ERROR", timestamp: new Date().toISOString(), message: msg, ...meta })
    ),
};

// notification weights
const TYPE_WEIGHTS = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

async function fetchAllNotifications() {
  logger.info("Fetching notifications from API", { url: API_URL });

  // The API is a protected route – Bearer token assumed pre-authorised.
  const response = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    logger.error("Failed to fetch notifications", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  logger.info("Notifications fetched successfully", { count: data.notifications?.length ?? 0 });
  return data.notifications ?? [];
}

function computePriorityScore(notification, recencyBonus) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  return typeWeight + recencyBonus;
}

// get top N
function getTopNPriorityNotifications(notifications, n = 10) {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    logger.warn("No notifications to process");
    return [];
  }

  logger.info("Computing priority scores", { total: notifications.length, topN: n });

  // Sort by timestamp descending to assign recency bonuses
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp)
  );

  const total = sorted.length;

  // Assign recency bonus: most-recent gets total*10, next gets (total-1)*10, …
  const scored = sorted.map((notif, idx) => {
    const recencyBonus = (total - idx) * 10;
    const score = computePriorityScore(notif, recencyBonus);
    return { ...notif, _recencyBonus: recencyBonus, _priorityScore: score };
  });

  // Sort by priority score descending, break ties by timestamp
  scored.sort((a, b) => {
    if (b._priorityScore !== a._priorityScore) return b._priorityScore - a._priorityScore;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const topN = scored.slice(0, n);

  logger.info("Top-N notifications computed", {
    requested: n,
    returned: topN.length,
  });

  return topN;
}

(async () => {
  try {
    const N = parseInt(process.argv[2] ?? "10", 10);
    logger.info("Priority Inbox – Stage 1 started", { N });

    const notifications = await fetchAllNotifications();
    const topN = getTopNPriorityNotifications(notifications, N);

    console.log(`\n${"=".repeat(60)}`);
    console.log(`  TOP ${N} PRIORITY NOTIFICATIONS`);
    console.log("=".repeat(60));

    topN.forEach((n, i) => {
      console.log(
        `\n#${i + 1}  [${n.Type.toUpperCase()}]  Score: ${n._priorityScore}` +
          `  (type=${TYPE_WEIGHTS[n.Type]}, recency=+${n._recencyBonus})`
      );
      console.log(`    ID      : ${n.ID}`);
      console.log(`    Message : ${n.Message}`);
      console.log(`    Time    : ${n.Timestamp}`);
    });

    console.log("\n" + "=".repeat(60));
    logger.info("Priority Inbox – Stage 1 completed successfully");
  } catch (err) {
    logger.error("Unhandled error in Priority Inbox", { error: err.message });
    process.exit(1);
  }
})();
