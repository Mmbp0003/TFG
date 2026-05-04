package es.ujaen.librosApp.seguridad;

import es.ujaen.librosApp.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
    public CommandLineRunner encriptarUsuarios(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            usuarioRepository.findAll().forEach(usuario -> {
                String clave = usuario.getClave();
                if (!clave.startsWith("$2a$")) {
                    String claveCifrada = passwordEncoder.encode(clave);
                    usuario.setClave(claveCifrada);
                    usuarioRepository.save(usuario);
                    System.out.println("Usuario " + usuario.getEmail() + " actualizado y cifrado");
                }
            });
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enlazamos explícitamente el CORS
                .authorizeHttpRequests(auth -> auth
                        // Permitimos explícitamente las peticiones POST a registro y login
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/registro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        // Permitimos las carpetas de vistas y estáticos
                        .requestMatchers("/Vistas/**", "/js/**", "/css/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*"));
        // Añadimos OPTIONS, que es un método que usan los navegadores antes del POST por seguridad
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}