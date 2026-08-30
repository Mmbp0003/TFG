package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Integer> {

    List<Libro> findByTituloContainingIgnoreCase(String titulo);
    List<Libro> findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(String titulo, String autor);

    //Filtrado
    List<Libro> findByGenerosNombreIgnoreCase(String nombreGenero);

    @Query("SELECT DISTINCT l FROM Libro l LEFT JOIN FETCH l.generos")
    List<Libro> findAllConGeneros();

    @Query("SELECT DISTINCT l FROM Libro l LEFT JOIN FETCH l.tags WHERE l IN :libros")
    List<Libro> findAllConTags(@Param("libros") List<Libro> libros);

}