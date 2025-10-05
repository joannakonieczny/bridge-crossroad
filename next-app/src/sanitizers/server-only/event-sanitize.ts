import type { IEventDTO } from "@/models/event/event-types";

export function sanitizeEvent(event: IEventDTO) {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    location: event.location,
    organizer: event.organizer.toString(),
    attendees: event.attendees.map((a) => a.toString()),
    group: event.group.toString(),
    duration: event.duration,
    additionalDescription: event.additionalDescription,
    data: event.data,
    imageUrl: event.imageUrl,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}
