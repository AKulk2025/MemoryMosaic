package memory_mosaic.example.memory.mosaic.photo.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.lang.GeoLocation;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.GpsDirectory;
import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import memory_mosaic.example.memory.mosaic.photo.repository.PhotoRepository;
import memory_mosaic.example.memory.mosaic.storage.service.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Map;

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
        Map<String, Double> geoData = extractGeolocation(file);
        PhotoEntity photoEntity = PhotoEntity.builder()
                .filePath(filePath)
                .latitude(geoData.get("latitude"))
                .longitude(geoData.get("longitude"))
                .uploadedAt(LocalDateTime.now())
                .build();
        return photoRepository.save(photoEntity);
    }


    private Map<String, Double> extractGeolocation(MultipartFile file)  {
        try (InputStream stream = file.getInputStream()) {
            Metadata metadata = ImageMetadataReader.readMetadata(stream);
            GpsDirectory gpsDir = metadata.getFirstDirectoryOfType(GpsDirectory.class);
            if(gpsDir != null && gpsDir.getGeoLocation() != null) {
                GeoLocation location = gpsDir.getGeoLocation();
                return Map.of(
                        "latitude", location.getLatitude(),
                        "longitude", location.getLongitude()
                );
            }
        } catch (Exception e) {
            System.err.println("Scan failed: " + e.getMessage());
        }
        return Map.of();
    }

}
