package memory_mosaic.example.memory.mosaic.photo.service;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoService {

    public PhotoEntity uploadPhoto(MultipartFile file);
}
