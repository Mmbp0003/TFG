package es.ujaen.librosApp;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class LibroAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibroAppApplication.class, args);
    }
}
