package es.ujaen.librosApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.parameters.P;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Libro {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    int id;

    //Preguntar como guardo la imagen
    String Portada;

    @NotBlank
    String titulo;

    @NotBlank
    String autor;

    @NotBlank
    @Size(max = 5000)
    String sinopis;

    @NotNull
    int paginas;

    @NotNull
    LocalDate fechaPublicacion;

    @Column(nullable = false)
    private double mediaValoracion = 0.0;

    //-------------------------------------RELACIONES-------------------------------------------------

    @JsonIgnore
    @OneToMany (mappedBy = "libro" ,cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resena> resenasLibro = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "libros")
    private List<Carpeta> carpetas;

    @JsonIgnore
    @ManyToMany(mappedBy = "librosGuardados")
    private List<Usuario> usuarios;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "libro_genero",
            joinColumns = @JoinColumn(name = "libro_id"),
            inverseJoinColumns = @JoinColumn(name = "genero_id")
    )
    private List<Genero> generos = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "libro_tag",
            joinColumns = @JoinColumn(name = "libro_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();



    //----------------------------CONSTRUCTORES-------------------------------

    public Libro(){}

    public Libro(int id, String portada, String titulo, String autor, String sinopis, int paginas, LocalDate fechaPublicacion){
        this.id = id;
        this.Portada = Objects.requireNonNull(portada);
        this.titulo = Objects.requireNonNull(titulo);
        this.autor = Objects.requireNonNull(autor);
        this.sinopis = Objects.requireNonNull(sinopis);
        this.paginas = Objects.requireNonNull(paginas);
        this.fechaPublicacion = Objects.requireNonNull(fechaPublicacion);
    }

    public Libro(String portada, String titulo, String autor, String sinopis, int paginas, LocalDate fechaPublicacion){
        this(0,portada, titulo, autor, sinopis, paginas, fechaPublicacion);
    }

    //-------------------------------------------GETTERS Y SETTERS------------------------------------------------------
    public void setId(int id) {this.id=id;}
    public int getId (){return id;}

    public void setPortada (String portada){ this.Portada = portada;}
    public String getPortada (){ return Portada; }

    public void setTitulo (String titulo ){this.titulo = titulo;}
    public String getTitulo () {return titulo;}

    public void setAutor (String autor){this.autor = autor;}
    public String getAutor ( ){ return autor; }

    public void setSinopis ( String sinopis) { this.sinopis = sinopis;}
    public String getSinopis () { return  sinopis;}

    public void setPaginas ( int paginas ){ this.paginas = paginas;}
    public int getPaginas () {return  paginas;}

    public void setFechaPublicacion (LocalDate fechaPublicacion){ this.fechaPublicacion = fechaPublicacion;}
    public LocalDate getFechaPublicacion (){ return fechaPublicacion; }

    public List<Resena> getResenasLibro() { return resenasLibro;}
    public void setResenasLibro(List<Resena> resenas) { this.resenasLibro = resenas;}

    public List<Carpeta> getCarpetas() { return carpetas; }
    public void setCarpetas(List<Carpeta> carpetas) { this.carpetas = carpetas; }

    public List<Usuario> getUsuarios() { return usuarios; }
    public void setUsuarios(List<Usuario> usuarios) { this.usuarios = usuarios; }

    public List<Genero> getGeneros() { return generos; }
    public void setGeneros(List<Genero> generos) {this.generos = generos;}

    public List<Tag> getTags() { return tags; }
    public void setTags(List<Tag> tags) { this.tags = tags; }

    public double getMediaValoracion() { return mediaValoracion; }
    public void setMediaValoracion(double mediaValoracion) { this.mediaValoracion = mediaValoracion; }

}
