package memory_mosaic.example.memory.mosaic.photo.service;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface PhotoService {

    public PhotoEntity uploadPhoto(MultipartFile file) throws IOException;

}
