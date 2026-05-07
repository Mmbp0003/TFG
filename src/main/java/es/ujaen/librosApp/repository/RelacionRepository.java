package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Relacion;
import es.ujaen.librosApp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RelacionRepository extends JpaRepository<Relacion, Integer> {

    Optional<Relacion> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);

    void deleteBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);
}
