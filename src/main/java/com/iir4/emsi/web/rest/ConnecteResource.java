package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Capteur;
import com.iir4.emsi.domain.Connecte;
import com.iir4.emsi.repository.ConnecteRepository;
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
 * REST controller for managing {@link com.iir4.emsi.domain.Connecte}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConnecteResource {

    private final Logger log = LoggerFactory.getLogger(ConnecteResource.class);

    private static final String ENTITY_NAME = "connecte";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConnecteRepository connecteRepository;

    public ConnecteResource(ConnecteRepository connecteRepository) {
        this.connecteRepository = connecteRepository;
    }

    /**
     * {@code POST  /connectes} : Create a new connecte.
     *
     * @param connecte the connecte to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new connecte, or with status {@code 400 (Bad Request)} if the connecte has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/connectes")
    public ResponseEntity<Connecte> createConnecte(@RequestBody Connecte connecte) throws URISyntaxException {
        log.debug("REST request to save Connecte : {}", connecte);
        if (connecte.getId() != null) {
            throw new BadRequestAlertException("A new connecte cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Connecte result = connecteRepository.save(connecte);
        return ResponseEntity
            .created(new URI("/api/connectes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /connectes/:id} : Updates an existing connecte.
     *
     * @param id the id of the connecte to save.
     * @param connecte the connecte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated connecte,
     * or with status {@code 400 (Bad Request)} if the connecte is not valid,
     * or with status {@code 500 (Internal Server Error)} if the connecte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/connectes/{id}")
    public ResponseEntity<Connecte> updateConnecte(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Connecte connecte
    ) throws URISyntaxException {
        log.debug("REST request to update Connecte : {}, {}", id, connecte);
        if (connecte.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, connecte.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!connecteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Connecte result = connecteRepository.save(connecte);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, connecte.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /connectes/:id} : Partial updates given fields of an existing connecte, field will ignore if it is null
     *
     * @param id the id of the connecte to save.
     * @param connecte the connecte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated connecte,
     * or with status {@code 400 (Bad Request)} if the connecte is not valid,
     * or with status {@code 404 (Not Found)} if the connecte is not found,
     * or with status {@code 500 (Internal Server Error)} if the connecte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/connectes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Connecte> partialUpdateConnecte(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Connecte connecte
    ) throws URISyntaxException {
        log.debug("REST request to partial update Connecte partially : {}, {}", id, connecte);
        if (connecte.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, connecte.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!connecteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Connecte> result = connecteRepository
            .findById(connecte.getId())
            .map(existingConnecte -> {
                if (connecte.getFonctionnel() != null) {
                    existingConnecte.setFonctionnel(connecte.getFonctionnel());
                }
                if (connecte.getBranche() != null) {
                    existingConnecte.setBranche(connecte.getBranche());
                }

                return existingConnecte;
            })
            .map(connecteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, connecte.getId().toString())
        );
    }

    /**
     * {@code GET  /connectes} : get all the connectes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of connectes in body.
     */
    @GetMapping("/connectes")
    public List<Connecte> getAllConnectes() {
        log.debug("REST request to get all Connectes");
        return connecteRepository.findAll();
    }
    
    @GetMapping("/connectes/Available")
    public List<Capteur> getAllCaps() {
        log.debug("REST request to get all Connectes");
        return connecteRepository.availableCap();
    }

    /**
     * {@code GET  /connectes/:id} : get the "id" connecte.
     *
     * @param id the id of the connecte to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the connecte, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/connectes/{id}")
    public ResponseEntity<Connecte> getConnecte(@PathVariable Long id) {
        log.debug("REST request to get Connecte : {}", id);
        Optional<Connecte> connecte = connecteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(connecte);
    }

    /**
     * {@code DELETE  /connectes/:id} : delete the "id" connecte.
     *
     * @param id the id of the connecte to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/connectes/{id}")
    public ResponseEntity<Void> deleteConnecte(@PathVariable Long id) {
        log.debug("REST request to delete Connecte : {}", id);
        connecteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
