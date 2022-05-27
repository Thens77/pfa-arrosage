package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Arrosage;
import com.iir4.emsi.repository.ArrosageRepository;
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
 * REST controller for managing {@link com.iir4.emsi.domain.Arrosage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArrosageResource {

    private final Logger log = LoggerFactory.getLogger(ArrosageResource.class);

    private static final String ENTITY_NAME = "arrosage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArrosageRepository arrosageRepository;

    public ArrosageResource(ArrosageRepository arrosageRepository) {
        this.arrosageRepository = arrosageRepository;
    }

    /**
     * {@code POST  /arrosages} : Create a new arrosage.
     *
     * @param arrosage the arrosage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new arrosage, or with status {@code 400 (Bad Request)} if the arrosage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/arrosages")
    public ResponseEntity<Arrosage> createArrosage(@RequestBody Arrosage arrosage) throws URISyntaxException {
        log.debug("REST request to save Arrosage : {}", arrosage);
        if (arrosage.getId() != null) {
            throw new BadRequestAlertException("A new arrosage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Arrosage result = arrosageRepository.save(arrosage);
        return ResponseEntity
            .created(new URI("/api/arrosages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /arrosages/:id} : Updates an existing arrosage.
     *
     * @param id the id of the arrosage to save.
     * @param arrosage the arrosage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated arrosage,
     * or with status {@code 400 (Bad Request)} if the arrosage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the arrosage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/arrosages/{id}")
    public ResponseEntity<Arrosage> updateArrosage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Arrosage arrosage
    ) throws URISyntaxException {
        log.debug("REST request to update Arrosage : {}, {}", id, arrosage);
        if (arrosage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, arrosage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!arrosageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Arrosage result = arrosageRepository.save(arrosage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, arrosage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /arrosages/:id} : Partial updates given fields of an existing arrosage, field will ignore if it is null
     *
     * @param id the id of the arrosage to save.
     * @param arrosage the arrosage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated arrosage,
     * or with status {@code 400 (Bad Request)} if the arrosage is not valid,
     * or with status {@code 404 (Not Found)} if the arrosage is not found,
     * or with status {@code 500 (Internal Server Error)} if the arrosage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/arrosages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Arrosage> partialUpdateArrosage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Arrosage arrosage
    ) throws URISyntaxException {
        log.debug("REST request to partial update Arrosage partially : {}, {}", id, arrosage);
        if (arrosage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, arrosage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!arrosageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Arrosage> result = arrosageRepository
            .findById(arrosage.getId())
            .map(existingArrosage -> {
                if (arrosage.getDate() != null) {
                    existingArrosage.setDate(arrosage.getDate());
                }
                if (arrosage.getDuree() != null) {
                    existingArrosage.setDuree(arrosage.getDuree());
                }
                if (arrosage.getQuantiteEau() != null) {
                    existingArrosage.setQuantiteEau(arrosage.getQuantiteEau());
                }

                return existingArrosage;
            })
            .map(arrosageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, arrosage.getId().toString())
        );
    }

    /**
     * {@code GET  /arrosages} : get all the arrosages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of arrosages in body.
     */
    @GetMapping("/arrosages")
    public List<Arrosage> getAllArrosages() {
        log.debug("REST request to get all Arrosages");
        return arrosageRepository.findAll();
    }

    /**
     * {@code GET  /arrosages/:id} : get the "id" arrosage.
     *
     * @param id the id of the arrosage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the arrosage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/arrosages/{id}")
    public ResponseEntity<Arrosage> getArrosage(@PathVariable Long id) {
        log.debug("REST request to get Arrosage : {}", id);
        Optional<Arrosage> arrosage = arrosageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(arrosage);
    }

    /**
     * {@code DELETE  /arrosages/:id} : delete the "id" arrosage.
     *
     * @param id the id of the arrosage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/arrosages/{id}")
    public ResponseEntity<Void> deleteArrosage(@PathVariable Long id) {
        log.debug("REST request to delete Arrosage : {}", id);
        arrosageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
