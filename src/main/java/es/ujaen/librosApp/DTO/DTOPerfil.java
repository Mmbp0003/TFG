package es.ujaen.librosApp.DTO;

import java.util.List;

public class DTOPerfil {

    private int id;
    private String nombre;
    private String apellidos;

    private int leidosEsteAno;
    private double mediaResenas;
    private int valoracionesAnio;
    private int totalLeidos;

    private List<LibroPerfil> librosGuardados;

    private List<UsuarioPerfil> seguidores;

    private List<UsuarioPerfil> siguiendo;

    private List<CarpetaPerfil> carpetas;

    public DTOPerfil(){}

    // GETTERS Y SETTERS
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public List<LibroPerfil> getLibrosGuardados() {
        return librosGuardados;
    }

    public void setLibrosGuardados(List<LibroPerfil> librosGuardados) {
        this.librosGuardados = librosGuardados;
    }

    public List<UsuarioPerfil> getSeguidores() {
        return seguidores;
    }

    public void setSeguidores(List<UsuarioPerfil> seguidores) {
        this.seguidores = seguidores;
    }

    public List<UsuarioPerfil> getSiguiendo() {
        return siguiendo;
    }

    public void setSiguiendo(List<UsuarioPerfil> siguiendo) {
        this.siguiendo = siguiendo;
    }

    public List<CarpetaPerfil> getCarpetas() {
        return carpetas;
    }

    public void setCarpetas(List<CarpetaPerfil> carpetas) {
        this.carpetas = carpetas;
    }

    public int getLeidosEsteAno() { return leidosEsteAno; }

    public void setLeidosEsteAno(int leidosEsteAno) { this.leidosEsteAno = leidosEsteAno; }

    public double getMediaResenas() { return mediaResenas; }

    public void setMediaResenas(double mediaResenas) { this.mediaResenas = mediaResenas; }

    public int getValoracionesAnio() { return valoracionesAnio; }

    public void setValoracionesAnio(int valoracionesAnio) { this.valoracionesAnio = valoracionesAnio; }

    public int getTotalLeidos() { return totalLeidos; }

    public void setTotalLeidos(int totalLeidos) { this.totalLeidos = totalLeidos; }

    // =====================================================
    // CLASES INTERNAS
    // =====================================================

    public static class UsuarioPerfil {

        private int id;
        private String nombre;
        private String apellidos;

        public UsuarioPerfil(){}

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getApellidos() {
            return apellidos;
        }

        public void setApellidos(String apellidos) {
            this.apellidos = apellidos;
        }


    }

    public static class LibroPerfil {

        private int id;
        private String titulo;
        private String portada;

        public LibroPerfil(){}

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getPortada() {
            return portada;
        }

        public void setPortada(String portada) {
            this.portada = portada;
        }
    }

    public static class CarpetaPerfil {

        private int id;
        private String nombre;

        private List<LibroPerfil> libros;

        public CarpetaPerfil(){}

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public List<LibroPerfil> getLibros() {
            return libros;
        }

        public void setLibros(List<LibroPerfil> libros) {
            this.libros = libros;
        }
    }
}