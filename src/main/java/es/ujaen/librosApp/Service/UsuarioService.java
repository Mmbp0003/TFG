package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.DTO.DTOPerfil;
import es.ujaen.librosApp.model.Actividad;
import es.ujaen.librosApp.model.Carpeta;
import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.OptionalDouble;
import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CarpetaRepository carpetaRepository;

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private RelacionRepository relacionRepository;

    @Autowired
    private LibroRepository libroRepository;

    // ─────────────────────────────────────────────
    // CONSULTAS
    // ─────────────────────────────────────────────

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(int id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<Usuario> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // ─────────────────────────────────────────────
    // REGISTRO
    // ─────────────────────────────────────────────

    public Usuario registrar(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());
        if (existente.isPresent()) {
            throw new RuntimeException("Ese correo electrónico ya está registrado");
        }

        String claveCifrada = passwordEncoder.encode(usuario.getClave());
        usuario.setClave(claveCifrada);

        Usuario guardado = usuarioRepository.save(usuario);

        // Crear carpetas fijas automáticamente
        Carpeta leyendo = new Carpeta();
        leyendo.setNombre("Leyendo");
        leyendo.setTipo("LEYENDO");
        leyendo.setFijas(true);
        leyendo.setFechaCreacion(LocalDateTime.now());
        leyendo.setUsuario(guardado);
        carpetaRepository.save(leyendo);

        Carpeta leidos = new Carpeta();
        leidos.setNombre("Leídos");
        leidos.setTipo("LEIDOS");
        leidos.setFijas(true);
        leidos.setFechaCreacion(LocalDateTime.now());
        leidos.setUsuario(guardado);
        carpetaRepository.save(leidos);

        return guardado;
    }



    public void cambiarRol(int id, String nuevoRol) {
        Usuario usuario = obtenerPorId(id); // lanza RuntimeException si no existe
        usuario.setRol(nuevoRol);
        usuarioRepository.save(usuario);
    }


    public Usuario login(String email, String clave) {
        Usuario usu = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("El correo introducido no es correcto"));

        if (!passwordEncoder.matches(clave, usu.getClave())) {
            throw new RuntimeException("La contraseña introducida no es correcta");
        }
        return usu;
    }


    @Transactional
    public void borrarCuenta(int id) {
        Usuario usuario = obtenerPorId(id);

        // Recalcular media de los libros que ha reseñado antes de borrar
        List<Resena> resenas = resenaRepository.findByUsuarioId(id);
        Set<Integer> librosAfectados = resenas.stream()
                .map(r -> r.getLibro().getId())
                .collect(java.util.stream.Collectors.toSet());

        // Borrar relaciones
        relacionRepository.deleteBySeguidorId(id);
        relacionRepository.deleteBySeguidoId(id);

        // Limpiar libros guardados
        usuario.getLibrosGuardados().clear();
        usuarioRepository.save(usuario);

        // Borrar usuario (cascade borra reseñas, actividades, carpetas...)
        usuarioRepository.deleteById(id);

        // Recalcular media de libros afectados DESPUÉS de borrar las reseñas
        for (int libroId : librosAfectados) {
            List<Resena> resenasRestantes = resenaRepository.findByLibroId(libroId);
            double media = resenasRestantes.stream()
                    .mapToDouble(Resena::getPuntuacion)
                    .average()
                    .orElse(0.0);
            double mediaRedondeada = Math.round(media * 10.0) / 10.0;

            libroRepository.findById(libroId).ifPresent(libro -> {
                libro.setMediaValoracion(mediaRedondeada);
                libroRepository.save(libro);
            });
        }
    }


    public DTOPerfil obtenerPerfilDTO(int id) {
        Usuario usuario = obtenerPorId(id);

        DTOPerfil dto = new DTOPerfil();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());

        // Libros guardados
        dto.setLibrosGuardados(usuario.getLibrosGuardados().stream().map(l -> {
            DTOPerfil.LibroPerfil lp = new DTOPerfil.LibroPerfil();
            lp.setId(l.getId());
            lp.setTitulo(l.getTitulo());
            lp.setPortada(l.getPortada());
            return lp;
        }).toList());

        // Seguidores
        dto.setSeguidores(usuario.getSeguidores().stream().map(r -> {
            DTOPerfil.UsuarioPerfil up = new DTOPerfil.UsuarioPerfil();
            up.setId(r.seguidor().getId());
            up.setNombre(r.seguidor().getNombre());
            up.setApellidos(r.seguidor().getApellidos());
            return up;
        }).toList());

        // Siguiendo
        dto.setSiguiendo(usuario.getSiguiendo().stream().map(r -> {
            DTOPerfil.UsuarioPerfil up = new DTOPerfil.UsuarioPerfil();
            up.setId(r.getSeguidos().getId());
            up.setNombre(r.getSeguidos().getNombre());
            up.setApellidos(r.getSeguidos().getApellidos());
            return up;
        }).toList());

        // Carpetas
        dto.setCarpetas(usuario.getCarpetas().stream().map(c -> {
            DTOPerfil.CarpetaPerfil cp = new DTOPerfil.CarpetaPerfil();
            cp.setId(c.getId());
            cp.setNombre(c.getNombre());
            cp.setLibros(c.getLibros().stream().map(l -> {
                DTOPerfil.LibroPerfil lp = new DTOPerfil.LibroPerfil();
                lp.setId(l.getId());
                lp.setPortada(l.getPortada());
                return lp;
            }).toList());
            return cp;
        }).toList());

        // Estadísticas
        int anoActual = LocalDateTime.now().getYear();

        int totalLeidos = 0;
        for (Carpeta c : usuario.getCarpetas()) {
            if ("LEIDOS".equals(c.getTipo())) {
                totalLeidos = c.getLibros().size();
                break;
            }
        }

        long leidosAno = usuario.getActividades().stream()
                .filter(a -> a.getTipo() == Actividad.TipoActividad.LIBRO_ACABADO)
                .filter(a -> a.getFecha().getYear() == anoActual)
                .count();

        dto.setTotalLeidos(totalLeidos);
        dto.setLeidosEsteAno((int) leidosAno);

        List<Resena> resenasAnio = resenaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .filter(r -> r.getFechaCreacion().getYear() == anoActual)
                .toList();

        OptionalDouble media = resenasAnio.stream()
                .mapToDouble(Resena::getPuntuacion)
                .average();
        dto.setMediaResenas(media.isPresent()
                ? Math.round(media.getAsDouble() * 10.0) / 10.0
                : 0.0);

        dto.setValoracionesAnio(resenasAnio.size());

        return dto;
    }
}