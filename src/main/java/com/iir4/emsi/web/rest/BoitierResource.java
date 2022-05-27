package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.Zone;
import com.iir4.emsi.repository.BoitierRepository;
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
 * REST controller for managing {@link com.iir4.emsi.domain.Boitier}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BoitierResource {

    private final Logger log = LoggerFactory.getLogger(BoitierResource.class);

    private static final String ENTITY_NAME = "boitier";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BoitierRepository boitierRepository;

    public BoitierResource(BoitierRepository boitierRepository) {
        this.boitierRepository = boitierRepository;
    }

    /**
     * {@code POST  /boitiers} : Create a new boitier.
     *
     * @param boitier the boitier to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boitier, or with status {@code 400 (Bad Request)} if the boitier has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/boitiers")
    public ResponseEntity<Boitier> createBoitier(@RequestBody Boitier boitier) throws URISyntaxException {
        log.debug("REST request to save Boitier : {}", boitier);
        if (boitier.getId() != null) {
            throw new BadRequestAlertException("A new boitier cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Boitier result = boitierRepository.save(boitier);
        return ResponseEntity
            .created(new URI("/api/boitiers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /boitiers/:id} : Updates an existing boitier.
     *
     * @param id the id of the boitier to save.
     * @param boitier the boitier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitier,
     * or with status {@code 400 (Bad Request)} if the boitier is not valid,
     * or with status {@code 500 (Internal Server Error)} if the boitier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/boitiers/{id}")
    public ResponseEntity<Boitier> updateBoitier(@PathVariable(value = "id", required = false) final Long id, @RequestBody Boitier boitier)
        throws URISyntaxException {
        log.debug("REST request to update Boitier : {}, {}", id, boitier);
        if (boitier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Boitier result = boitierRepository.save(boitier);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, boitier.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /boitiers/:id} : Partial updates given fields of an existing boitier, field will ignore if it is null
     *
     * @param id the id of the boitier to save.
     * @param boitier the boitier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitier,
     * or with status {@code 400 (Bad Request)} if the boitier is not valid,
     * or with status {@code 404 (Not Found)} if the boitier is not found,
     * or with status {@code 500 (Internal Server Error)} if the boitier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/boitiers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Boitier> partialUpdateBoitier(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Boitier boitier
    ) throws URISyntaxException {
        log.debug("REST request to partial update Boitier partially : {}, {}", id, boitier);
        if (boitier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Boitier> result = boitierRepository
            .findById(boitier.getId())
            .map(existingBoitier -> {
                if (boitier.getRefrence() != null) {
                    existingBoitier.setRefrence(boitier.getRefrence());
                }
                if (boitier.getNbrBranche() != null) {
                    existingBoitier.setNbrBranche(boitier.getNbrBranche());
                }

                return existingBoitier;
            })
            .map(boitierRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, boitier.getId().toString())
        );
    }

    /**
     * {@code GET  /boitiers} : get all the boitiers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boitiers in body.
     */
    @GetMapping("/boitiers")
    public List<Boitier> getAllBoitiers() {
        log.debug("REST request to get all Boitiers");
        return boitierRepository.findAll();
    }
    
    @GetMapping("/boitiers/zone/{id}")
    public List<Boitier> getByZone(@PathVariable Long id) {
        log.debug("REST request to get zones by espace");
        return boitierRepository.getByZone(id);
    }
    
    @GetMapping("/boitiers/boitiersdispo")
    public List<Boitier> getAllBoitiersdispo() {
        log.debug("REST request to get all Boitiers");
        return boitierRepository.boitiersDispo();
    }

    /**
     * {@code GET  /boitiers/:id} : get the "id" boitier.
     *
     * @param id the id of the boitier to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boitier, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/boitiers/{id}")
    public ResponseEntity<Boitier> getBoitier(@PathVariable Long id) {
        log.debug("REST request to get Boitier : {}", id);
        Optional<Boitier> boitier = boitierRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(boitier);
    }

    /**
     * {@code DELETE  /boitiers/:id} : delete the "id" boitier.
     *
     * @param id the id of the boitier to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/boitiers/{id}")
    public ResponseEntity<Void> deleteBoitier(@PathVariable Long id) {
        log.debug("REST request to delete Boitier : {}", id);
        boitierRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
