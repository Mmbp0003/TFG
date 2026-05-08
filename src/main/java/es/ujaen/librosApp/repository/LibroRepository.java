package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Integer> {

    List<Libro> findByTituloContainingIgnoreCase(String titulo);
    List<Libro> findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(String titulo, String autor);

    //Filtrado
    List<Libro> findByGenerosNombreIgnoreCase(String nombreGenero);
    List<Libro> findByTagsNombreIgnoreCase(String nombreTag); // Asumiendo que Tag tiene 'nombre'

}