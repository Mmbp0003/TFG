package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Genero;
import es.ujaen.librosApp.Service.GeneroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generos")
public class GeneroController {

    @Autowired
    private GeneroService generoService;

    @GetMapping
    public List<Genero> listarTodos() {
        return generoService.obtenerTodos();
    }

    @PostMapping
    public Genero crear(@RequestBody Genero genero) {
        return generoService.crear(genero);
    }
}