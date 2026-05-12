package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer> {

    List<Resena> findByLibroId(int libroId);

    List<Resena> findByUsuarioId(int usuarioId);
}