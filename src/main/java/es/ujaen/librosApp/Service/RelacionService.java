package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Relacion;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.repository.RelacionRepository;
import es.ujaen.librosApp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class RelacionService {

    @Autowired
    private RelacionRepository relacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void seguir(int idSeguidor, int idSeguido) {
        if (idSeguidor == idSeguido) {
            throw new RuntimeException("No puedes seguirte a ti mismo.");
        }

        Usuario seguidor = usuarioRepository.findById(idSeguidor)
                .orElseThrow(() -> new RuntimeException("Seguidor no encontrado"));
        Usuario seguido = usuarioRepository.findById(idSeguido)
                .orElseThrow(() -> new RuntimeException("Usuario a seguir no encontrado"));

        if (relacionRepository.findBySeguidorAndSeguido(seguidor, seguido).isPresent()) {
            throw new RuntimeException("Ya sigues a este usuario.");
        }

        Relacion nuevaRelacion = new Relacion(LocalDate.now());
        nuevaRelacion.setSeguidor(seguidor);
        nuevaRelacion.setSeguidos(seguido);

        relacionRepository.save(nuevaRelacion);
    }

    @Transactional
    public void dejarDeSeguir(int idSeguidor, int idSeguido) {
        Usuario seguidor = usuarioRepository.findById(idSeguidor)
                .orElseThrow(() -> new RuntimeException("Seguidor no encontrado"));
        Usuario seguido = usuarioRepository.findById(idSeguido)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        relacionRepository.deleteBySeguidorAndSeguido(seguidor, seguido);
    }

    public boolean esSeguidor(int idSeguidor, int idSeguido) {
        Usuario seguidor = usuarioRepository.findById(idSeguidor).orElse(null);
        Usuario seguido = usuarioRepository.findById(idSeguido).orElse(null);

        if (seguidor == null || seguido == null) return false;

        return relacionRepository.findBySeguidorAndSeguido(seguidor, seguido).isPresent();
    }
}
