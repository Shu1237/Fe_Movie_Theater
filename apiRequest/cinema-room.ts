import http from "@/lib/http";

export const cinemaRoomRequest = {
  getAllCinemaRooms: () => http.get("/cinema-rooms"),
};
