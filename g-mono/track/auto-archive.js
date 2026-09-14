// g-mono/auto-archive.js
import { db, collection, getDocs, doc, setDoc, deleteDoc } from "https://sepal-vip.github.io/vip-games/web-info/firebase.js";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Checks all active Monopoly rooms.
 * Rooms older than 24 hours are copied to `games/Monopoly/archived_rooms` and deleted from `games/Monopoly/rooms`.
 */
export async function cleanAndArchiveOldRooms() {
    try {
        const roomsRef = collection(db, "games", "Monopoly", "rooms");
        const snapshot = await getDocs(roomsRef);
        const now = Date.now();
        let archivedCount = 0;

        for (const roomDoc of snapshot.docs) {
            const data = roomDoc.data();
            const roomId = roomDoc.id;
            const createdAtTime = data.createdAt ? new Date(data.createdAt).getTime() : 0;

            // Check if room is older than 24 hours or missing timestamp
            if (!createdAtTime || (now - createdAtTime) > TWENTY_FOUR_HOURS_MS) {
                // 1. Move to archived_rooms collection
                const archiveRef = doc(db, "games", "Monopoly", "archived_rooms", roomId);
                await setDoc(archiveRef, {
                    ...data,
                    archivedAt: new Date().toISOString(),
                    archiveReason: "Auto-purged after 24h expiration"
                });

                // 2. Remove from active rooms
                await deleteDoc(doc(db, "games", "Monopoly", "rooms", roomId));
                archivedCount++;
            }
        }

        if (archivedCount > 0) {
            console.log(`[Auto-Archive] Successfully moved and purged ${archivedCount} expired room(s).`);
        }
    } catch (err) {
        console.error("[Auto-Archive Error]: Failed to archive expired rooms:", err);
    }
}