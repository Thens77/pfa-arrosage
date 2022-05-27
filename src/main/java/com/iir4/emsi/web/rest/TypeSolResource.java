package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.TypeSol;
import com.iir4.emsi.repository.TypeSolRepository;
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
 * REST controller for managing {@link com.iir4.emsi.domain.TypeSol}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeSolResource {

    private final Logger log = LoggerFactory.getLogger(TypeSolResource.class);

    private static final String ENTITY_NAME = "typeSol";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeSolRepository typeSolRepository;

    public TypeSolResource(TypeSolRepository typeSolRepository) {
        this.typeSolRepository = typeSolRepository;
    }

    /**
     * {@code POST  /type-sols} : Create a new typeSol.
     *
     * @param typeSol the typeSol to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeSol, or with status {@code 400 (Bad Request)} if the typeSol has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-sols")
    public ResponseEntity<TypeSol> createTypeSol(@RequestBody TypeSol typeSol) throws URISyntaxException {
        log.debug("REST request to save TypeSol : {}", typeSol);
        if (typeSol.getId() != null) {
            throw new BadRequestAlertException("A new typeSol cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeSol result = typeSolRepository.save(typeSol);
        return ResponseEntity
            .created(new URI("/api/type-sols/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-sols/:id} : Updates an existing typeSol.
     *
     * @param id the id of the typeSol to save.
     * @param typeSol the typeSol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeSol,
     * or with status {@code 400 (Bad Request)} if the typeSol is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeSol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-sols/{id}")
    public ResponseEntity<TypeSol> updateTypeSol(@PathVariable(value = "id", required = false) final Long id, @RequestBody TypeSol typeSol)
        throws URISyntaxException {
        log.debug("REST request to update TypeSol : {}, {}", id, typeSol);
        if (typeSol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeSol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeSolRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeSol result = typeSolRepository.save(typeSol);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, typeSol.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-sols/:id} : Partial updates given fields of an existing typeSol, field will ignore if it is null
     *
     * @param id the id of the typeSol to save.
     * @param typeSol the typeSol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeSol,
     * or with status {@code 400 (Bad Request)} if the typeSol is not valid,
     * or with status {@code 404 (Not Found)} if the typeSol is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeSol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-sols/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeSol> partialUpdateTypeSol(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeSol typeSol
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeSol partially : {}, {}", id, typeSol);
        if (typeSol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeSol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeSolRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeSol> result = typeSolRepository
            .findById(typeSol.getId())
            .map(existingTypeSol -> {
                if (typeSol.getLibelle() != null) {
                    existingTypeSol.setLibelle(typeSol.getLibelle());
                }

                return existingTypeSol;
            })
            .map(typeSolRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, typeSol.getId().toString())
        );
    }

    /**
     * {@code GET  /type-sols} : get all the typeSols.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeSols in body.
     */
    @GetMapping("/type-sols")
    public List<TypeSol> getAllTypeSols() {
        log.debug("REST request to get all TypeSols");
        return typeSolRepository.findAll();
    }

    /**
     * {@code GET  /type-sols/:id} : get the "id" typeSol.
     *
     * @param id the id of the typeSol to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeSol, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-sols/{id}")
    public ResponseEntity<TypeSol> getTypeSol(@PathVariable Long id) {
        log.debug("REST request to get TypeSol : {}", id);
        Optional<TypeSol> typeSol = typeSolRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeSol);
    }
    @GetMapping("/type-sols/zone/{id}")
    public List<TypeSol> getByZone(@PathVariable Long id) {
        log.debug("REST request to get zones by espace");
        return typeSolRepository.getByZone(id);
    }

    /**
     * {@code DELETE  /type-sols/:id} : delete the "id" typeSol.
     *
     * @param id the id of the typeSol to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-sols/{id}")
    public ResponseEntity<Void> deleteTypeSol(@PathVariable Long id) {
        log.debug("REST request to delete TypeSol : {}", id);
        typeSolRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
