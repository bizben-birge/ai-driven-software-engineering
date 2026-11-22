import type { Equipment, Room, RoomRequirements } from '../types';

export function hasEnoughCapacity(room: Room, attendees: number): boolean {
  return room.capacity >= attendees;
}

export function hasAllEquipment(room: Room, required: readonly Equipment[]): boolean {
  return required.every((item) => room.equipment.includes(item));
}

export function filterRooms(rooms: readonly Room[], requirements: RoomRequirements): Room[] {
  return rooms.filter(
    (room) =>
      hasEnoughCapacity(room, requirements.attendees) &&
      hasAllEquipment(room, requirements.equipment)
  );
}

export function resolveSelectedRoom(matching: readonly Room[], selectedId: string): Room | null {
  return matching.find((room) => room.id === selectedId) ?? matching[0] ?? null;
}
