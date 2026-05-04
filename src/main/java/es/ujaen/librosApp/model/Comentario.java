package es.ujaen.librosApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
public class Comentario {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    int id;

    @NotBlank
    @Size(max=1000)
    String contenido;

    @NotNull
    private LocalDateTime fechaCreacion;

    //--------------------------------------RELACIONES----------------------------------------------------
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "resena_id")
    Resena resena;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    Usuario usuario;

    //-----------------------------------CONSTRUCTORES----------------------------------------------

    public Comentario() {}

    public Comentario(int id, String contenido,LocalDateTime fechaCreacion) {
        this.id = id;
        this.contenido = Objects.requireNonNull(contenido);
        this.fechaCreacion = LocalDateTime.now();
    }

    public Comentario(String contenido,LocalDateTime fechaCreacion) {
        this(0,contenido,fechaCreacion);
    }

    //------------------------------------GETTERS Y SETTERS-------------------------------------------

    public int getId (){return id;}

    public void setContenido (String contenido ){ this.contenido = contenido; }
    public String getContenido (){return  contenido;}

    public void setResena(Resena resena) {this.resena = resena;}
    public Resena getResena() {return  resena;}

    public void setUsuario (Usuario usuario){ this.usuario = usuario; }
    public Usuario getUsuario () {return usuario;}

    public LocalDateTime getFechaCreacion () { return fechaCreacion; }
}
