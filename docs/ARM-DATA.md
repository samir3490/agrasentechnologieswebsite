# ARM data storage note

Live ARM data in Firebase project `agrasen-technologies` uses these collection IDs:

- `ripAccounts/{accountId}/...`
- `ripUsers/{userId}/...`

These names are **legacy** from the old RIP product name. They are still required for production data. Renaming them to `armAccounts` / `armUsers` would need a coordinated Firestore migration + rules + code update.

The product, URLs, and UI are **AI Relationship Manager** only.
