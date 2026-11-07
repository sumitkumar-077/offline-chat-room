package com.substing.chat.repositories;

import com.substing.chat.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room,String> {

    //get room using id
    Room findByRoomId(String roomId);

}
