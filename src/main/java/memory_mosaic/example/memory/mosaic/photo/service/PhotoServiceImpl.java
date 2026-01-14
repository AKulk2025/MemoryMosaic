package memory_mosaic.example.memory.mosaic.photo.service;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import memory_mosaic.example.memory.mosaic.photo.repository.PhotoRepository;
import memory_mosaic.example.memory.mosaic.storage.service.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class PhotoServiceImpl implements PhotoService{

    private PhotoRepository photoRepository;
    private StorageService storageService;

    public PhotoServiceImpl(PhotoRepository photoRepository, StorageService storageService) {
        this.photoRepository = photoRepository;
        this.storageService = storageService;
    }
    @Override
    public PhotoEntity uploadPhoto(MultipartFile file) {
        String filePath = storageService.store(file);
        PhotoEntity photoEntity = PhotoEntity.builder()
                .filePath(filePath)
                .uploadedAt(LocalDateTime.now())
                .build();
        return photoRepository.save(photoEntity);
    }

}
