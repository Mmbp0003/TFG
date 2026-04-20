package es.ujaen.librosApp.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.time.LocalDate;

@Entity
public class Usuario {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    int id;

    @NotBlank
    String nombre;

    @NotBlank
    String apellidos;

    @NotNull
    @Past
    LocalDate fechaNacimiento;

    @Email
    @NotBlank
    String email;

    @NotBlank
    @Size(min = 5)
    String clave;

    @NotBlank
    String rol;

    //------------------------------------------- RELACIONES ---------------------------------------------------

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Carpeta> carpetas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resena> resenas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comentario> comentarios = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuario_libro",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "libro_id")
    )
    private List<Libro> librosGuardados = new ArrayList<>();

    @OneToMany(mappedBy = "seguidor", fetch = FetchType.LAZY)
    private List<Relacion> siguiendo = new ArrayList<>();

    @OneToMany(mappedBy = "seguido", fetch = FetchType.LAZY)
    private List<Relacion> seguidores = new ArrayList<>();

    // -------------------------------------CONSTRUCTORES -------------------------------------------------------

    public Usuario(){}

    public Usuario(int id, String Nombre, String apellidos, LocalDate fechaNacimiento, String email, String clave,
                   String rol){
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
        this.apellidos = Objects.requireNonNull(apellidos);
        this.fechaNacimiento = Objects.requireNonNull(fechaNacimiento);
        this.email = Objects.requireNonNull(email);
        this.clave = Objects.requireNonNull(clave);
        this.rol = Objects.requireNonNull(rol);
    }

    public Usuario(String nombre, String apellidos, LocalDate fechaNacimiento, String email, String clave, String rol){
        this(0,nombre,apellidos,fechaNacimiento,email,clave,rol);
    }

    //GETTERS Y SETTERS

    public int getId() { return  id; }

    public void setNombre(String nombre){this.nombre = nombre;}
    public String getNombre() { return  nombre;}

    public void setApellidos(String apellidos) {this.apellidos = apellidos;}
    public String getApellidos() {return apellidos;}

    public void setFechaNacimiento(LocalDate fechaNacimiento){ this.fechaNacimiento = fechaNacimiento; }
    public LocalDate getFechaNacimiento() {return fechaNacimiento;}

    public void setEmail (String email){this.email = email;}
    public String getEmail () {return email;}

    public void setClave (String clave){ this.clave = clave; }
    public String getClave () { return clave; }

    public void setRol (String rol) { this.rol = rol; }
    public String getRol (){ return  rol; }

    public void setCarpetas (List<Carpeta> carpetas){ this.carpetas = carpetas; }
    public List<Carpeta> getCarpetas () {return  carpetas;}

    public void setResenas (List<Resena> resenas ){this.resenas = resenas;}
    public List<Resena> getResenas () {return resenas;}

    public void setComentarios (List<Comentario> comentario) { this.comentarios = comentario; }
    public List<Comentario> getComentarios () { return comentarios; }

    public void setLibrosGuardados (List<Libro> librosGuardados) {this.librosGuardados = librosGuardados;}
    public List<Libro> getLibrosGuardados () {return librosGuardados;}

    public void setSiguiendo (List<Relacion> siguiendo){this.siguiendo = siguiendo;}
    public List<Relacion> getSiguiendo () {return siguiendo;}

    public void setSeguidores (List<Relacion> seguidores) {this.seguidores = seguidores;}
    public List<Relacion> getSeguidores () {return  seguidores;}

}
