package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Grandeur;
import com.iir4.emsi.domain.Plante;
import com.iir4.emsi.repository.GrandeurRepository;
import com.iir4.emsi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.iir4.emsi.domain.Grandeur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrandeurResource {

    private final Logger log = LoggerFactory.getLogger(GrandeurResource.class);

    private static final String ENTITY_NAME = "grandeur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrandeurRepository grandeurRepository;

    public GrandeurResource(GrandeurRepository grandeurRepository) {
        this.grandeurRepository = grandeurRepository;
    }

    /**
     * {@code POST  /grandeurs} : Create a new grandeur.
     *
     * @param grandeur the grandeur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grandeur, or with status {@code 400 (Bad Request)} if the grandeur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grandeurs")
    public ResponseEntity<Grandeur> createGrandeur(@RequestBody Grandeur grandeur) throws URISyntaxException {
        log.debug("REST request to save Grandeur : {}", grandeur);
        if (grandeur.getId() != null) {
            throw new BadRequestAlertException("A new grandeur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grandeur result = grandeurRepository.save(grandeur);
        return ResponseEntity
            .created(new URI("/api/grandeurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grandeurs/:id} : Updates an existing grandeur.
     *
     * @param id the id of the grandeur to save.
     * @param grandeur the grandeur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grandeur,
     * or with status {@code 400 (Bad Request)} if the grandeur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grandeur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grandeurs/{id}")
    public ResponseEntity<Grandeur> updateGrandeur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grandeur grandeur
    ) throws URISyntaxException {
        log.debug("REST request to update Grandeur : {}, {}", id, grandeur);
        if (grandeur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grandeur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grandeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grandeur result = grandeurRepository.save(grandeur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grandeur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grandeurs/:id} : Partial updates given fields of an existing grandeur, field will ignore if it is null
     *
     * @param id the id of the grandeur to save.
     * @param grandeur the grandeur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grandeur,
     * or with status {@code 400 (Bad Request)} if the grandeur is not valid,
     * or with status {@code 404 (Not Found)} if the grandeur is not found,
     * or with status {@code 500 (Internal Server Error)} if the grandeur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grandeurs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grandeur> partialUpdateGrandeur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grandeur grandeur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grandeur partially : {}, {}", id, grandeur);
        if (grandeur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grandeur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grandeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grandeur> result = grandeurRepository
            .findById(grandeur.getId())
            .map(existingGrandeur -> {
                if (grandeur.getType() != null) {
                    existingGrandeur.setType(grandeur.getType());
                }
                if (grandeur.getValeur() != null) {
                    existingGrandeur.setValeur(grandeur.getValeur());
                }
                if (grandeur.getDate() != null) {
                    existingGrandeur.setDate(grandeur.getDate());
                }

                return existingGrandeur;
            })
            .map(grandeurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grandeur.getId().toString())
        );
    }

    /**
     * {@code GET  /grandeurs} : get all the grandeurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grandeurs in body.
     */
    @GetMapping("/grandeurs")
    public List<Grandeur> getAllGrandeurs() {
        log.debug("REST request to get all Grandeurs");
        return grandeurRepository.findAll();
    }
    @GetMapping("/grandeurs/zone/{id}")
    public List<Grandeur> getByZone(@PathVariable Long id) {
        log.debug("REST request to get zones by espace");
        return grandeurRepository.getByZone(id);
    }

    /**
     * {@code GET  /grandeurs/:id} : get the "id" grandeur.
     *
     * @param id the id of the grandeur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grandeur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grandeurs/{id}")
    public ResponseEntity<Grandeur> getGrandeur(@PathVariable Long id) {
        log.debug("REST request to get Grandeur : {}", id);
        Optional<Grandeur> grandeur = grandeurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grandeur);
    }

    /**
     * {@code DELETE  /grandeurs/:id} : delete the "id" grandeur.
     *
     * @param id the id of the grandeur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grandeurs/{id}")
    public ResponseEntity<Void> deleteGrandeur(@PathVariable Long id) {
        log.debug("REST request to delete Grandeur : {}", id);
        grandeurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
