package memory_mosaic.example.memory.mosaic.photo.controller;

import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import memory_mosaic.example.memory.mosaic.photo.dto.PhotoDto;
import memory_mosaic.example.memory.mosaic.photo.mapper.Mapper;
import memory_mosaic.example.memory.mosaic.photo.mapper.PhotoMapperImpl;
import memory_mosaic.example.memory.mosaic.photo.service.PhotoService;
import memory_mosaic.example.memory.mosaic.photo.service.PhotoServiceImpl;
import memory_mosaic.example.memory.mosaic.storage.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
public class PhotoController {
    private StorageService storageService;
    private PhotoService photoService;
    private Mapper<PhotoEntity, PhotoDto> photoMapper;

    public PhotoController(StorageService storageService, PhotoService photoService, Mapper<PhotoEntity, PhotoDto> photoMapper) {
        this.storageService = storageService;
        this.photoService = photoService;
        this.photoMapper = photoMapper;
    }

    @PostMapping(path = "/photo/upload")
    public ResponseEntity<PhotoDto> testFileUpload(@RequestParam("photo") MultipartFile file) {
        String filePath = storageService.store(file);
        PhotoEntity photoEntity = PhotoEntity.builder()
                .filePath(filePath)
                .uploadedAt(LocalDateTime.now())
                .latitude(null)
                .longitude(null)
                .userId(null)
                .build();

        photoService.savePhoto(photoEntity);
        return new ResponseEntity<>(photoMapper.mapTo(photoEntity), HttpStatus.OK);
    }
}
