package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Carpeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarpetaRepository extends JpaRepository<Carpeta,Integer> {

    List<Carpeta> findByUsuarioId (int idUsuario);

}
