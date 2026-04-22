package es.ujaen.librosApp.seguridad;

import es.ujaen.librosApp.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(); //Para cifrar las contraseñas
    }

    //TENGO QUE ELIMINARLO !!!
    @Bean
    public CommandLineRunner encriptarUsuarios(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) { //Se ejecuta al iniciar la aplicación
        return args -> {
            usuarioRepository.findAll().forEach(usuario -> { //recorre todos los usuarios
                String clave = usuario.getClave(); //Obtiene la contraseña actual

                if (!clave.startsWith("$2a$")) { //Comprueba si esta cifrada
                    String claveCifrada = passwordEncoder.encode(clave); //Si no lo está la cifra
                    usuario.setClave(claveCifrada);
                    usuarioRepository.save(usuario); //Guarda la nueva contraseña
                    System.out.println("Usuario " + usuario.getEmail() + " actualizado y cifrado");
                }

            });
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { // Defino la protección
        http
                .csrf(csrf -> csrf.disable()) //Desactivamos protección SCRF
                .cors(cors -> {}) //Activa la configuración CORS
                //Define quien tiene permitido entrar a que endpoints/URL por ejemplo todos puede entrar a /api/usuarios/login asi no se bloquea
                //Define las reglas de seguridad
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/usuarios/login").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() { //Definimos que peticiones externas permitimos
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*")); //Cualquier origen
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); //Permite estos métodos
        config.setAllowedHeaders(Arrays.asList("*")); //Permite con cualquier cabecera

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
