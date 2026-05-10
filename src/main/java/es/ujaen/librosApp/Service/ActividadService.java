package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Actividad;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.model.Actividad.TipoActividad;
import es.ujaen.librosApp.repository.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActividadService {
    @Autowired
    private ActividadRepository actividadRepository;

    // MÉTODO BASE
    private void registrarAccion(Usuario usuario, TipoActividad tipo,
                                 Integer refId, String texto, Double valor) {

        Actividad actividad = new Actividad(usuario, tipo, refId, texto, valor);
        actividadRepository.save(actividad);
    }

    // --------- ACCIONES ---------

    public void registrarSeguimiento(Usuario usuario, Usuario seguido) {
        registrarAccion(usuario, TipoActividad.SEGUIMIENTO,
                seguido.getId(), seguido.getNombre(), null);
    }

    public void registrarLibroAcabado(Usuario usuario, int libroId, String titulo) {
        registrarAccion(usuario, TipoActividad.LIBRO_ACABADO,
                libroId, titulo, null);
    }

    public void registrarResena(Usuario usuario, int libroId, String titulo, double puntuacion) {
        registrarAccion(usuario, TipoActividad.RESENA,
                libroId, titulo, puntuacion);
    }

    public void registrarProgreso(Usuario usuario, int libroId, String titulo, double progreso) {
        registrarAccion(usuario, TipoActividad.PROGRESO,
                libroId, titulo, progreso);
    }

    public void registrarComentario(Usuario usuario, int refId, String texto) {
        registrarAccion(usuario, TipoActividad.COMENTARIO,
                refId, texto, null);
    }

    public void registrarCarpeta(Usuario usuario, String tituloLibro, String nombreCarpeta) {
        // Combinamos ambos textos con un separador "|"
        String infoCombinada = tituloLibro + "|" + nombreCarpeta;

        // El tercer parámetro (referenciaId) lo ponemos a null o 0
        // porque ahora la información va en el String.
        registrarAccion(usuario, TipoActividad.CARPETA, null, infoCombinada, null);
    }

    public Optional<Actividad> obtenerUltimoProgreso(int usuarioId, int libroId) {
        return actividadRepository.findTopByUsuarioIdAndReferenciaIdAndTipoOrderByFechaDesc( usuarioId, libroId, TipoActividad.PROGRESO);
    }

    // --------- CONSULTAS ---------

    public List<Actividad> obtenerPorUsuario(int usuarioId) {
        return actividadRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    public List<Actividad> obtenerFeed(List<Integer> usuariosIds) {
        return actividadRepository.findByUsuarioIdInOrderByFechaDesc(usuariosIds);
    }
}
