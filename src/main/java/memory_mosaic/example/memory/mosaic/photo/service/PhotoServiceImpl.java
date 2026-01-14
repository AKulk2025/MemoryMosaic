package memory_mosaic.example.memory.mosaic.photo.service;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import memory_mosaic.example.memory.mosaic.photo.repository.PhotoRepository;
import org.springframework.stereotype.Service;

@Service
public class PhotoServiceImpl implements PhotoService{

    private PhotoRepository photoRepository;

    public PhotoServiceImpl(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }
    @Override
    public PhotoEntity savePhoto(PhotoEntity photoEntity) {
        return photoRepository.save(photoEntity);
    }
}
