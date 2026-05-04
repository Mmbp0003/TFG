package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Actividad;
import es.ujaen.librosApp.Service.ActividadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@CrossOrigin(origins = "*")
public class ActividadController {

    @Autowired
    private ActividadService actividadService;

    @GetMapping("/usuario/{id}")
    public List<Actividad> obtenerPorUsuario(@PathVariable int id) {
        return actividadService.obtenerPorUsuario(id);
    }


    @PostMapping("/feed")
    public List<Actividad> obtenerFeed(@RequestBody List<Integer> usuariosIds) {
        return actividadService.obtenerFeed(usuariosIds);
    }
}
