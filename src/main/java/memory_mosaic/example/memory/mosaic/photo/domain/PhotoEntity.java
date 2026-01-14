package memory_mosaic.example.memory.mosaic.photo.domain;

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
@Entity
@Table(name = "photos")
public class PhotoEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String filePath;

    private Double latitude;

    private Double longitude;

    private LocalDateTime takenAt;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    private UUID userId;
}
