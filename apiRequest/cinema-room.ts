import http from "@/lib/http";

export const cinemaRoomRequest = {
  getAllCinemaRooms: (access_token:string) =>
    http.get("/cinema-rooms", {
      headers:{
        "Authorization": `Bearer ${access_token}`
      }
    }),
};
