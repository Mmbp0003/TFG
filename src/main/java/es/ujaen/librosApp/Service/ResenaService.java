package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.repository.LibroRepository;
import es.ujaen.librosApp.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private ActividadService actividadService;

    public List<Resena> obtenerPorUsuario(int usuarioId) {
        return resenaRepository.findByUsuarioId(usuarioId);
    }

    public List<Resena> obtenerPorLibro(int libroId) {
        return resenaRepository.findByLibroId(libroId);
    }

    public Resena crear(Resena resena) {
        Resena guardada = resenaRepository.save(resena);

        // Actualizar media del libro
        recalcularMedia(resena.getLibro().getId());

        // Registrar actividad RESENA
        Libro libro = libroRepository.findById(resena.getLibro().getId())
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        actividadService.registrarResena(
                resena.getUsuario(),
                libro.getId(),
                libro.getTitulo(),
                resena.getPuntuacion()
        );

        return guardada;
    }

    public void borrar(int id) {
        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        int libroId = resena.getLibro().getId();

        actividadService.eliminarResenaActividad(resena.getUsuario().getId(), libroId);

        resenaRepository.deleteById(id);
        recalcularMedia(libroId);
    }



    public Resena modificar(int id, Double nuevaPuntuacion, String nuevoContenido) {
        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        resena.setPuntuacion(nuevaPuntuacion);
        resena.setContenido(nuevoContenido);
        Resena guardada = resenaRepository.save(resena);
        recalcularMedia(resena.getLibro().getId());
        return guardada;
    }

    // Recalcula y persiste la media de valoración del libro
    private void recalcularMedia(int libroId) {
        List<Resena> resenas = resenaRepository.findByLibroId(libroId);
        double media = resenas.stream()
                .mapToDouble(Resena::getPuntuacion)
                .average()
                .orElse(0.0);
        double mediaRedondeada = Math.round(media * 10.0) / 10.0;

        Libro libro = libroRepository.findById(libroId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        libro.setMediaValoracion(mediaRedondeada);
        libroRepository.save(libro);
    }
}