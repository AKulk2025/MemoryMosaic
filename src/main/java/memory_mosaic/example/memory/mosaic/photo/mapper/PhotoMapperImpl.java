package memory_mosaic.example.memory.mosaic.photo.mapper;

import memory_mosaic.example.memory.mosaic.config.MapperConfig;
import memory_mosaic.example.memory.mosaic.photo.domain.PhotoEntity;
import memory_mosaic.example.memory.mosaic.photo.dto.PhotoDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Controller;

@Controller
public class PhotoMapperImpl implements Mapper<PhotoEntity, PhotoDto> {

    private ModelMapper modelMapper;

    public PhotoMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public PhotoDto mapTo(PhotoEntity photoEntity) {
        return modelMapper.map(photoEntity, PhotoDto.class);
    }

    @Override
    public PhotoEntity mapFrom(PhotoDto photoDto) {
        return modelMapper.map(photoDto, PhotoEntity.class);
    }
}
