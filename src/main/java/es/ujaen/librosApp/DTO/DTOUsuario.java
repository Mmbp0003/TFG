package es.ujaen.librosApp.DTO;

import es.ujaen.librosApp.model.Usuario;

public class DTOUsuario {
    private int id;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol;


    public DTOUsuario(Usuario u) {
        this.id = u.getId();
        this.nombre = u.getNombre();
        this.apellidos = u.getApellidos();
        this.email = u.getEmail();
        this.rol = u.getRol();
    }

    // Getters y Setters
    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getApellidos() { return apellidos; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
}