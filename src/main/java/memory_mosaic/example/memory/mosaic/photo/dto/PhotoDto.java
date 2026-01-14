package memory_mosaic.example.memory.mosaic.photo.dto;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PhotoDto {

    private UUID id;

    private String filePath;

    private Double latitude;

    private Double longitude;

    private LocalDateTime takenAt;

    private LocalDateTime uploadedAt;

    private UUID userId;
}
