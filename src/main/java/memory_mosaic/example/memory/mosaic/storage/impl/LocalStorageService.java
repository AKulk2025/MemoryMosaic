package memory_mosaic.example.memory.mosaic.storage.impl;

import memory_mosaic.example.memory.mosaic.storage.service.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalStorageService implements StorageService {
    @Override
    public String store(MultipartFile invoicePdf) {
        Path storageDirectory = Paths.get("storage/images");

        try {
            if(!Files.exists(storageDirectory)){
                Files.createDirectories(storageDirectory);
            }

            Path destinationPath = storageDirectory.resolve(invoicePdf.getOriginalFilename());
            Files.copy(invoicePdf.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            return invoicePdf.getOriginalFilename();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store invoice", e);
        }

    }
}
