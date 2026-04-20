package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Comentario;
import es.ujaen.librosApp.repository.ComentarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    public List<Comentario> obtenerPorResena(int resenaId) {
        return comentarioRepository.findByResenaId(resenaId);
    }

    public Comentario crear(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    public void borrar(int id) {
        comentarioRepository.deleteById(id);
    }

    public Comentario modificar(int id, String nuevoContenido) {
        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));

        comentario.setContenido(nuevoContenido);
        return comentarioRepository.save(comentario);
    }
}