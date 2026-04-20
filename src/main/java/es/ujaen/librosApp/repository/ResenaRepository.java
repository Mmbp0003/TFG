package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer> {

    List<Resena> findByLibroId(int libroId);

    List<Resena> findByUsuarioId(int usuarioId);
}