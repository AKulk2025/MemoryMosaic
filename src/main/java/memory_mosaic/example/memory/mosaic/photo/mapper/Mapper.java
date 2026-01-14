package memory_mosaic.example.memory.mosaic.photo.mapper;

public interface Mapper<A, B> {
    B mapTo(A a);

    A mapFrom(B b);
}
