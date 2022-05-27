package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.EspaceVert;
import com.iir4.emsi.repository.EspaceVertRepository;
import com.iir4.emsi.security.SecurityUtils;
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
 * REST controller for managing {@link com.iir4.emsi.domain.EspaceVert}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EspaceVertResource {

    private final Logger log = LoggerFactory.getLogger(EspaceVertResource.class);

    private static final String ENTITY_NAME = "espaceVert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EspaceVertRepository espaceVertRepository;

    public EspaceVertResource(EspaceVertRepository espaceVertRepository) {
        this.espaceVertRepository = espaceVertRepository;
    }

    /**
     * {@code POST  /espace-verts} : Create a new espaceVert.
     *
     * @param espaceVert the espaceVert to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new espaceVert, or with status {@code 400 (Bad Request)} if the espaceVert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/espace-verts")
    public ResponseEntity<EspaceVert> createEspaceVert(@RequestBody EspaceVert espaceVert) throws URISyntaxException {
        log.debug("REST request to save EspaceVert : {}", espaceVert);
        if (espaceVert.getId() != null) {
            throw new BadRequestAlertException("A new espaceVert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EspaceVert result = espaceVertRepository.save(espaceVert);
        return ResponseEntity
            .created(new URI("/api/espace-verts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /espace-verts/:id} : Updates an existing espaceVert.
     *
     * @param id the id of the espaceVert to save.
     * @param espaceVert the espaceVert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated espaceVert,
     * or with status {@code 400 (Bad Request)} if the espaceVert is not valid,
     * or with status {@code 500 (Internal Server Error)} if the espaceVert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/espace-verts/{id}")
    public ResponseEntity<EspaceVert> updateEspaceVert(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EspaceVert espaceVert
    ) throws URISyntaxException {
        log.debug("REST request to update EspaceVert : {}, {}", id, espaceVert);
        if (espaceVert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, espaceVert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!espaceVertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EspaceVert result = espaceVertRepository.save(espaceVert);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, espaceVert.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /espace-verts/:id} : Partial updates given fields of an existing espaceVert, field will ignore if it is null
     *
     * @param id the id of the espaceVert to save.
     * @param espaceVert the espaceVert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated espaceVert,
     * or with status {@code 400 (Bad Request)} if the espaceVert is not valid,
     * or with status {@code 404 (Not Found)} if the espaceVert is not found,
     * or with status {@code 500 (Internal Server Error)} if the espaceVert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/espace-verts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EspaceVert> partialUpdateEspaceVert(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EspaceVert espaceVert
    ) throws URISyntaxException {
        log.debug("REST request to partial update EspaceVert partially : {}, {}", id, espaceVert);
        if (espaceVert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, espaceVert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!espaceVertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EspaceVert> result = espaceVertRepository
            .findById(espaceVert.getId())
            .map(existingEspaceVert -> {
                if (espaceVert.getLibelle() != null) {
                    existingEspaceVert.setLibelle(espaceVert.getLibelle());
                }
                if (espaceVert.getPhoto() != null) {
                    existingEspaceVert.setPhoto(espaceVert.getPhoto());
                }
                if (espaceVert.getPhotoContentType() != null) {
                    existingEspaceVert.setPhotoContentType(espaceVert.getPhotoContentType());
                }

                return existingEspaceVert;
            })
            .map(espaceVertRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, espaceVert.getId().toString())
        );
    }

    /**
     * {@code GET  /espace-verts} : get all the espaceVerts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of espaceVerts in body.
     */
    @GetMapping("/espace-verts")
    public List<EspaceVert> getAllEspaceVerts() {
        log.debug("REST request to get all EspaceVerts");
        if(SecurityUtils.getCurrentUserLogin().get().toString().equals("admin"))
        return espaceVertRepository.findAll();
        else {
        	return espaceVertRepository.findByUserIsCurrentUser() ;
        }
    }

    /**
     * {@code GET  /espace-verts/:id} : get the "id" espaceVert.
     *
     * @param id the id of the espaceVert to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the espaceVert, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/espace-verts/{id}")
    public ResponseEntity<EspaceVert> getEspaceVert(@PathVariable Long id) {
        log.debug("REST request to get EspaceVert : {}", id);
        Optional<EspaceVert> espaceVert = espaceVertRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(espaceVert);
    }

    /**
     * {@code DELETE  /espace-verts/:id} : delete the "id" espaceVert.
     *
     * @param id the id of the espaceVert to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/espace-verts/{id}")
    public ResponseEntity<Void> deleteEspaceVert(@PathVariable Long id) {
        log.debug("REST request to delete EspaceVert : {}", id);
        espaceVertRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
