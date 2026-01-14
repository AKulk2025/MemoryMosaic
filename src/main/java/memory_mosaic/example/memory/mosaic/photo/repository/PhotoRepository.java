package memory_mosaic.example.memory.mosaic.photo.repository;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PhotoRepository extends CrudRepository<PhotoEntity, UUID> {
}
