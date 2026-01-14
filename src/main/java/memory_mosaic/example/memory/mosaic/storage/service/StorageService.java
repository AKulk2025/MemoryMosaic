package memory_mosaic.example.memory.mosaic.storage.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(MultipartFile invoicePdf);
}
