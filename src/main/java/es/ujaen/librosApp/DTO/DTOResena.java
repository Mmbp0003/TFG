package es.ujaen.librosApp.DTO;

import es.ujaen.librosApp.model.Resena;

public class DTOResena {
    private int id;
    private double puntuacion;
    private String contenido;
    private String fechaCreacion;
    private int usuarioId;
    private String nombreUsuario;
    private String apellidosUsuario;

    public DTOResena(Resena resena) {
        this.id = resena.getId();
        this.puntuacion = resena.getPuntuacion();
        this.contenido = resena.getContenido();
        this.fechaCreacion = resena.getFechaCreacion().toString();
        if (resena.getUsuario() != null) {
            this.usuarioId = resena.getUsuario().getId();
            this.nombreUsuario = resena.getUsuario().getNombre();
            this.apellidosUsuario = resena.getUsuario().getApellidos();
        }
    }

    public int getId() { return id; }
    public double getPuntuacion() { return puntuacion; }
    public String getContenido() { return contenido; }
    public String getFechaCreacion() { return fechaCreacion; }
    public int getUsuarioId() { return usuarioId; }
    public String getNombreUsuario() { return nombreUsuario; }
    public String getApellidosUsuario() { return apellidosUsuario; }
}
