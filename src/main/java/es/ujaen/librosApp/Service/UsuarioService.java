package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    public Usuario registrar(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());

        if (existente.isPresent()) {
            throw new RuntimeException("Ese correo electrónico ya está registrado");
        }

        String claveCifrada = passwordEncoder.encode(usuario.getClave());
        usuario.setClave(claveCifrada);

        return usuarioRepository.save(usuario);
    }

    public Usuario login(String email, String clave){
        Usuario usu = usuarioRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("El correo introducido no es correcto"));
        System.out.println("el usuario es" + usu.getEmail() + " y si contraseña es " + usu.getClave() );

        if (!passwordEncoder.matches(clave, usu.getClave())){
            throw new RuntimeException("La contraseá introducida no es correcta");
        }

        return usu;

    }


    public void borrarCuenta(int id) {
        usuarioRepository.deleteById(id);
    }
}