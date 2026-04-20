package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario,Integer> {

    List<Comentario> findByResenaId(int resenaId);

}
