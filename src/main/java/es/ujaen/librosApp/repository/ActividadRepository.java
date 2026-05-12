package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    List<Actividad> findByUsuarioIdOrderByFechaDesc(int usuarioId);

    List<Actividad> findByUsuarioIdInOrderByFechaDesc(List<Integer> usuariosIds);

    Optional<Actividad> findTopByUsuarioIdAndReferenciaIdAndTipoOrderByFechaDesc( int usuarioId, int libroId, Actividad.TipoActividad tipo);


}