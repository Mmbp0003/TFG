package es.ujaen.librosApp.repository;

import es.ujaen.librosApp.model.Carpeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarpetaRepository extends JpaRepository<Carpeta,Integer> {

    //Spring data JPA sirve para simplificar la persistencia de los datos del CRUD
    //Para añadir Query mas complejas ponemos un @query con la query y luego la funcion

    //Por ahora lo dejo asi hasta que empiece a dar funcionalidades

    List<Carpeta> findByUsuarioId (int idUsuario);

}
