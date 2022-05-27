package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Plantation;
import com.iir4.emsi.repository.PlantationRepository;
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
 * REST controller for managing {@link com.iir4.emsi.domain.Plantation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlantationResource {

    private final Logger log = LoggerFactory.getLogger(PlantationResource.class);

    private static final String ENTITY_NAME = "plantation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlantationRepository plantationRepository;

    public PlantationResource(PlantationRepository plantationRepository) {
        this.plantationRepository = plantationRepository;
    }

    /**
     * {@code POST  /plantations} : Create a new plantation.
     *
     * @param plantation the plantation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plantation, or with status {@code 400 (Bad Request)} if the plantation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plantations")
    public ResponseEntity<Plantation> createPlantation(@RequestBody Plantation plantation) throws URISyntaxException {
        log.debug("REST request to save Plantation : {}", plantation);
        if (plantation.getId() != null) {
            throw new BadRequestAlertException("A new plantation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plantation result = plantationRepository.save(plantation);
        return ResponseEntity
            .created(new URI("/api/plantations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plantations/:id} : Updates an existing plantation.
     *
     * @param id the id of the plantation to save.
     * @param plantation the plantation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plantation,
     * or with status {@code 400 (Bad Request)} if the plantation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plantation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plantations/{id}")
    public ResponseEntity<Plantation> updatePlantation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Plantation plantation
    ) throws URISyntaxException {
        log.debug("REST request to update Plantation : {}, {}", id, plantation);
        if (plantation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plantation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plantation result = plantationRepository.save(plantation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, plantation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plantations/:id} : Partial updates given fields of an existing plantation, field will ignore if it is null
     *
     * @param id the id of the plantation to save.
     * @param plantation the plantation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plantation,
     * or with status {@code 400 (Bad Request)} if the plantation is not valid,
     * or with status {@code 404 (Not Found)} if the plantation is not found,
     * or with status {@code 500 (Internal Server Error)} if the plantation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plantations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plantation> partialUpdatePlantation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Plantation plantation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Plantation partially : {}, {}", id, plantation);
        if (plantation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plantation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plantation> result = plantationRepository
            .findById(plantation.getId())
            .map(existingPlantation -> {
                if (plantation.getDate() != null) {
                    existingPlantation.setDate(plantation.getDate());
                }
                if (plantation.getNbrPlante() != null) {
                    existingPlantation.setNbrPlante(plantation.getNbrPlante());
                }

                return existingPlantation;
            })
            .map(plantationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, plantation.getId().toString())
        );
    }

    /**
     * {@code GET  /plantations} : get all the plantations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plantations in body.
     */
    @GetMapping("/plantations")
    public List<Plantation> getAllPlantations() {
        log.debug("REST request to get all Plantations");
        return plantationRepository.findAll();
    }

    /**
     * {@code GET  /plantations/:id} : get the "id" plantation.
     *
     * @param id the id of the plantation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plantation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plantations/{id}")
    public ResponseEntity<Plantation> getPlantation(@PathVariable Long id) {
        log.debug("REST request to get Plantation : {}", id);
        Optional<Plantation> plantation = plantationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(plantation);
    }

    /**
     * {@code DELETE  /plantations/:id} : delete the "id" plantation.
     *
     * @param id the id of the plantation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plantations/{id}")
    public ResponseEntity<Void> deletePlantation(@PathVariable Long id) {
        log.debug("REST request to delete Plantation : {}", id);
        plantationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
