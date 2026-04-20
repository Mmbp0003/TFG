package es.ujaen.librosApp.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.List;
import java.util.Objects;

@Entity
public class Resena {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    int id;

    @NotNull
    @Min(0)
    @Max(5)
    Double puntuacion;

    @Size(max = 5000)
    String contenido;

    //-----------------------------------------RELACIONES--------------------------------------------------
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "resena", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;

    @ManyToOne
    @JoinColumn (name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn (name = "libro_id")
    private Libro libro;

    //----------------------------------------CONSTRUCTORES----------------------------------------------------

    public Resena() { }

    public Resena(int id, Double puntuacion, String contenido){
        this.id = id;
        this.puntuacion = Objects.requireNonNull(puntuacion);
        this.contenido = Objects.requireNonNull(contenido);
    }

    public Resena(Double puntuacion, String contenido){
        this(0,puntuacion, contenido);
    }

    //--------------------------------------GETTERS Y SETTERS------------------------------------------------------

    public int getId () {return  id;}

    public void setPuntuacion (Double puntuacion) { this.puntuacion = puntuacion; }
    public Double getPuntuacion () {return  puntuacion;}

    public void setContenido (String contenido){this.contenido = contenido;}
    public String getContenido () {return contenido;}

    public void setComentarios (List<Comentario> comentarios){this.comentarios = comentarios;}
    public List<Comentario> getComentarios () {return comentarios;}

    public void setUsuario (Usuario usuario ){ this.usuario = usuario;}
    public Usuario getUsuario () {return  usuario;}

    public void setLibro (Libro libro) {this.libro= libro;}
    public Libro getLibro () {return libro;}
}
