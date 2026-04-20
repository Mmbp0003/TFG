package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    public List<Resena> obtenerPorUsuario(int usuarioId) {
        return resenaRepository.findByUsuarioId(usuarioId);
    }

    public List<Resena> obtenerPorLibro(int libroId) {
        return resenaRepository.findByLibroId(libroId);
    }

    /* // 3. EL FUTURO ALGORITMO: Ordenar con amigos primero (Fase Avanzada del TFG)
    public List<Resena> obtenerPorLibroOrdenadoPorAmigos(int libroId, int idUsuarioActual) {
        List<Resena> todasLasResenas = resenaRepository.findByLibroId(libroId);
        Usuario usuarioActual = usuarioRepository.findById(idUsuarioActual)...
        List<Usuario> misAmigos = usuarioActual.getAmigos(); // Cuando tengas esta relación

        // Aquí usaríamos Java Streams para separar las reseñas de los amigos,
        // ponerlas al principio de una nueva lista, y luego añadir el resto.
        // Lo programaremos cuando tu entidad Usuario esté lista.
    }
    */


    public Resena crear(Resena resena) {
        //Añadir si el usuario ya ha reseñado esto
        return resenaRepository.save(resena);
    }


    public void borrar(int id) {
        resenaRepository.deleteById(id);
    }

    public Resena modificar(int id, Double nuevaPuntuacion, String nuevoContenido) {
        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        resena.setPuntuacion(nuevaPuntuacion);
        resena.setContenido(nuevoContenido);

        return resenaRepository.save(resena);
    }
}